import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { logStep, runOrThrow } from "../common";
import { decrypt } from "../crypto";

const CONFIG_FORMAT_MAGIC = "SCRYCFG1";

const REQUIRED_RESTORE_PATHS = [
  ".openclaw/openclaw.json",
  ".openclaw/credentials",
  ".openclaw/cron/jobs.json",
  ".openclaw/identity",
] as const;

export function verifyConfigBackup(): void {
  const passphrase = process.env.SCRY_CONFIG_BACKUP_PASSPHRASE ?? "";
  const repoRoot = resolve(".");
  const encryptedFile =
    process.env.SCRY_CONFIG_BACKUP_FILE ??
    join(repoRoot, "vault", "config", "critical-configs.tar.enc");

  logStep("Checking config backup verification prerequisites");

  if (passphrase.length < 16) {
    throw new Error(
      "Set SCRY_CONFIG_BACKUP_PASSPHRASE with at least 16 characters before verification.",
    );
  }

  if (!existsSync(encryptedFile)) {
    throw new Error(`Encrypted backup file not found: ${encryptedFile}`);
  }

  const encrypted = readFileSync(encryptedFile);

  logStep("Decrypting and extracting backup payload to temp workspace");

  const tempDir = mkdtempSync(join(tmpdir(), "scry-config-verify-"));

  try {
    const plaintext = decrypt(encrypted, passphrase, {
      magic: CONFIG_FORMAT_MAGIC,
    });

    const tarPath = join(tempDir, "critical-configs.tar");

    writeFileSync(tarPath, plaintext);
    runOrThrow(["tar", "-xf", tarPath, "-C", tempDir]);

    logStep("Validating required restore paths");
    const missing: string[] = [];

    for (const relativePath of REQUIRED_RESTORE_PATHS) {
      const absolutePath = join(tempDir, relativePath);
      if (!existsSync(absolutePath)) {
        missing.push(relativePath);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Restore preview missing required paths: ${missing.join(", ")}`,
      );
    }

    const tarSize = statSync(tarPath).size;

    logStep("Config backup verification passed");
    console.log(`artifact: ${encryptedFile}`);
    console.log(`decrypted tar bytes: ${tarSize}`);
    console.log(
      `required restore paths: ${REQUIRED_RESTORE_PATHS.length} present`,
    );
    console.log(`home reference: ${process.env.HOME ?? homedir()}`);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}
