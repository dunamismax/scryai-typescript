import {
  createCipheriv,
  createHash,
  pbkdf2Sync,
  randomBytes,
} from "node:crypto";
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir, hostname, tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import {
  commandExists,
  ensureDir,
  ensureParentDir,
  logStep,
  runOrThrow,
} from "../common";

const CONFIG_KDF_ITERATIONS = 250_000;
const CONFIG_KEY_LENGTH = 32;
const CONFIG_SALT_LENGTH = 16;
const CONFIG_IV_LENGTH = 12;
const _CONFIG_AUTH_TAG_LENGTH = 16;
const CONFIG_FORMAT_MAGIC = "SCRYCFG1";

const DEFAULT_CONFIG_PATHS = [
  ".ssh",
  ".gitconfig",
  ".zshrc",
  ".zprofile",
  ".codex/.codex-global-state.json",
  ".codex/config.toml",
  ".codex/rules",
  ".codex/auth.json",
  ".codex/state_5.sqlite",
  ".claude/settings.json",
  ".openclaw/openclaw.json",
  ".openclaw/openclaw.json.bak",
  ".openclaw/openclaw.json.bak.1",
  ".openclaw/openclaw.json.bak.2",
  ".openclaw/openclaw.json.bak.3",
  ".openclaw/openclaw.json.bak.4",
  ".openclaw/agents/main/agent",
  ".openclaw/credentials",
  ".openclaw/cron/jobs.json",
  ".openclaw/devices",
  ".openclaw/devices/paired.json",
  ".openclaw/exec-approvals.json",
  ".openclaw/identity",
  "Library/LaunchAgents",
  "Library/Application Support/OpenClaw/identity",
  "Library/Application Support/Code - Insiders/User/mcp.json",
  "Library/Application Support/Code/User/mcp.json",
] as const;

type Snapshot = {
  fingerprint: string;
  fileCount: number;
  totalBytes: number;
};

