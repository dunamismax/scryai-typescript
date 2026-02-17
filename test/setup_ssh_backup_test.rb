# frozen_string_literal: true

require 'fileutils'
require 'json'
require 'time'
require 'tmpdir'
require_relative 'test_helper'

class SetupSshBackupTaskTest < Minitest::Test
  include Scry::TestHelpers

  def test_creates_backup_artifacts
    with_backup do |result|
      assert_path_exists result.fetch(:backup_file)
      assert_path_exists result.fetch(:metadata_file)

      metadata = result.fetch(:metadata)

      assert_equal result.fetch(:backup_file), metadata.fetch('encryptedBackupFile')
    end
  end

  def test_writes_iso8601_metadata
    with_backup do |result|
      metadata = result.fetch(:metadata)

      assert_equal 'aes-256-gcm', metadata.fetch('cipher')
      assert_equal result.fetch(:ssh_dir), metadata.fetch('sourceDir')
      assert_kind_of Time, Time.iso8601(metadata.fetch('createdAt'))
    end
  end

  private

  def with_backup
    Dir.mktmpdir('scry-ssh-backup-test-') do |tmp|
      home = File.join(tmp, 'home')
      ssh_dir = File.join(home, '.ssh')
      backup_file = File.join(tmp, 'vault', 'ssh-keys.tar.enc')
      metadata_file = File.join(tmp, 'vault', 'ssh-keys.meta.json')

      FileUtils.mkdir_p(ssh_dir)
      File.write(File.join(ssh_dir, 'id_ed25519'), "private\n")
      File.write(File.join(ssh_dir, 'id_ed25519.pub'), "public\n")

      with_env(
        'HOME' => home,
        'SCRY_SSH_BACKUP_PASSPHRASE' => '1234567890abcdef',
        'SCRY_SSH_BACKUP_FILE' => backup_file,
        'SCRY_SSH_METADATA_FILE' => metadata_file
      ) do
        task = Rake::Task['scry:setup:ssh_backup']
        task.reenable
        task.invoke
      end

      metadata = JSON.parse(File.read(metadata_file))
      yield({ backup_file: backup_file, metadata_file: metadata_file, metadata: metadata, ssh_dir: ssh_dir })
    end
  end
end
