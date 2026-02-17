# frozen_string_literal: true

require 'scry/helpers'
require 'scry/projects_config'

namespace :scry do
  namespace :projects do
    desc 'List managed projects'
    task :list do
      include Scry::Helpers

      log_step 'Managed projects'
      if Scry::MANAGED_PROJECTS.empty?
        puts '(none configured)'
        next
      end
      Scry::MANAGED_PROJECTS.each do |project|
        puts "#{project.name}: #{project.path}"
      end
    end

    desc 'Install managed project dependencies'
    task :install do
      include Scry::Helpers

      optional = ENV.key?('OPTIONAL')

      log_step 'Install managed project dependencies'
      if Scry::MANAGED_PROJECTS.empty?
        puts '(none configured)'
        next
      end
      Scry::MANAGED_PROJECTS.each do |project|
        has_repo = File.directory?(project.path) && File.directory?(File.join(project.path, '.git'))
        unless has_repo
          message = "missing: #{project.name} (#{project.path})"
          if optional
            puts "skip: #{message}"
            next
          end
          raise message
        end
        puts "project: #{project.name}"
        run_or_throw(project.install_command, cwd: project.path)
      end
    end

    desc 'Run managed project verification'
    task :verify do
      include Scry::Helpers

      optional = ENV.key?('OPTIONAL')

      log_step 'Run managed project verification'
      if Scry::MANAGED_PROJECTS.empty?
        puts '(none configured)'
        next
      end
      Scry::MANAGED_PROJECTS.each do |project|
        has_repo = File.directory?(project.path) && File.directory?(File.join(project.path, '.git'))
        unless has_repo
          message = "missing: #{project.name} (#{project.path})"
          if optional
            puts "skip: #{message}"
            next
          end
          raise message
        end
        puts "project: #{project.name}"
        project.verify_commands.each do |command|
          run_or_throw(command, cwd: project.path)
        end
      end
    end

    desc 'Check managed project health'
    task :doctor do
      include Scry::Helpers

      log_step 'Managed project health'
      if Scry::MANAGED_PROJECTS.empty?
        puts '(none configured)'
        next
      end
      Scry::MANAGED_PROJECTS.each do |project|
        present = File.directory?(project.path) && File.directory?(File.join(project.path, '.git'))
        puts "#{project.name}: #{present ? 'ok' : 'missing'} (#{project.path})"
        next unless present

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
end
