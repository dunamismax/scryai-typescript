import { component$ } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({ public: true, maxAge: 60, staleWhileRevalidate: 300 });
};

const pillars = [
  {
    title: "Authentication",
    description: "Email/password auth, secure session cookies, and route-level guards.",
  },
  {
    title: "Permissions",
    description: "Role-based access controls with admin user management screens.",
  },
  {
    title: "Infrastructure",
    description: "PostgreSQL + pgvector, MinIO object storage, and pg-boss jobs.",
  },
  {
    title: "Security Defaults",
    description: "CSP, strict headers, same-origin checks, and rate-limited auth forms.",
  },
] as const;

export default component$(() => {
  return (
    <main id="main-content" class="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section class="rounded-2xl border border-slate-200 bg-white/95 p-8 shadow-sm lg:p-12">
        <p class="text-sm font-medium uppercase tracking-wide text-sky-700">
          Reusable Full-Stack Template
        </p>
        <h1 class="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 lg:text-5xl">
          bedrock-template
        </h1>
        <p class="mt-4 max-w-2xl text-base text-slate-600 lg:text-lg">
          A Qwik City starter for secure, self-hosted products. Start from auth, permissions,
          storage, and jobs, then ship your product instead of rebuilding platform basics.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <Link
            class="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700"
            href="/auth/sign-up"
            prefetch="js"
          >
            Start with an account
          </Link>
          <Link
            class="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            href="/dashboard"
            prefetch="js"
          >
            Open dashboard
          </Link>
        </div>
      </section>

      <section class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-sm font-semibold text-white">
              {pillar.title.slice(0, 1)}
            </div>
            <h2 class="text-lg font-semibold text-slate-900">{pillar.title}</h2>
            <p class="mt-1 text-sm text-slate-600">{pillar.description}</p>
          </article>
        ))}
      </section>

      <section class="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-semibold text-slate-900">What ships in this template</h2>
        <p class="mt-1 text-sm text-slate-600">
          Auth wiring, route guards, migration runner, MinIO upload flow, and admin user controls.
        </p>
        <div class="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>1. Better Auth mounted at `/api/auth/*`</p>
          <p>2. Role-aware protected routes and admin controls</p>
          <p>3. SQL migrations with plain `.sql` files</p>
          <p>4. File upload pipeline to MinIO bucket</p>
          <p>5. pg-boss worker scaffold and queue publisher</p>
          <p>6. Security headers and anti-CSRF origin checks</p>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "bedrock-template | Qwik full-stack starter",
  meta: [
    {
      name: "description",
      content:
        "Production-first Qwik starter with Better Auth, postgres.js, pg-boss, MinIO, and RBAC.",
    },
    {
      property: "og:title",
      content: "bedrock-template | Qwik full-stack starter",
    },
    {
      property: "og:description",
      content:
        "Production-first Qwik starter with Better Auth, postgres.js, pg-boss, MinIO, and RBAC.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "bedrock-template | Qwik full-stack starter",
    },
    {
      name: "twitter:description",
      content:
        "Production-first Qwik starter with Better Auth, postgres.js, pg-boss, MinIO, and RBAC.",
    },
  ],
};
