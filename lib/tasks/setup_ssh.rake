# frozen_string_literal: true

require 'digest'
require 'fileutils'
require 'json'
require 'openssl'
require 'socket'
require 'tempfile'
require 'tmpdir'
require 'scry/helpers'

namespace :scry do
  namespace :setup do
    # --- Shared constants ---
    SSH_KDF_ITERATIONS = 250_000
    SSH_KEY_LENGTH = 32
    SSH_SALT_LENGTH = 16
    SSH_IV_LENGTH = 12
    SSH_AUTH_TAG_LENGTH = 16
    SSH_FORMAT_MAGIC = 'SCRYSSH2'

    desc 'Create encrypted backup of ~/.ssh'
    task :ssh_backup do
      include Scry::Helpers

      passphrase = ENV.fetch('SCRY_SSH_BACKUP_PASSPHRASE', '')
      home = ENV.fetch('HOME', '/home/sawyer')
      ssh_dir = File.join(home, '.ssh')
      repo_root = File.expand_path('../..', __dir__)
      vault_dir = File.join(repo_root, 'vault', 'ssh')
      encrypted_file = ENV.fetch('SCRY_SSH_BACKUP_FILE', File.join(vault_dir, 'ssh-keys.tar.enc'))
      metadata_file = ENV.fetch('SCRY_SSH_METADATA_FILE', File.join(vault_dir, 'ssh-keys.meta.json'))

      derive_key = lambda { |salt|
        OpenSSL::KDF.pbkdf2_hmac(
          passphrase, salt: salt, iterations: SSH_KDF_ITERATIONS,
                      length: SSH_KEY_LENGTH, hash: 'SHA256'
        )
      }

      sha256_file = ->(path) { Digest::SHA256.hexdigest(File.binread(path)) }

      compute_source_snapshot = lambda { |root|
        entries = []
        file_count = 0
        total_bytes = 0

        visit = lambda { |current|
          Dir.children(current).sort.each do |name|
            path = File.join(current, name)
            rel = path.sub("#{root}/", '')
            mode = format('%03o', File.lstat(path).mode & 0o777)

            if File.symlink?(path)
              file_count += 1
              entries << "symlink #{rel} mode=#{mode} -> #{File.readlink(path)}"
            elsif File.directory?(path)
              entries << "dir #{rel} mode=#{mode}"
              visit.call(path)
            elsif File.file?(path)
              file_count += 1
              size = File.size(path)
              total_bytes += size
              file_hash = sha256_file.call(path)
              entries << "file #{rel} mode=#{mode} size=#{size} sha256=#{file_hash}"
            else
              entries << "other #{rel} mode=#{mode}"
            end
          end
        }

        visit.call(root)
        fingerprint = Digest::SHA256.hexdigest(entries.join("\n"))
        [fingerprint, file_count, total_bytes]
      }

      # --- Prerequisites ---
      log_step 'Checking SSH backup prerequisites'
      raise 'Missing required tool: tar' unless command_exists?('tar')

      puts 'ok: tar'
      raise "SSH directory not found: #{ssh_dir}" unless File.directory?(ssh_dir)
      raise 'Set SCRY_SSH_BACKUP_PASSPHRASE with at least 16 characters.' if passphrase.length < 16

      fingerprint, file_count, total_bytes = compute_source_snapshot.call(ssh_dir)

      # Check if backup is current
      if File.exist?(encrypted_file) && File.exist?(metadata_file)
        begin
          meta = JSON.parse(File.read(metadata_file))
          if meta['sourceFingerprint'] == fingerprint
            log_step 'SSH backup unchanged'
            puts "source fingerprint: #{fingerprint}"
            puts 'backup is already current; no files changed'
            next
          end
        rescue JSON::ParserError
          # Continue with backup
        end
      end

      Dir.mktmpdir('scry-ssh-backup-') do |temp_dir|
        log_step 'Creating encrypted SSH archive'
        ensure_dir(vault_dir)
        ensure_parent_dir(encrypted_file)

        temp_tar = File.join(temp_dir, 'ssh-keys.tar')
        run_or_throw(['tar', '-C', home, '-cf', temp_tar, '.ssh'])

        # Encrypt
        plaintext = File.binread(temp_tar)
        salt = OpenSSL::Random.random_bytes(SSH_SALT_LENGTH)
        iv = OpenSSL::Random.random_bytes(SSH_IV_LENGTH)
        key = derive_key.call(salt)

        cipher = OpenSSL::Cipher.new('aes-256-gcm')
        cipher.encrypt
        cipher.key = key
        cipher.iv = iv
        ciphertext = cipher.update(plaintext) + cipher.final
        auth_tag = cipher.auth_tag

        payload = SSH_FORMAT_MAGIC + salt + iv + auth_tag + ciphertext
        File.binwrite(encrypted_file, payload)
        File.chmod(0o600, encrypted_file)

        log_step 'Writing backup metadata'
        meta = {
          createdAt: Time.now.iso8601,
          host: Socket.gethostname,
          sourceDir: ssh_dir,
          encryptedBackupFile: encrypted_file,
          cipher: 'aes-256-gcm',
          kdf: 'pbkdf2',
          kdfDigest: 'sha256',
          kdfIterations: SSH_KDF_ITERATIONS,
          sourceFingerprint: fingerprint,
          sourceFileCount: file_count,
          sourceTotalBytes: total_bytes,
          encryptedBackupSha256: sha256_file.call(encrypted_file)
        }
        ensure_dir(File.dirname(metadata_file))
        File.write(metadata_file, "#{JSON.pretty_generate(meta)}\n")
        File.chmod(0o600, metadata_file)
      end

      log_step 'SSH backup complete'
      puts "created: #{encrypted_file}"
      puts "created: #{metadata_file}"
    end

    desc 'Restore ~/.ssh from encrypted backup'
    task :ssh_restore do
      include Scry::Helpers

      passphrase = ENV.fetch('SCRY_SSH_BACKUP_PASSPHRASE', '')
      home = ENV.fetch('HOME', '/home/sawyer')
      ssh_dir = File.join(home, '.ssh')
      ssh_config = File.join(ssh_dir, 'config')
      repo_root = File.expand_path('../..', __dir__)
      encrypted_file = ENV.fetch('SCRY_SSH_BACKUP_FILE',
                                 File.join(repo_root, 'vault', 'ssh', 'ssh-keys.tar.enc'))
      github_identity = ENV.fetch('SCRY_GITHUB_IDENTITY', '~/.ssh/id_ed25519')
      codeberg_identity = ENV.fetch('SCRY_CODEBERG_IDENTITY', '~/.ssh/id_ed25519')
      managed_block_start = '# >>> scry managed git hosts >>>'
      managed_block_end = '# <<< scry managed git hosts <<<'

      derive_key = lambda { |salt|
        OpenSSL::KDF.pbkdf2_hmac(
          passphrase, salt: salt, iterations: SSH_KDF_ITERATIONS,
                      length: SSH_KEY_LENGTH, hash: 'SHA256'
        )
      }

      # --- Prerequisites ---
      log_step 'Checking SSH restore prerequisites'
      raise 'Missing required tool: tar' unless command_exists?('tar')

      puts 'ok: tar'
      raise "Encrypted backup not found: #{encrypted_file}" unless File.exist?(encrypted_file)
      raise 'Set SCRY_SSH_BACKUP_PASSPHRASE with at least 16 characters.' if passphrase.length < 16

      Dir.mktmpdir('scry-ssh-restore-') do |temp_dir|
        temp_tar = File.join(temp_dir, 'ssh-keys.tar')
        extract_root = File.join(temp_dir, 'extract-root')

        log_step 'Decrypting and authenticating SSH archive'
        payload = File.binread(encrypted_file)
        magic_len = SSH_FORMAT_MAGIC.length
        min_len = magic_len + SSH_SALT_LENGTH + SSH_IV_LENGTH + SSH_AUTH_TAG_LENGTH + 1
        raise 'Encrypted SSH backup is malformed or truncated.' if payload.length < min_len
        raise 'Encrypted SSH backup format is unsupported.' unless payload[0, magic_len] == SSH_FORMAT_MAGIC

        offset = magic_len
        salt = payload[offset, SSH_SALT_LENGTH]
        offset += SSH_SALT_LENGTH
        iv = payload[offset, SSH_IV_LENGTH]
        offset += SSH_IV_LENGTH
        auth_tag = payload[offset, SSH_AUTH_TAG_LENGTH]
        offset += SSH_AUTH_TAG_LENGTH
        ciphertext = payload[offset..]

        key = derive_key.call(salt)
        cipher = OpenSSL::Cipher.new('aes-256-gcm')
        cipher.decrypt
        cipher.key = key
        cipher.iv = iv
        cipher.auth_tag = auth_tag

        begin
          plaintext = cipher.update(ciphertext) + cipher.final
        rescue OpenSSL::Cipher::CipherError
          raise 'Failed to decrypt and authenticate SSH backup. ' \
                'Check SCRY_SSH_BACKUP_PASSPHRASE and backup integrity.'
        end

        File.binwrite(temp_tar, plaintext)

        log_step 'Restoring ~/.ssh from decrypted archive'
        FileUtils.mkdir_p(home)
        FileUtils.mkdir_p(extract_root)
        run_or_throw(['tar', '-C', extract_root, '-xf', temp_tar])

        extracted_ssh = File.join(extract_root, '.ssh')
        raise 'Decrypted archive does not contain a .ssh directory.' unless File.directory?(extracted_ssh)

        FileUtils.rm_rf(ssh_dir)
        FileUtils.cp_r(extracted_ssh, ssh_dir)

        # Normalize permissions
        log_step 'Normalizing ~/.ssh permissions'
        raise "Restore completed but SSH directory is missing: #{ssh_dir}" unless File.directory?(ssh_dir)

        set_perms = lambda { |path|
          stat = File.lstat(path)
          return if stat.symlink?

          if File.directory?(path)
            File.chmod(0o700, path)
            Dir.children(path).each { |child| set_perms.call(File.join(path, child)) }
          elsif File.file?(path)
            mode = path.end_with?('.pub') || File.basename(path).include?('known_hosts') ? 0o644 : 0o600
            File.chmod(mode, path)
          end
        }
        set_perms.call(ssh_dir)

        # Ensure managed host config
        log_step 'Ensuring managed Git host entries in ~/.ssh/config'
        build_host_block = lambda { |host, identity|
          [
            "Host #{host}",
            "  HostName #{host}",
            '  User git',
            "  IdentityFile #{identity}",
            '  IdentitiesOnly yes'
          ].join("\n")
        }

        managed_block = [
          managed_block_start,
          build_host_block.call('github.com', github_identity),
          '',
          build_host_block.call('codeberg.org', codeberg_identity),
          managed_block_end,
          ''
        ].join("\n")

        existing = File.exist?(ssh_config) ? File.read(ssh_config).gsub("\r\n", "\n") : ''
        pattern = /#{Regexp.escape(managed_block_start)}[\s\S]*?#{Regexp.escape(managed_block_end)}\n?/
        without = existing.sub(pattern, '').strip

        next_config = if without.empty?
                        managed_block
                      else
                        result = "#{managed_block}\n#{without}"
                        result += "\n" unless result.end_with?("\n")
                        result
                      end

        File.write(ssh_config, next_config) unless existing == next_config
        File.chmod(0o600, ssh_config)
      end

      log_step 'SSH restore complete'
      puts "restored: #{ssh_dir}"
      puts 'next: ssh -T git@github.com'
      puts 'next: ssh -T git@codeberg.org'
    end
  end
end
