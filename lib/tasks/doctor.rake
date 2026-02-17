# frozen_string_literal: true

require 'scry/helpers'
require 'scry/projects_config'

namespace :scry do
  desc 'Check system health: toolchain, infra files, managed projects'
  task :doctor do
    include Scry::Helpers

    repo_root = File.expand_path('../..', __dir__)

    log_step 'Toolchain status'
    %w[ruby bundler docker git].each do |tool|
      unless command_exists?(tool)
        puts "missing: #{tool}"
        next
      end
      version = run_or_throw([tool, '--version'], quiet: true).lines.first.strip
      puts "#{tool}: #{version}"
    end

    log_step 'Infra files'
    %w[infra/docker-compose.yml infra/.env.example infra/.env].each do |f|
      full = File.join(repo_root, f)
      puts "#{f}: #{File.exist?(full) ? 'ok' : 'missing'}"
    end

    log_step 'Managed projects'
    if Scry::MANAGED_PROJECTS.empty?
      puts '(none configured)'
      next
    end
    Scry::MANAGED_PROJECTS.each do |project|
      has_repo = File.directory?(project.path) && File.directory?(File.join(project.path, '.git'))
      puts "#{project.name}: #{has_repo ? 'ok' : 'missing'} (#{project.path})"
      next unless has_repo

      branch = run_or_throw(%w[git branch --show-current], cwd: project.path, quiet: true)
      push_urls = run_or_throw(
        %w[git remote get-url --all --push origin], cwd: project.path, quiet: true
      )
      urls = push_urls.lines.map(&:strip).reject(&:empty?).join(' | ')
      puts "branch: #{branch}"
      puts "push: #{urls}"
    end
  end
end
