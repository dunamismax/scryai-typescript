import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

import type { AppUser } from "~/lib/auth-utils.server";
import { cn } from "~/lib/utils";

type SiteNavProps = {
  user: AppUser | null;
};

type NavItemConfig = {
  href: string;
  label: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
  prefetch?: "js" | boolean;
};

const navItems: NavItemConfig[] = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard", requiresAuth: true, prefetch: "js" },
  { href: "/admin/users", label: "Admin", adminOnly: true, prefetch: "js" },
];

export const SiteNav = component$<SiteNavProps>(({ user }) => {
  const loc = useLocation();
  const visibleNavItems = navItems.filter((item) => {
    if (item.adminOnly) {
      return user?.role === "admin";
    }
    if (item.requiresAuth) {
      return !!user;
    }
    return true;
  });

  return (
    <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-6">
          <Link class="inline-flex items-center gap-2 font-semibold tracking-tight" href="/">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white">
              BT
            </span>
            <span>bedrock-template</span>
          </Link>

          <nav class="hidden items-center gap-5 md:flex">
            {visibleNavItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                active={
                  item.href === "/"
                    ? loc.url.pathname === "/"
                    : loc.url.pathname.startsWith(item.href)
                }
                prefetch={item.prefetch}
              />
            ))}
          </nav>
        </div>

        <div class="flex items-center gap-1 sm:gap-2">
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

      <nav class="border-t border-slate-200/80 md:hidden">
        <div class="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          {visibleNavItems.map((item) => (
            <NavItem
              key={`${item.href}-mobile`}
              compact
              href={item.href}
              label={item.label}
              active={
                item.href === "/"
                  ? loc.url.pathname === "/"
                  : loc.url.pathname.startsWith(item.href)
              }
              prefetch={item.prefetch}
            />
          ))}
        </div>
      </nav>
    </header>
  );
});

type NavItemProps = {
  href: string;
  label: string;
  active: boolean;
  compact?: boolean;
  prefetch?: "js" | boolean;
};

export const NavItem = component$<NavItemProps>(({ href, label, active, compact, prefetch }) => {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      class={cn(
        "text-sm font-medium text-slate-600 transition hover:text-slate-900",
        active && "text-slate-900",
        compact && "rounded-md border border-slate-300 px-3 py-1.5 text-xs",
        compact && active && "border-slate-900 bg-slate-900 text-white hover:text-white",
      )}
      href={href}
      prefetch={prefetch}
    >
      {label}
    </Link>
  );
});
