import { APIError } from "better-auth/api";
import { data, Form, redirect, useActionData, useNavigation } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "~/lib/auth.server";
import { extractSetCookieHeader, getAuthState } from "~/lib/auth-utils.server";
import { assertSameOrigin } from "~/lib/http.server";
import { checkRateLimit, requestFingerprint } from "~/lib/rate-limit.server";
import type { Route } from "./+types/auth.sign-up";

const signUpSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email().max(320),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(128)
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[a-z]/, "Include at least one lowercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});

export async function loader({ request }: Route.LoaderArgs) {
  const authState = await getAuthState(request);
  if (authState) {
    return redirect("/dashboard");
  }
  return data({});
}

export async function action({ request }: Route.ActionArgs) {
  assertSameOrigin(request);

  const fingerprint = requestFingerprint(request);
  if (!checkRateLimit(`signup:${fingerprint}`, 6, 60_000)) {
    return data({ error: "Too many sign-up attempts. Try again shortly." }, { status: 429 });
  }

  const formData = await request.formData();
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return data(
      { error: parsed.error.issues.map((issue) => issue.message).join(". ") },
      { status: 400 },
    );
  }

  try {
    const result = await auth.api.signUpEmail({
      headers: request.headers,
      body: parsed.data,
      returnHeaders: true,
    });

    const setCookie = extractSetCookieHeader(result);

    return redirect("/dashboard", {
      headers: setCookie ? { "set-cookie": setCookie } : undefined,
    });
  } catch (error) {
    if (error instanceof APIError) {
      return data({ error: error.message }, { status: error.statusCode || 400 });
    }
    throw error;
  }
}

export default function SignUp() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const pending = navigation.state === "submitting";

  return (
    <main className="mx-auto max-w-md px-4 py-14 sm:px-0">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Includes baseline security policy and role defaults.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="space-y-4" method="post">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input autoComplete="name" id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input autoComplete="email" id="email" name="email" required type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                autoComplete="new-password"
                id="password"
                name="password"
                required
                type="password"
              />
            </div>
            {actionData?.error ? <p className="text-sm text-red-600">{actionData.error}</p> : null}
            <Button className="w-full" disabled={pending} type="submit">
              {pending ? "Creating account..." : "Create account"}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
