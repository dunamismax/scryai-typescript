import postgres from "postgres";

import { env } from "~/lib/env.server";

const globalForDb = globalThis as unknown as {
  db?: postgres.Sql;
};

export const db =
  globalForDb.db ??
  postgres(env.DATABASE_URL, {
    max: 20,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 30,
    onnotice: () => {
      // Silence Postgres extension notices in normal app logs.
    },
  });

if (env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

export async function healthCheckDb(): Promise<void> {
  await db`select 1`;
}
