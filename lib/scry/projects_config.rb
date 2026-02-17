# frozen_string_literal: true

module Scry
  ManagedProject = Struct.new(:name, :path, :install_command, :verify_commands, keyword_init: true) do
    def initialize(name:, path:, install_command:, verify_commands: [])
      super
    end
  end

  GITHUB_ROOT = ENV.fetch('GITHUB_ROOT', File.join(ENV.fetch('HOME', '/home/sawyer'), 'github'))

  # Add managed project repos here as they are created.
  MANAGED_PROJECTS = [].freeze
end
