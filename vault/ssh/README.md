# SSH Vault

This directory stores an **encrypted** backup of `~/.ssh` for workstation recovery.

Files:

- `ssh-keys.tar.enc`: encrypted archive created by `bun run scry:setup:ssh_backup`
- `ssh-keys.meta.json`: metadata for the encrypted archive (timestamp, host, cipher/KDF)

Usage:

```bash
# Create/update encrypted backup
export SCRY_SSH_BACKUP_PASSPHRASE='use-a-long-unique-passphrase'
bun run scry:setup:ssh_backup

# Restore on a new system
export SCRY_SSH_BACKUP_PASSPHRASE='use-a-long-unique-passphrase'
bun run scry:setup:ssh_restore
```

Notes:

- Never store unencrypted private keys in this repository.
- `SCRY_SSH_BACKUP_PASSPHRASE` should be at least 16 characters.
- Backup encryption uses `AES-256-GCM` with PBKDF2-SHA256 key derivation.
- Re-running backup is idempotent when `~/.ssh` is unchanged.
- Restore replaces `~/.ssh`, normalizes permissions, and ensures managed git-host entries in `~/.ssh/config`.
