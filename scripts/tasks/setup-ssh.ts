import {
  createCipheriv,
  createDecipheriv,
  createHash,
  pbkdf2Sync,
  randomBytes,
} from "node:crypto";
import {
  chmodSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir, hostname, tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import {
  commandExists,
  ensureDir,
  ensureParentDir,
  logStep,
  runOrThrow,
} from "../common";

const SSH_KDF_ITERATIONS = 250_000;
const SSH_KEY_LENGTH = 32;
const SSH_SALT_LENGTH = 16;
const SSH_IV_LENGTH = 12;
const SSH_AUTH_TAG_LENGTH = 16;
const SSH_FORMAT_MAGIC = "SCRYSSH2";

function sourceSnapshot(root: string): {
  fingerprint: string;
  fileCount: number;
  totalBytes: number;
} {
  const entries: string[] = [];
  let fileCount = 0;
  let totalBytes = 0;

  const walk = (current: string) => {
    for (const name of readdirSync(current).sort()) {
      const path = join(current, name);
      const stats = lstatSync(path);
      const rel = path.replace(`${root}/`, "");
      const mode = (stats.mode & 0o777).toString(8).padStart(3, "0");

      if (stats.isSymbolicLink()) {
        fileCount += 1;
        entries.push(`symlink ${rel} mode=${mode} -> ${readlinkSync(path)}`);
        continue;
      }

      if (stats.isDirectory()) {
        entries.push(`dir ${rel} mode=${mode}`);
        walk(path);
        continue;
      }

      if (stats.isFile()) {
        fileCount += 1;
        totalBytes += stats.size;
        const content = readFileSync(path);
        const fileHash = createHash("sha256").update(content).digest("hex");
        entries.push(
          `file ${rel} mode=${mode} size=${stats.size} sha256=${fileHash}`,
        );
        continue;
      }

      entries.push(`other ${rel} mode=${mode}`);
    }
  };

  walk(root);

  const fingerprint = createHash("sha256")
    .update(entries.join("\n"))
    .digest("hex");

  return { fingerprint, fileCount, totalBytes };
}

function buildManagedBlock(
  githubHostAlias: string,
  githubHostName: string,
  githubIdentity: string,
  codebergHostAlias: string,
  codebergHostName: string,
  codebergIdentity: string,
): string {
  const block = (hostAlias: string, hostName: string, identity: string) =>
    [
      `Host ${hostAlias}`,
      `  HostName ${hostName}`,
      "  User git",
      `  IdentityFile ${identity}`,
      "  IdentitiesOnly yes",
    ].join("\n");

  return [
    "# >>> scry managed git hosts >>>",
    block(githubHostAlias, githubHostName, githubIdentity),
    "",
    block(codebergHostAlias, codebergHostName, codebergIdentity),
    "# <<< scry managed git hosts <<<",
    "",
  ].join("\n");
}

export function setupSshBackup(): void {
  const passphrase = process.env.SCRY_SSH_BACKUP_PASSPHRASE ?? "";
  const home = process.env.HOME ?? homedir();
  const sshDir = join(home, ".ssh");
  const repoRoot = resolve(".");
  const vaultDir = join(repoRoot, "vault", "ssh");
  const encryptedFile =
    process.env.SCRY_SSH_BACKUP_FILE ?? join(vaultDir, "ssh-keys.tar.enc");
  const metadataFile =
    process.env.SCRY_SSH_METADATA_FILE ?? join(vaultDir, "ssh-keys.meta.json");

  logStep("Checking SSH backup prerequisites");
  if (!commandExists("tar")) {
    throw new Error("Missing required tool: tar");
  }
  console.log("ok: tar");

  if (!existsSync(sshDir)) {
    throw new Error(`SSH directory not found: ${sshDir}`);
  }

  if (passphrase.length < 16) {
    throw new Error(
      "Set SCRY_SSH_BACKUP_PASSPHRASE with at least 16 characters.",
    );
  }

  const { fingerprint, fileCount, totalBytes } = sourceSnapshot(sshDir);

  if (existsSync(encryptedFile) && existsSync(metadataFile)) {
    try {
      const metadata = JSON.parse(readFileSync(metadataFile, "utf8")) as {
        sourceFingerprint?: string;
      };
      if (metadata.sourceFingerprint === fingerprint) {
        logStep("SSH backup unchanged");
        console.log(`source fingerprint: ${fingerprint}`);
        console.log("backup is already current; no files changed");
        return;
      }
    } catch {
      // continue backup when metadata is invalid
    }
  }

  const tempDir = join(tmpdir(), `scry-ssh-backup-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  try {
    logStep("Creating encrypted SSH archive");
    ensureDir(vaultDir);
    ensureParentDir(encryptedFile);

    const tempTar = join(tempDir, "ssh-keys.tar");
    runOrThrow(["tar", "-C", home, "-cf", tempTar, ".ssh"]);

    const plaintext = readFileSync(tempTar);
    const salt = randomBytes(SSH_SALT_LENGTH);
    const iv = randomBytes(SSH_IV_LENGTH);
    const key = pbkdf2Sync(
      passphrase,
      salt,
      SSH_KDF_ITERATIONS,
      SSH_KEY_LENGTH,
      "sha256",
    );

    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    const payload = Buffer.concat([
      Buffer.from(SSH_FORMAT_MAGIC),
      salt,
      iv,
      authTag,
      ciphertext,
    ]);
    writeFileSync(encryptedFile, payload);
    chmodSync(encryptedFile, 0o600);

    logStep("Writing backup metadata");

    const metadata = {
      createdAt: new Date().toISOString(),
      host: hostname(),
      sourceDir: sshDir,
      encryptedBackupFile: encryptedFile,
      cipher: "aes-256-gcm",
      kdf: "pbkdf2",
      kdfDigest: "sha256",
      kdfIterations: SSH_KDF_ITERATIONS,
      sourceFingerprint: fingerprint,
      sourceFileCount: fileCount,
      sourceTotalBytes: totalBytes,
      encryptedBackupSha256: createHash("sha256")
        .update(readFileSync(encryptedFile))
        .digest("hex"),
    };

    ensureDir(dirname(metadataFile));
    writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
    chmodSync(metadataFile, 0o600);
  } finally {
    rmSync(tempDir, { force: true, recursive: true });
  }

  logStep("SSH backup complete");
  console.log(`created: ${encryptedFile}`);
  console.log(`created: ${metadataFile}`);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function setupSshRestore(): void {
  const passphrase = process.env.SCRY_SSH_BACKUP_PASSPHRASE ?? "";
  const home = process.env.HOME ?? homedir();
  const sshDir = join(home, ".ssh");
  const repoRoot = resolve(".");
  const restoreStamp = `${Date.now()}`;
  const stagedSshDir = join(home, `.ssh.scry-staged-${restoreStamp}`);
  const backupSshDir = join(home, `.ssh.scry-backup-${restoreStamp}`);

  const encryptedFile =
    process.env.SCRY_SSH_BACKUP_FILE ??
    join(repoRoot, "vault", "ssh", "ssh-keys.tar.enc");
  const githubHostAlias =
    process.env.SCRY_GITHUB_HOST_ALIAS ?? "github.com-dunamismax";
  const githubHostName = process.env.SCRY_GITHUB_HOSTNAME ?? "github.com";
  const codebergHostAlias =
    process.env.SCRY_CODEBERG_HOST_ALIAS ?? "codeberg.org-dunamismax";
  const codebergHostName = process.env.SCRY_CODEBERG_HOSTNAME ?? "codeberg.org";
  const githubIdentity =
    process.env.SCRY_GITHUB_IDENTITY ?? "~/.ssh/id_ed25519";
  const codebergIdentity =
    process.env.SCRY_CODEBERG_IDENTITY ?? "~/.ssh/id_ed25519";

  logStep("Checking SSH restore prerequisites");
  if (!commandExists("tar")) {
    throw new Error("Missing required tool: tar");
  }
  console.log("ok: tar");

  if (!existsSync(encryptedFile)) {
    throw new Error(`Encrypted backup not found: ${encryptedFile}`);
  }

  if (passphrase.length < 16) {
    throw new Error(
      "Set SCRY_SSH_BACKUP_PASSPHRASE with at least 16 characters.",
    );
  }

  const tempDir = join(tmpdir(), `scry-ssh-restore-${restoreStamp}`);
  mkdirSync(tempDir, { recursive: true });
  let stagedReady = false;
  let backupCreated = false;
  let restoreCommitted = false;

  try {
    const tempTar = join(tempDir, "ssh-keys.tar");
    const extractRoot = join(tempDir, "extract-root");

    logStep("Decrypting and authenticating SSH archive");

    const payload = readFileSync(encryptedFile);
    const minLength =
      SSH_FORMAT_MAGIC.length +
      SSH_SALT_LENGTH +
      SSH_IV_LENGTH +
      SSH_AUTH_TAG_LENGTH +
      1;

    if (payload.length < minLength) {
      throw new Error("Encrypted SSH backup is malformed or truncated.");
    }

    const magic = payload.subarray(0, SSH_FORMAT_MAGIC.length).toString("utf8");
    if (magic !== SSH_FORMAT_MAGIC) {
      throw new Error("Encrypted SSH backup format is unsupported.");
    }

    let offset = SSH_FORMAT_MAGIC.length;

    const salt = payload.subarray(offset, offset + SSH_SALT_LENGTH);
    offset += SSH_SALT_LENGTH;

    const iv = payload.subarray(offset, offset + SSH_IV_LENGTH);
    offset += SSH_IV_LENGTH;

    const authTag = payload.subarray(offset, offset + SSH_AUTH_TAG_LENGTH);
    offset += SSH_AUTH_TAG_LENGTH;

    const ciphertext = payload.subarray(offset);

    const key = pbkdf2Sync(
      passphrase,
      salt,
      SSH_KDF_ITERATIONS,
      SSH_KEY_LENGTH,
      "sha256",
    );

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
        "Failed to decrypt and authenticate SSH backup. Check SCRY_SSH_BACKUP_PASSPHRASE and backup integrity.",
      );
    }

    writeFileSync(tempTar, plaintext);

    logStep("Preparing staged ~/.ssh restore");
    mkdirSync(home, { recursive: true });
    mkdirSync(extractRoot, { recursive: true });

    runOrThrow(["tar", "-C", extractRoot, "-xf", tempTar]);

    const extractedSsh = join(extractRoot, ".ssh");
    if (!existsSync(extractedSsh)) {
      throw new Error("Decrypted archive does not contain a .ssh directory.");
    }

    rmSync(stagedSshDir, { force: true, recursive: true });
    cpSync(extractedSsh, stagedSshDir, { recursive: true });
    stagedReady = true;

    logStep("Normalizing staged ~/.ssh permissions");

    const normalize = (path: string): void => {
      const stats = lstatSync(path);

      if (stats.isSymbolicLink()) {
        return;
      }

      if (stats.isDirectory()) {
        chmodSync(path, 0o700);
        for (const child of readdirSync(path)) {
          normalize(join(path, child));
        }
        return;
      }

      if (stats.isFile()) {
        const mode =
          path.endsWith(".pub") || basename(path).includes("known_hosts")
            ? 0o644
            : 0o600;
        chmodSync(path, mode);
      }
    };

    normalize(stagedSshDir);

    logStep("Ensuring managed Git host entries in staged ~/.ssh/config");

    const managedStart = "# >>> scry managed git hosts >>>";
    const managedEnd = "# <<< scry managed git hosts <<<";
    const managedBlock = buildManagedBlock(
      githubHostAlias,
      githubHostName,
      githubIdentity,
      codebergHostAlias,
      codebergHostName,
      codebergIdentity,
    );
    const stagedSshConfig = join(stagedSshDir, "config");

    const existing = existsSync(stagedSshConfig)
      ? readFileSync(stagedSshConfig, "utf8").replaceAll("\r\n", "\n")
      : "";
    const pattern = new RegExp(
      `${escapeRegExp(managedStart)}[\\s\\S]*?${escapeRegExp(managedEnd)}\\n?`,
    );
    const withoutManagedBlock = existing.replace(pattern, "").trim();

    const nextConfig =
      withoutManagedBlock.length === 0
        ? managedBlock
        : `${managedBlock}\n${withoutManagedBlock}${withoutManagedBlock.endsWith("\n") ? "" : "\n"}`;

    if (nextConfig !== existing) {
      writeFileSync(stagedSshConfig, nextConfig, "utf8");
    }

    chmodSync(stagedSshConfig, 0o600);

    logStep("Atomically swapping staged restore into ~/.ssh");
    if (existsSync(sshDir)) {
      renameSync(sshDir, backupSshDir);
      backupCreated = true;
    }

    try {
      renameSync(stagedSshDir, sshDir);
      stagedReady = false;
      restoreCommitted = true;
    } catch (error) {
      if (backupCreated && !existsSync(sshDir) && existsSync(backupSshDir)) {
        renameSync(backupSshDir, sshDir);
      }
      throw error;
    }
  } catch (error) {
    if (backupCreated && !restoreCommitted && !existsSync(sshDir)) {
      renameSync(backupSshDir, sshDir);
    }
    if (stagedReady && existsSync(stagedSshDir)) {
      rmSync(stagedSshDir, { force: true, recursive: true });
    }
    throw error;
  } finally {
    rmSync(tempDir, { force: true, recursive: true });
  }

  logStep("SSH restore complete");
  console.log(`restored: ${sshDir}`);
  if (backupCreated) {
    console.log(`backup: ${backupSshDir}`);
  }
  console.log(`next: ssh -T git@${githubHostAlias}`);
  console.log(`next: ssh -T git@${codebergHostAlias}`);
}
