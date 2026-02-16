import { data } from "react-router";

import { env } from "~/lib/env.server";

export function getSecurityHeaders(): Headers {
  const isProduction = env.NODE_ENV === "production";
  const securityHeaders: Record<string, string> = {
    "x-frame-options": "DENY",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-permitted-cross-domain-policies": "none",
    "x-dns-prefetch-control": "off",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-resource-policy": "same-origin",
    "content-security-policy": [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "object-src 'none'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      isProduction ? "script-src 'self'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      isProduction ? "connect-src 'self'" : "connect-src 'self' ws: wss: http: https:",
    ].join("; "),
  };

  const headers = new Headers();
  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value);
  }
  return headers;
}

export function assertSameOrigin(request: Request): void {
  const method = request.method.toUpperCase();

  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    throw data({ message: "Missing origin header" }, { status: 403 });
  }

  const requestUrl = new URL(request.url);
  if (origin !== requestUrl.origin) {
    throw data({ message: "Cross-origin request blocked" }, { status: 403 });
  }
}
