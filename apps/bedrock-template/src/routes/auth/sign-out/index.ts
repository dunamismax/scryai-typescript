import type { RequestHandler } from "@builder.io/qwik-city";

import { auth } from "~/lib/auth.server";
import { extractSetCookieHeader } from "~/lib/auth-utils.server";
import { getSameOriginError } from "~/lib/http.server";

export const onPost: RequestHandler = async (event) => {
  const sameOriginError = getSameOriginError(event.request);
  if (sameOriginError) {
    event.text(403, sameOriginError);
    return;
  }

  const result = await auth.api.signOut({
    headers: event.request.headers,
    returnHeaders: true,
  });

  const setCookie = extractSetCookieHeader(result);
  if (setCookie) {
    event.headers.set("set-cookie", setCookie);
  }

  throw event.redirect(302, "/");
};
