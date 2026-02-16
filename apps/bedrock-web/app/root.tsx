import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { SiteNav } from "~/components/site-nav";
import { getAuthState } from "~/lib/auth-utils.server";
import { getSecurityHeaders } from "~/lib/http.server";
import type { Route } from "./+types/root";
import "./app.css";

export async function loader({ request }: Route.LoaderArgs) {
  const authState = await getAuthState(request);
  return data({ user: authState?.user ?? null });
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
  },
];

export const headers: Route.HeadersFunction = () => {
  return Object.fromEntries(getSecurityHeaders().entries());
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-full bg-canvas text-slate-950 antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(2,132,199,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(2,6,23,0.12),transparent_35%)]" />
        <SiteNav user={user} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Application Error";
  let message = "Unexpected failure.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message =
      error.status === 404
        ? "The page you requested does not exist."
        : "Request could not be completed.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-semibold text-red-700">{title}</h1>
        <p className="mt-2 text-sm text-red-700">{message}</p>
      </div>
    </main>
  );
}
