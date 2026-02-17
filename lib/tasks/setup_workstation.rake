# frozen_string_literal: true

require 'scry/helpers'

namespace :scry do
  namespace :setup do
    desc 'Bootstrap workstation: clone repos, enforce dual push URLs'
    task :workstation do
      include Scry::Helpers

      home = ENV.fetch('HOME', '/home/sawyer')
      script_repo_root = File.expand_path('../..', __dir__)
      github_root = ENV.fetch('GITHUB_ROOT', File.join(home, 'github'))
      owner = ENV.fetch('GITHUB_OWNER', 'dunamismax')
      anchor_repo = ENV.fetch('GITHUB_ANCHOR_REPO', 'scryai')
      profile_repo = ENV.fetch('GITHUB_PROFILE_REPO', 'dunamismax')
      managed_project_repos = [] # Add new managed repos here as they are created.
      repos_index_path = File.join(github_root, profile_repo, 'REPOS.md')

      local_only = ENV.key?('LOCAL_ONLY')
      use_fallback = ENV.key?('USE_FALLBACK')
      restore_ssh = ENV.key?('RESTORE_SSH')

      fallback_repos = %w[
        scryai dunamismax BereanAI TALLstack c-from-the-ground-up codex-web configs
        hello-world-from-hell images imaging-services-website imagingservices
        mtg-card-bot mylife-rpg poddashboard xray-chrome
      ]

      repo_dir = ->(repo) { File.join(github_root, repo) }
      github_url = ->(repo) { "git@github.com:#{owner}/#{repo}.git" }
      codeberg_url = ->(repo) { "git@codeberg.org:#{owner}/#{repo}.git" }

      unique_ordered = lambda { |items|
        seen = Set.new
        items.map(&:strip).reject(&:empty?).select { |i| seen.add?(i) }
      }

      clone_or_fetch = lambda { |repo|
        target = repo_dir.call(repo)
        unless File.exist?(target)
          raise "Repository missing in local-only mode: #{target}" if local_only

          log_step "Cloning #{repo}"
          run_or_throw(['git', 'clone', github_url.call(repo), target])
          return
        end
        raise "Path exists but is not a git repository: #{target}" unless File.directory?(File.join(target, '.git'))

        if local_only
          log_step "Using local repository #{repo}"
          return
        end
        log_step "Fetching #{repo}"
        run_or_throw(%w[git fetch --all --prune], cwd: target)
      }

      ensure_dual_push_urls = lambda { |repo|
        target = repo_dir.call(repo)
        gh = github_url.call(repo)
        cb = codeberg_url.call(repo)

        remotes = run_or_throw(%w[git remote], cwd: target, quiet: true)
        remote_list = remotes.lines.map(&:strip).reject(&:empty?)
        run_or_throw(['git', 'remote', 'add', 'origin', gh], cwd: target) unless remote_list.include?('origin')

        run_or_throw(['git', 'remote', 'set-url', 'origin', gh], cwd: target)

        # Clear existing push URLs and set both
        system('git', '-C', target, 'config', '--unset-all', 'remote.origin.pushurl',
               out: File::NULL, err: File::NULL)
        run_or_throw(['git', 'remote', 'set-url', '--add', '--push', 'origin', gh], cwd: target)
        run_or_throw(['git', 'remote', 'set-url', '--add', '--push', 'origin', cb], cwd: target)
      }

      parse_repos_from_index = lambda { |markdown|
        repos = []
        in_section = false
        markdown.lines.each do |line|
          stripped = line.strip
          if stripped.start_with?('## ')
            if stripped == '## Repositories'
              in_section = true
              next
            end
            break if in_section
          end
          next unless in_section

          match = stripped.match(/\A###\s+([A-Za-z0-9._-]+)\s*\z/)
          repos << match[1] if match
        end
        unique_ordered.call(repos)
      }

      # --- Main flow ---

      log_step 'Checking workstation bootstrap prerequisites'
      required = %w[git ssh]
      required << 'bundler' if restore_ssh
      required.each do |tool|
        raise "Missing required tool: #{tool}" unless command_exists?(tool)

        puts "ok: #{tool}"
      end

      log_step 'Ensuring projects root'
      FileUtils.mkdir_p(github_root)
      puts "root: #{github_root}"

      clone_or_fetch.call(anchor_repo)
      anchor_canonical = File.realpath(repo_dir.call(anchor_repo))
      if File.realpath(script_repo_root) != anchor_canonical
        puts "note: running from #{script_repo_root}"
        puts "note: canonical anchor is #{anchor_canonical}"
      end

      if restore_ssh
        log_step 'Restoring encrypted SSH backup'
        run_or_throw(%w[bundle exec rake scry:setup:ssh_restore], cwd: script_repo_root)
      end

      clone_or_fetch.call(profile_repo)

      # Load repo plan
      parsed = []
      parsed = parse_repos_from_index.call(File.read(repos_index_path)) if File.exist?(repos_index_path)

      if parsed.empty?
        unless use_fallback
          raise "No repositories parsed from #{repos_index_path}. " \
                'Re-run with USE_FALLBACK=1 to load the built-in discovery list.'
        end
        synced = unique_ordered.call([anchor_repo, profile_repo, *managed_project_repos])
        discovered = unique_ordered.call([*synced, *fallback_repos])
        source = 'fallback'
        log_step 'Repository set'
        puts "warning: using fallback discovery list from #{repos_index_path}"
        puts 'warning: fallback mode is discovery-only; ' \
             'only anchor/profile/managed repos will be cloned or remote-configured'
        discovered.each { |repo| puts "- #{repo}" }
      else
        synced = unique_ordered.call([anchor_repo, profile_repo, *managed_project_repos, *parsed])
        discovered = synced
        source = 'index'
        log_step 'Repository set'
        synced.each { |repo| puts "- #{repo}" }
      end

      synced.each do |repo|
        next if [anchor_repo, profile_repo].include?(repo)

        clone_or_fetch.call(repo)
      end

      log_step 'Enforcing dual push URL policy'
      synced.each { |repo| ensure_dual_push_urls.call(repo) }

      log_step 'Remote summary'
      synced.each do |repo|
        push_urls = run_or_throw(
          %w[git remote get-url --all --push origin], cwd: repo_dir.call(repo), quiet: true
        )
        urls = push_urls.lines.map(&:strip).reject(&:empty?).join(' | ')
        puts "#{repo}: #{urls}"
      end

      if source == 'fallback'
        synced_set = synced.to_set
        discovery_only = discovered.reject { |r| synced_set.include?(r) }
        unless discovery_only.empty?
          log_step 'Fallback discovery-only repositories'
          discovery_only.each do |repo|
            target = repo_dir.call(repo)
            present = File.directory?(target) && File.directory?(File.join(target, '.git'))
            puts "#{repo}: #{present ? 'present' : 'missing'} (#{target})"
          end
        end
      end

      log_step 'Workstation bootstrap complete'
      puts 'mode: local-only' if local_only
      puts 'mode: fallback-discovery-only' if source == 'fallback'
      puts 'next: bundle exec rake scry:bootstrap'
    end
  end
end
