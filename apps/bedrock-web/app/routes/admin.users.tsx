import { Form, redirect } from "react-router";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select } from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { writeAuditEvent } from "~/lib/audit.server";
import { requirePermission } from "~/lib/auth-utils.server";
import { assertSameOrigin } from "~/lib/http.server";
import { roles } from "~/lib/rbac";
import { listUsers, setUserActive, setUserRole } from "~/lib/users.server";
import type { Route } from "./+types/admin.users";

const updateRoleSchema = z.object({
  intent: z.literal("set-role"),
  userId: z.string().min(1),
  role: z.enum(roles),
});

const updateActiveSchema = z.object({
  intent: z.literal("set-active"),
  userId: z.string().min(1),
  isActive: z.enum(["true", "false"]),
});

export function meta(_: Route.MetaArgs) {
  return [{ title: "Admin users | bedrock-web" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const authState = await requirePermission(request, "manage_users");
  const users = await listUsers();
  return { users, currentUserId: authState.user.id };
}

export async function action({ request }: Route.ActionArgs) {
  assertSameOrigin(request);

  const authState = await requirePermission(request, "manage_users");
  const formData = await request.formData();

  const roleUpdate = updateRoleSchema.safeParse({
    intent: formData.get("intent"),
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  if (roleUpdate.success) {
    if (roleUpdate.data.userId === authState.user.id && roleUpdate.data.role !== "admin") {
      return redirect("/admin/users?error=cannot-demote-self");
    }

    await setUserRole(roleUpdate.data.userId, roleUpdate.data.role);
    await writeAuditEvent({
      actorUserId: authState.user.id,
      action: "users.set_role",
      targetType: "user",
      targetId: roleUpdate.data.userId,
      metadata: { role: roleUpdate.data.role },
    });

    return redirect("/admin/users?updated=role");
  }

  const activeUpdate = updateActiveSchema.safeParse({
    intent: formData.get("intent"),
    userId: formData.get("userId"),
    isActive: formData.get("isActive"),
  });

  if (activeUpdate.success) {
    if (activeUpdate.data.userId === authState.user.id && activeUpdate.data.isActive === "false") {
      return redirect("/admin/users?error=cannot-disable-self");
    }

    await setUserActive(activeUpdate.data.userId, activeUpdate.data.isActive === "true");
    await writeAuditEvent({
      actorUserId: authState.user.id,
      action: "users.set_active",
      targetType: "user",
      targetId: activeUpdate.data.userId,
      metadata: { isActive: activeUpdate.data.isActive === "true" },
    });

    return redirect("/admin/users?updated=active");
  }

  return redirect("/admin/users?error=invalid-action");
}

export default function AdminUsers({ loaderData }: Route.ComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User management</CardTitle>
        <CardDescription>Manage roles and account activation flags.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loaderData.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "success" : "warning"}>
                    {user.isActive ? "active" : "disabled"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Form className="flex items-center gap-2" method="post">
                      <input name="intent" type="hidden" value="set-role" />
                      <input name="userId" type="hidden" value={user.id} />
                      <Select defaultValue={user.role} name="role">
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </Select>
                      <Button size="sm" variant="outline" type="submit">
                        Save
                      </Button>
                    </Form>
                    <Form method="post">
                      <input name="intent" type="hidden" value="set-active" />
                      <input name="userId" type="hidden" value={user.id} />
                      <input
                        name="isActive"
                        type="hidden"
                        value={user.isActive ? "false" : "true"}
                      />
                      <Button
                        size="sm"
                        variant={user.isActive ? "danger" : "secondary"}
                        type="submit"
                      >
                        {user.isActive ? "Disable" : "Enable"}
                      </Button>
                    </Form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
