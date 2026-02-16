import { APIError } from "better-auth/api";
import { data, Form, redirect, useActionData, useNavigation } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { writeAuditEvent } from "~/lib/audit.server";
import { auth } from "~/lib/auth.server";
import { requireAuth } from "~/lib/auth-utils.server";
import { assertSameOrigin } from "~/lib/http.server";
import type { Route } from "./+types/app.profile";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(120),
});

export function meta(_: Route.MetaArgs) {
  return [{ title: "Profile | bedrock-web" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const authState = await requireAuth(request);
  return { user: authState.user };
}

export async function action({ request }: Route.ActionArgs) {
  assertSameOrigin(request);

  const authState = await requireAuth(request);
  const formData = await request.formData();
  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return data({ error: "Enter a valid name." }, { status: 400 });
  }

  try {
    await auth.api.updateUser({
      headers: request.headers,
      body: { name: parsed.data.name },
    });

    await writeAuditEvent({
      actorUserId: authState.user.id,
      action: "profile.updated",
      targetType: "user",
      targetId: authState.user.id,
      metadata: { name: parsed.data.name },
    });

    return redirect("/profile?updated=1");
  } catch (error) {
    if (error instanceof APIError) {
      return data({ error: error.message }, { status: error.statusCode || 400 });
    }
    throw error;
  }
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const pending = navigation.state === "submitting";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update account identity fields.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form className="max-w-md space-y-4" method="post">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input defaultValue={loaderData.user.name} id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              defaultValue={loaderData.user.email}
              disabled
              id="email"
              name="email"
              type="email"
            />
          </div>
          {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}
          <Button disabled={pending} type="submit">
            {pending ? "Saving..." : "Save profile"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
