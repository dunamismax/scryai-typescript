import { component$ } from "@builder.io/qwik";
import { Form, Link, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { APIError } from "better-auth/api";
import { z } from "zod";

import { auth } from "~/lib/auth.server";
import { extractSetCookieHeader, getAuthState } from "~/lib/auth-utils.server";
import { getSameOriginError } from "~/lib/http.server";
import { checkRateLimit, requestFingerprint } from "~/lib/rate-limit.server";

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

export const useSignUpLoader = routeLoader$(async (event) => {
  const authState = await getAuthState(event.request);
  if (authState) {
    throw event.redirect(302, "/dashboard");
  }

  return {};
});

export const useSignUpAction = routeAction$(async (_, event) => {
  const formData = await event.request.formData();
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    event.status(400);
    return {
      error: parsed.error.issues.map((issue) => issue.message).join(". "),
    };
  }

  const sameOriginError = getSameOriginError(event.request);
  if (sameOriginError) {
    event.status(403);
    return { error: sameOriginError };
  }

  const fingerprint = requestFingerprint(event.request);
  if (!checkRateLimit(`signup:${fingerprint}`, 6, 60_000)) {
    event.status(429);
    return { error: "Too many sign-up attempts. Try again shortly." };
  }

  try {
    const result = await auth.api.signUpEmail({
      headers: event.request.headers,
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      },
      returnHeaders: true,
    });

    const setCookie = extractSetCookieHeader(result);
    if (setCookie) {
      event.headers.set("set-cookie", setCookie);
    }

    throw event.redirect(302, "/dashboard");
  } catch (error) {
    if (error instanceof APIError) {
      event.status(error.statusCode || 400);
      return { error: error.message };
    }

    throw error;
  }
});

export default component$(() => {
  useSignUpLoader();
  const action = useSignUpAction();

  return (
    <main class="mx-auto max-w-md px-4 py-14 sm:px-0">
      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="text-xl font-semibold text-slate-900">Create account</h1>
        <p class="mt-1 text-sm text-slate-600">
          Includes baseline security policy and role defaults.
        </p>

        <Form action={action} class="mt-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700" for="name">
              Full name
            </label>
            <input
              autoComplete="name"
              class="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
              id="name"
              name="name"
              required
              value={String(action.formData?.get("name") ?? "")}
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700" for="email">
              Email
            </label>
            <input
              autoComplete="email"
              class="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
              id="email"
              name="email"
              required
              type="email"
              value={String(action.formData?.get("email") ?? "")}
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700" for="password">
              Password
            </label>
            <input
              autoComplete="new-password"
              class="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
              id="password"
              name="password"
              required
              type="password"
            />
          </div>

          {action.value?.error ? <p class="text-sm text-red-600">{action.value.error}</p> : null}

          <button
            class="inline-flex h-10 w-full items-center justify-center rounded-md bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
            disabled={action.isRunning}
            type="submit"
          >
            {action.isRunning ? "Creating account..." : "Create account"}
          </button>
        </Form>

        <p class="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link class="text-sky-700 hover:underline" href="/auth/sign-in">
            Sign in
          </Link>
          .
        </p>
      </section>
    </main>
  );
});
