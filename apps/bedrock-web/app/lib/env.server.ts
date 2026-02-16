import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1).default("postgres://scryai:scryai@localhost:15432/scryai"),
  BETTER_AUTH_SECRET: z.string().min(32).default("change-me-please-change-me-please-1234"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  BETTER_AUTH_TRUSTED_ORIGINS: z.string().default("http://localhost:3000"),
  SESSION_COOKIE_DOMAIN: z.string().optional(),
  MINIO_ENDPOINT: z.string().url().default("http://localhost:19000"),
  MINIO_REGION: z.string().default("us-east-1"),
  MINIO_ACCESS_KEY: z.string().default("minioadmin"),
  MINIO_SECRET_KEY: z.string().default("minioadmin123"),
  MINIO_BUCKET: z.string().default("scryai-documents"),
  MAX_UPLOAD_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(10 * 1024 * 1024),
  ENABLE_JOBS: z.union([z.literal("true"), z.literal("false")]).default("false"),
  PG_BOSS_SCHEMA: z.string().default("pgboss"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${errors}`);
}

export const env = {
  ...parsed.data,
  enableJobs: parsed.data.ENABLE_JOBS === "true",
  trustedOrigins: parsed.data.BETTER_AUTH_TRUSTED_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export type AppEnv = typeof env;
