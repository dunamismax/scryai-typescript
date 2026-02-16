import { AppShell } from "~/components/app-shell";
import { requireAuth } from "~/lib/auth-utils.server";
import type { Route } from "./+types/app-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const authState = await requireAuth(request);
  return { user: authState.user };
}

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
  return <AppShell isAdmin={loaderData.user.role === "admin"} />;
}
