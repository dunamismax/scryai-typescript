import { afterEach, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setupSshBackup } from "../../scripts/tasks/setup-ssh";

const touched: string[] = [];

afterEach(() => {
  for (const dir of touched.splice(0, touched.length)) {
    rmSync(dir, { force: true, recursive: true });
  }

  delete process.env.HOME;
  delete process.env.SCRY_SSH_BACKUP_PASSPHRASE;
  delete process.env.SCRY_SSH_BACKUP_FILE;
  delete process.env.SCRY_SSH_METADATA_FILE;
});

describe("setupSshBackup", () => {
  test("creates encrypted backup and metadata", () => {
    const dir = mkdtempSync(join(tmpdir(), "scry-ssh-backup-test-"));
    touched.push(dir);

    const home = join(dir, "home");
    const sshDir = join(home, ".ssh");
    const backupFile = join(dir, "vault", "ssh-keys.tar.enc");
    const metadataFile = join(dir, "vault", "ssh-keys.meta.json");

    mkdirSync(sshDir, { recursive: true });
    writeFileSync(join(sshDir, "id_ed25519"), "private\n");
    writeFileSync(join(sshDir, "id_ed25519.pub"), "public\n");

    process.env.HOME = home;
    process.env.SCRY_SSH_BACKUP_PASSPHRASE = "1234567890abcdef";
    process.env.SCRY_SSH_BACKUP_FILE = backupFile;
    process.env.SCRY_SSH_METADATA_FILE = metadataFile;

    setupSshBackup();

    expect(existsSync(backupFile)).toBeTrue();
    expect(existsSync(metadataFile)).toBeTrue();

    const metadata = JSON.parse(readFileSync(metadataFile, "utf8")) as {
      cipher: string;
      encryptedBackupFile: string;
      sourceDir: string;
      createdAt: string;
    };

    expect(metadata.encryptedBackupFile).toBe(backupFile);
    expect(metadata.sourceDir).toBe(sshDir);
    expect(metadata.cipher).toBe("aes-256-gcm");
    expect(new Date(metadata.createdAt).toString()).not.toBe("Invalid Date");
  });
});
