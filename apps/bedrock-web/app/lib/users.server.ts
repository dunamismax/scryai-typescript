import { db } from "~/lib/db.server";
import type { Role } from "~/lib/rbac";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function listUsers(limit = 100): Promise<UserRecord[]> {
  return db<UserRecord[]>`
    select
      id,
      name,
      email,
      "emailVerified",
      role,
      "isActive",
      "createdAt",
      "updatedAt"
    from "user"
    order by "createdAt" desc
    limit ${limit}
  `;
}

export async function setUserRole(userId: string, role: Role): Promise<void> {
  await db`
    update "user"
    set role = ${role}, "updatedAt" = now()
    where id = ${userId}
  `;
}

export async function setUserActive(userId: string, isActive: boolean): Promise<void> {
  await db`
    update "user"
    set "isActive" = ${isActive}, "updatedAt" = now()
    where id = ${userId}
  `;
}

export async function countUsers(): Promise<number> {
  const [row] = await db<{ count: string }[]>`select count(*)::text as count from "user"`;
  return Number(row?.count ?? 0);
}

export async function countActiveUsers(): Promise<number> {
  const [row] = await db<{ count: string }[]>`
    select count(*)::text as count
    from "user"
    where "isActive" = true
  `;
  return Number(row?.count ?? 0);
}
