import { PgBoss } from "pg-boss";

import { env } from "~/lib/env.server";

let bossPromise: Promise<PgBoss> | null = null;

async function initBoss(): Promise<PgBoss> {
  const boss = new PgBoss({
    connectionString: env.DATABASE_URL,
    schema: env.PG_BOSS_SCHEMA,
  });

  boss.on("error", (error) => {
    console.error("pg-boss error", error);
  });

  boss.on("warning", (warning) => {
    console.warn("pg-boss warning", warning);
  });

  await boss.start();
  return boss;
}

export async function getBoss(): Promise<PgBoss | null> {
  if (!env.enableJobs) {
    return null;
  }

  if (!bossPromise) {
    bossPromise = initBoss();
  }

  return bossPromise;
}

export async function enqueueJob<TData extends object>(
  name: string,
  data: TData,
): Promise<string | null> {
  const boss = await getBoss();
  if (!boss) {
    return null;
  }
  return boss.send(name, data);
}

export async function stopBoss(): Promise<void> {
  if (!bossPromise) {
    return;
  }
  const boss = await bossPromise;
  await boss.stop({ graceful: true, timeout: 15_000 });
  bossPromise = null;
}
