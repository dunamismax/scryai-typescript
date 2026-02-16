import { redirect } from "react-router";
import { auth } from "~/lib/auth.server";
import { extractSetCookieHeader } from "~/lib/auth-utils.server";
import { assertSameOrigin } from "~/lib/http.server";
import type { Route } from "./+types/auth.sign-out";

export async function action({ request }: Route.ActionArgs) {
  assertSameOrigin(request);

  const result = await auth.api.signOut({
    headers: request.headers,
    returnHeaders: true,
  });

  const setCookie = extractSetCookieHeader(result);

  return redirect("/", {
    headers: setCookie ? { "set-cookie": setCookie } : undefined,
  });
}
