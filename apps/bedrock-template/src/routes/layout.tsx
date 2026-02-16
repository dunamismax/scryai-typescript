import { component$, Slot } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";

import { SiteNav } from "~/components/site-nav";
import { getAuthState } from "~/lib/auth-utils.server";
import { getSecurityHeaders } from "~/lib/http.server";

export const onRequest: RequestHandler = async (event) => {
  const securityHeaders = getSecurityHeaders();

  for (const [header, value] of Object.entries(securityHeaders)) {
    event.headers.set(header, value);
  }

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
      <div class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(2,132,199,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(2,6,23,0.12),transparent_35%)]" />
      <SiteNav user={viewer.value.user} />
      <Slot />
    </>
  );
});

export const head: DocumentHead = {
  links: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    },
  ],
};
