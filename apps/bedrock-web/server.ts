import { createRequestHandler } from "react-router";

import { env } from "~/lib/env.server";

const mode = env.NODE_ENV;
const serverBuildPath = "./build/server/index.js";
const build = await import(serverBuildPath);

const handler = createRequestHandler(build, mode);

const server = Bun.serve({
  hostname: "0.0.0.0",
  port: env.PORT,
  async fetch(request) {
    return handler(request);
  },
});

console.log(`bedrock-web listening on http://localhost:${server.port}`);