function parsePathList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function normalizeHomeRelativePath(home: string, raw: string): string {
  const trimmed = raw.trim().replace(/^~\//, "");
  const withoutLeading = trimmed.replace(/^\.\//, "");
  const resolved = resolve(home, withoutLeading);
  const rel = relative(home, resolved);

  if (
    withoutLeading.length === 0 ||
    rel.length === 0 ||
    rel.startsWith("..") ||
    rel.includes("\0")
  ) {
    throw new Error(`Invalid config backup path: ${raw}`);
  }

  return rel;
}

function buildConfigPathSet(home: string): {
  requestedPaths: string[];
  includedPaths: string[];
  missingPaths: string[];
} {
  const extraRaw = process.env.SCRY_CONFIG_EXTRA_PATHS ?? "";
  const excludeRaw = process.env.SCRY_CONFIG_EXCLUDE_PATHS ?? "";

  const requested: string[] = [...DEFAULT_CONFIG_PATHS];
  if (extraRaw.length > 0) {
    requested.push(...parsePathList(extraRaw));
  }

  const excludes = new Set(
    parsePathList(excludeRaw).map((item) =>
      normalizeHomeRelativePath(home, item),
    ),
  );
  const deduped = new Set<string>();
  const requestedPaths: string[] = [];
  const includedPaths: string[] = [];
  const missingPaths: string[] = [];

  for (const rawPath of requested) {
    const relPath = normalizeHomeRelativePath(home, rawPath);
    if (deduped.has(relPath)) {
      continue;
    }
    deduped.add(relPath);
    requestedPaths.push(relPath);

    if (excludes.has(relPath)) {
      continue;
    }

    const absPath = join(home, relPath);
    if (existsSync(absPath)) {
      includedPaths.push(relPath);
    } else {
      missingPaths.push(relPath);
    }
  }

  return { requestedPaths, includedPaths, missingPaths };
}

function addSnapshotEntries(
  absPath: string,
  relPath: string,
  entries: string[],
  counters: { fileCount: number; totalBytes: number },
): void {
  const stats = lstatSync(absPath);
  const mode = (stats.mode & 0o777).toString(8).padStart(3, "0");

  if (stats.isSymbolicLink()) {
    counters.fileCount += 1;
    entries.push(`symlink ${relPath} mode=${mode} -> ${readlinkSync(absPath)}`);
    return;
  }

  if (stats.isDirectory()) {
    entries.push(`dir ${relPath} mode=${mode}`);
    for (const child of readdirSync(absPath).sort()) {
      addSnapshotEntries(
        join(absPath, child),
        relPath.length > 0 ? `${relPath}/${child}` : child,
        entries,
        counters,
      );
    }
    return;
  }

  if (stats.isFile()) {
    counters.fileCount += 1;
    counters.totalBytes += stats.size;
    const fileHash = createHash("sha256")
      .update(readFileSync(absPath))
      .digest("hex");
    entries.push(
      `file ${relPath} mode=${mode} size=${stats.size} sha256=${fileHash}`,
    );
    return;
  }

  entries.push(`other ${relPath} mode=${mode}`);
}

function sourceSnapshot(home: string, includedPaths: string[]): Snapshot {
  const entries: string[] = [];
  const counters = { fileCount: 0, totalBytes: 0 };

  for (const relPath of includedPaths) {
    addSnapshotEntries(join(home, relPath), relPath, entries, counters);
  }

  const fingerprint = createHash("sha256")
    .update(entries.join("\n"))
    .digest("hex");

  return {
    fingerprint,
    fileCount: counters.fileCount,
    totalBytes: counters.totalBytes,
  };
}

function sameStringList(a: string[] | undefined, b: string[]): boolean {
  if (!a || a.length !== b.length) {
    return false;
  }
  return a.every((item, index) => item === b[index]);
}

export function setupConfigBackup(): void {
  const passphrase = process.env.SCRY_CONFIG_BACKUP_PASSPHRASE ?? "";
  const home = process.env.HOME ?? homedir();
  const repoRoot = resolve(".");
  const vaultDir = join(repoRoot, "vault", "config");
  const encryptedFile =
    process.env.SCRY_CONFIG_BACKUP_FILE ??
    join(vaultDir, "critical-configs.tar.enc");
  const metadataFile =
    process.env.SCRY_CONFIG_METADATA_FILE ??
    join(vaultDir, "critical-configs.meta.json");

  logStep("Checking config backup prerequisites");
  if (!commandExists("tar")) {
    throw new Error("Missing required tool: tar");
  }
  console.log("ok: tar");

  if (passphrase.length < 16) {
    throw new Error(
      "Set SCRY_CONFIG_BACKUP_PASSPHRASE with at least 16 characters.",
    );
  }

  const { requestedPaths, includedPaths, missingPaths } =
    buildConfigPathSet(home);

  if (includedPaths.length === 0) {
    throw new Error(
      "No backup paths were found. Check SCRY_CONFIG_EXTRA_PATHS and SCRY_CONFIG_EXCLUDE_PATHS.",
    );
  }

  const { fingerprint, fileCount, totalBytes } = sourceSnapshot(
    home,
    includedPaths,
  );

  if (existsSync(encryptedFile) && existsSync(metadataFile)) {
    try {
      const metadata = JSON.parse(readFileSync(metadataFile, "utf8")) as {
        sourceFingerprint?: string;
        includedPaths?: string[];
      };
      if (
        metadata.sourceFingerprint === fingerprint &&
        sameStringList(metadata.includedPaths, includedPaths)
      ) {
        logStep("Config backup unchanged");
        console.log(`source fingerprint: ${fingerprint}`);
        console.log("backup is already current; no files changed");
        return;
      }
    } catch {
      // Continue backup when metadata is invalid.
    }
  }

  const tempDir = join(tmpdir(), `scry-config-backup-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  try {
    logStep("Creating encrypted critical config archive");
    ensureDir(vaultDir);
    ensureParentDir(encryptedFile);

    const tempTar = join(tempDir, "critical-configs.tar");
    runOrThrow(["tar", "-C", home, "-cf", tempTar, ...includedPaths]);

    const plaintext = readFileSync(tempTar);
    const salt = randomBytes(CONFIG_SALT_LENGTH);
    const iv = randomBytes(CONFIG_IV_LENGTH);
    const key = pbkdf2Sync(
      passphrase,
      salt,
      CONFIG_KDF_ITERATIONS,
      CONFIG_KEY_LENGTH,
      "sha256",
    );

    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    const payload = Buffer.concat([
      Buffer.from(CONFIG_FORMAT_MAGIC),
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
      sourceHome: home,
      encryptedBackupFile: encryptedFile,
      cipher: "aes-256-gcm",
      kdf: "pbkdf2",
      kdfDigest: "sha256",
      kdfIterations: CONFIG_KDF_ITERATIONS,
      sourceFingerprint: fingerprint,
      sourceFileCount: fileCount,
      sourceTotalBytes: totalBytes,
      requestedPaths,
      includedPaths,
      missingPaths,
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

  logStep("Critical config backup complete");
  console.log(`created: ${encryptedFile}`);
  console.log(`created: ${metadataFile}`);
  console.log(`included paths: ${includedPaths.length}`);
  if (missingPaths.length > 0) {
    console.log(`missing paths: ${missingPaths.length}`);
  }
}
