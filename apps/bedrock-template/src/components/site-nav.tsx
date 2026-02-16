import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

import type { AppUser } from "~/lib/auth-utils.server";
import { cn } from "~/lib/utils";

type SiteNavProps = {
  user: AppUser | null;
};

export const SiteNav = component$<SiteNavProps>(({ user }) => {
  const loc = useLocation();

  return (
    <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link class="inline-flex items-center gap-2 font-semibold tracking-tight" href="/">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white">
            BT
          </span>
          <span>bedrock-template</span>
        </Link>

        <nav class="hidden items-center gap-5 md:flex">
          <NavItem href="/" label="Home" active={loc.url.pathname === "/"} />
          {user ? (
            <NavItem
              href="/dashboard"
              label="Dashboard"
              active={loc.url.pathname.startsWith("/dashboard")}
            />
          ) : null}
          {user?.role === "admin" ? (
            <NavItem
              href="/admin/users"
              label="Admin"
              active={loc.url.pathname.startsWith("/admin/users")}
            />
          ) : null}
        </nav>

        <div class="flex items-center gap-2">
          {user ? (
            <>
              <p class="hidden text-sm text-slate-600 sm:block">{user.email}</p>
              <form action="/auth/sign-out" method="post">
                <button
                  class="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  type="submit"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                class="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                href="/auth/sign-in"
              >
                Sign in
              </Link>
              <Link
                class="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-3 text-sm font-medium text-white transition hover:bg-slate-700"
                href="/auth/sign-up"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

type NavItemProps = {
  href: string;
  label: string;
  active: boolean;
};

export const NavItem = component$<NavItemProps>(({ href, label, active }) => {
  return (
    <Link
      class={cn(
        "text-sm font-medium text-slate-600 transition hover:text-slate-900",
        active && "text-slate-900",
      )}
      href={href}
    >
      {label}
    </Link>
  );
});
