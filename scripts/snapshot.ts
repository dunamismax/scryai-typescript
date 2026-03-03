import { createHash } from "node:crypto";
import { lstatSync, readdirSync, readFileSync, readlinkSync } from "node:fs";
import { join } from "node:path";

export type Snapshot = {
  fingerprint: string;
  fileCount: number;
  totalBytes: number;
};

function addEntries(
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
      addEntries(
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

/**
 * Compute a deterministic fingerprint over a set of paths relative to a root.
 * Each path can be a file or directory (walked recursively).
 */
export function sourceSnapshot(
  root: string,
  relativePaths: string[],
): Snapshot {
  const entries: string[] = [];
  const counters = { fileCount: 0, totalBytes: 0 };

  for (const relPath of relativePaths) {
    addEntries(join(root, relPath), relPath, entries, counters);
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

/**
 * Compute a fingerprint for all contents of a single directory root.
 * Used for SSH backup where the entire .ssh directory is the target.
 */
export function directorySnapshot(root: string): Snapshot {
  const entries: string[] = [];
  const counters = { fileCount: 0, totalBytes: 0 };

  for (const child of readdirSync(root).sort()) {
    addEntries(join(root, child), child, entries, counters);
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
