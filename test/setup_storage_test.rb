# frozen_string_literal: true

require 'fileutils'
require 'tmpdir'
require_relative 'test_helper'

class SetupStorageTaskTest < Minitest::Test
  include Scry::TestHelpers

  def test_adds_missing_keys_from_env_example
    Dir.mktmpdir('scry-storage-test-') do |tmp|
      env_example = File.join(tmp, '.env.example')
      env_file = File.join(tmp, '.env')

      File.write(env_example, "A=1\nB=2\nC=3\n")
      File.write(env_file, "A=7\n\n# keep this comment\n")

      with_env(
        'SCRY_INFRA_ENV_EXAMPLE' => env_example,
        'SCRY_INFRA_ENV_FILE' => env_file
      ) do
        task = Rake::Task['scry:setup:storage']
        task.reenable
        task.invoke
      end

      content = File.read(env_file)

      assert_includes content, "A=7\n"
      assert_includes content, "B=2\n"
      assert_includes content, "C=3\n"
    end
  end
end
