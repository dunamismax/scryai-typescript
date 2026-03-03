import { createDecipheriv, pbkdf2Sync } from "node:crypto";
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

const CONFIG_KDF_ITERATIONS = 250_000;
const CONFIG_KEY_LENGTH = 32;
const CONFIG_SALT_LENGTH = 16;
const CONFIG_IV_LENGTH = 12;
const CONFIG_AUTH_TAG_LENGTH = 16;
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
  const headerLength =
    CONFIG_FORMAT_MAGIC.length +
    CONFIG_SALT_LENGTH +
    CONFIG_IV_LENGTH +
    CONFIG_AUTH_TAG_LENGTH;

  if (encrypted.length <= headerLength) {
    throw new Error("Encrypted backup payload is too short or malformed.");
  }

  const magic = encrypted
    .subarray(0, CONFIG_FORMAT_MAGIC.length)
    .toString("utf8");
  if (magic !== CONFIG_FORMAT_MAGIC) {
    throw new Error(
      `Unexpected backup format magic: ${magic} (expected ${CONFIG_FORMAT_MAGIC})`,
    );
  }

  const saltStart = CONFIG_FORMAT_MAGIC.length;
  const ivStart = saltStart + CONFIG_SALT_LENGTH;
  const tagStart = ivStart + CONFIG_IV_LENGTH;
  const cipherStart = tagStart + CONFIG_AUTH_TAG_LENGTH;

  const salt = encrypted.subarray(saltStart, ivStart);
  const iv = encrypted.subarray(ivStart, tagStart);
  const authTag = encrypted.subarray(tagStart, cipherStart);
  const ciphertext = encrypted.subarray(cipherStart);

  const key = pbkdf2Sync(
    passphrase,
    salt,
    CONFIG_KDF_ITERATIONS,
    CONFIG_KEY_LENGTH,
    "sha256",
  );

  logStep("Decrypting and extracting backup payload to temp workspace");

  const tempDir = mkdtempSync(join(tmpdir(), "scry-config-verify-"));

  try {
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    let plaintext: Buffer;
    try {
      plaintext = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]);
    } catch {
      throw new Error(
        "Failed to decrypt and authenticate config backup. Check passphrase and artifact integrity.",
      );
    }

    const tarPath = join(tempDir, "critical-configs.tar");
    const extractDir = join(tempDir, "restore-preview");

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
    console.log(`preview root: ${tempDir}`);
    console.log(`home reference: ${process.env.HOME ?? homedir()}`);

    // Keep a deterministic extracted root marker for debugging output readability.
    if (!existsSync(extractDir)) {
      // no-op, extraction is directly into tempDir based on stored relative paths.
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}
