# frozen_string_literal: true

require 'fileutils'
require 'open3'

module Scry
  module Helpers
    module_function

    def log_step(message)
      puts "\n==> #{message}"
    end

    def ensure_dir(path)
      FileUtils.mkdir_p(path)
    end

    def ensure_parent_dir(path)
      FileUtils.mkdir_p(File.dirname(path))
    end

    def run_or_throw(cmd, cwd: nil, env: {}, quiet: false)
      puts "$ #{cmd.join(' ')}" unless quiet

      merged_env = ENV.to_h.merge(env)
      opts = { chdir: cwd }.compact

      stdout, stderr, status = Open3.capture3(merged_env, *cmd, **opts)

      unless status.success?
        warn stdout.strip unless stdout.strip.empty?
        warn stderr.strip unless stderr.strip.empty?
        raise "Command failed (#{status.exitstatus}): #{cmd.join(' ')}"
      end

      stdout.strip
    end

    def command_exists?(binary)
      system('which', binary, out: File::NULL, err: File::NULL)
    end
  end
end
