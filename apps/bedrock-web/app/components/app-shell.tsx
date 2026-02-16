import { Gauge, Settings, UserRound, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { cn } from "~/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/admin/users", label: "Users", icon: Users },
] as const;

export function AppShell({ isAdmin }: { isAdmin: boolean }) {
  const visibleItems = navItems.filter((item) => (isAdmin ? true : item.to !== "/admin/users"));

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
      <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100",
                    isActive && "bg-slate-900 text-white hover:bg-slate-900",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
