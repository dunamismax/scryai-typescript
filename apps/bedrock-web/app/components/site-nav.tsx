import { ShieldCheck } from "lucide-react";
import { Form, Link, NavLink } from "react-router";

import { Button } from "~/components/ui/button";
import type { AppUser } from "~/lib/auth-utils.server";
import { cn } from "~/lib/utils";

export function SiteNav({ user }: { user: AppUser | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="inline-flex items-center gap-2 font-semibold tracking-tight" to="/">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span>bedrock-web</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <NavItem to="/">Home</NavItem>
          {user ? <NavItem to="/dashboard">Dashboard</NavItem> : null}
          {user?.role === "admin" ? <NavItem to="/admin/users">Admin</NavItem> : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <p className="hidden text-sm text-slate-600 sm:block">{user.email}</p>
              <Form method="post" action="/auth/sign-out">
                <Button size="sm" variant="outline" type="submit">
                  Sign out
                </Button>
              </Form>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link to="/auth/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth/sign-up">Create account</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "text-sm font-medium text-slate-600 transition hover:text-slate-900",
          isActive && "text-slate-900",
        )
      }
    >
      {children}
    </NavLink>
  );
}
