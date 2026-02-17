import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { logStep } from "../common";

function parseKeys(content: string): Set<string> {
  return new Set(
    content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"))
      .map((line) => line.split("=", 1)[0]?.trim() ?? "")
      .filter((line) => line.length > 0),
  );
}

export function setupStorage(): void {
  const envExample =
    process.env.SCRY_INFRA_ENV_EXAMPLE ?? resolve("infra/.env.example");
  const envPath = process.env.SCRY_INFRA_ENV_FILE ?? resolve("infra/.env");

  logStep("Ensuring infra env file");

  if (!existsSync(envExample)) {
    throw new Error(`Missing infra env example: ${envExample}`);
  }

  if (!existsSync(envPath)) {
    copyFileSync(envExample, envPath);
    console.log(`created: ${envPath}`);
    logStep("Storage defaults ready");
    return;
  }

  const template = readFileSync(envExample, "utf8");
  const current = readFileSync(envPath, "utf8");

  const currentKeys = parseKeys(current);
  const missingLines = template
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .filter((line) => {
      const key = line.split("=", 1)[0]?.trim() ?? "";
      return key.length > 0 && !currentKeys.has(key);
    });

  if (missingLines.length === 0) {
    console.log(`exists: ${envPath}`);
    logStep("Storage defaults ready");
    return;
  }

  const next = `${current.trimEnd()}\n\n${missingLines.join("\n")}\n`;
  writeFileSync(envPath, next, "utf8");
  console.log(`updated: ${envPath}`);
  for (const line of missingLines) {
    const key = line.split("=", 1)[0];
    console.log(`added: ${key}`);
  }

  logStep("Storage defaults ready");
}
