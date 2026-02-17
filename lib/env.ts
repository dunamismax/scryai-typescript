import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(input: NodeJS.ProcessEnv = process.env): Env {
  return envSchema.parse(input);
}
