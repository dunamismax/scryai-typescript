import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { db } from "~/lib/db.server";

const migrationsDir = resolve(import.meta.dir, "..", "db", "migrations");

async function ensureMigrationsTable() {
  await db`
    create table if not exists "schemaMigration" (
      filename text primary key,
      "executedAt" timestamptz not null default now()
    )
  `;
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const rows = await db<{ filename: string }[]>`
    select filename
    from "schemaMigration"
  `;

  return new Set(rows.map((row) => row.filename));
}

async function run() {
  await ensureMigrationsTable();

  const files = (await readdir(migrationsDir))
    .filter((name) => name.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  const applied = await getAppliedMigrations();

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }

    const sql = await readFile(resolve(migrationsDir, file), "utf8");

    await db.begin(async (tx) => {
      await tx.unsafe(sql);
      await tx.unsafe('insert into "schemaMigration" (filename) values ($1)', [file]);
    });

    console.log(`applied: ${file}`);
  }

  console.log("migrations complete");
  await db.end();
}

run().catch(async (error) => {
  console.error(error);
  await db.end({ timeout: 0 });
  process.exit(1);
});
