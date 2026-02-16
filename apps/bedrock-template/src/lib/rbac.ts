export const roles = ["member", "manager", "admin"] as const;

export type Role = (typeof roles)[number];

export const permissions = [
  "view_dashboard",
  "manage_profile",
  "upload_files",
  "view_users",
  "manage_users",
  "manage_system",
] as const;

export type Permission = (typeof permissions)[number];

const rolePermissions: Record<Role, Set<Permission>> = {
  member: new Set(["view_dashboard", "manage_profile", "upload_files"]),
  manager: new Set(["view_dashboard", "manage_profile", "upload_files", "view_users"]),
  admin: new Set(permissions),
};

export function isRole(value: string): value is Role {
  return roles.includes(value as Role);
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].has(permission);
}
