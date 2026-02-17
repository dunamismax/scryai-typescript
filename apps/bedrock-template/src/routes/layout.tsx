import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";

import { SiteNav } from "~/components/site-nav";
import { getAuthState } from "~/lib/auth-utils.server";
import { getSecurityHeaders } from "~/lib/http.server";

export const onRequest: RequestHandler = async (event) => {
  const securityHeaders = getSecurityHeaders();

  for (const [header, value] of Object.entries(securityHeaders)) {
    event.headers.set(header, value);
  }

  event.cacheControl({ noCache: true });

  await event.next();
};

export const useViewer = routeLoader$(async ({ request }) => {
  const authState = await getAuthState(request);
  return {
    user: authState?.user ?? null,
  };
});

export default component$(() => {
  const viewer = useViewer();

  return (
    <>
      <a
        class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-900 focus:shadow-lg"
        href="#main-content"
      >
        Skip to main content
      </a>
      <div class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(2,132,199,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(2,6,23,0.12),transparent_35%)]" />
      <SiteNav user={viewer.value.user} />
      <Slot />
    </>
  );
});
