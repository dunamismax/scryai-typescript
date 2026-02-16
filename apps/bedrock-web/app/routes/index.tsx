import { ArrowRight, LockKeyhole, Server, Shield, UserRoundCog } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "bedrock-web | full-stack starter" },
    {
      name: "description",
      content:
        "Production-first React Router starter with Better Auth, postgres.js, pg-boss, MinIO, and RBAC.",
    },
  ];
}

const pillars = [
  {
    title: "Authentication",
    description: "Email/password auth, secure session cookies, and route-level guards.",
    icon: LockKeyhole,
  },
  {
    title: "Permissions",
    description: "Role-based access controls with admin user management screens.",
    icon: UserRoundCog,
  },
  {
    title: "Infrastructure",
    description: "PostgreSQL + pgvector, MinIO object storage, and pg-boss jobs.",
    icon: Server,
  },
  {
    title: "Security Defaults",
    description: "CSP, strict headers, same-origin checks, and rate-limited auth forms.",
    icon: Shield,
  },
] as const;

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white/95 p-8 shadow-sm lg:p-12">
        <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
          Reusable Full-Stack Template
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 lg:text-5xl">
          bedrock-web
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 lg:text-lg">
          A practical foundation for 90% of SaaS and internal tools. Start from secure defaults,
          then ship your product without rebuilding auth, permissions, storage, and jobs.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/auth/sign-up">
              Start with an account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <Card key={pillar.title}>
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{pillar.title}</CardTitle>
                <CardDescription>{pillar.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What ships in this template</CardTitle>
          <CardDescription>
            Auth API wiring, route guards, migration runner, MinIO upload flow, and admin user
            controls.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>1. Better Auth mounted at `/api/auth/*`</p>
          <p>2. Role-aware protected route layout</p>
          <p>3. SQL migrations with plain `.sql` files</p>
          <p>4. File upload pipeline to MinIO bucket</p>
          <p>5. pg-boss worker scaffold and queue publisher</p>
          <p>6. Security headers and anti-CSRF origin checks</p>
        </CardContent>
      </Card>
    </main>
  );
}
