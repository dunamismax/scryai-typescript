import { StatusForm } from "./status-form";

const stack = [
  "Bun runtime",
  "Next.js App Router + Server Actions",
  "TypeScript + Zod",
  "Tailwind + shadcn/ui",
  "Postgres + Drizzle",
];

export default function HomePage() {
  return (
    <main className="stack">
      <section className="card stack">
        <span className="badge">scryai</span>
        <h1 style={{ margin: 0 }}>Bun-first TypeScript control plane</h1>
        <p style={{ margin: 0 }}>
          Repo operations now run through Bun scripts, with Next.js as the
          canonical web/app surface.
        </p>
      </section>

      <section className="card stack">
        <h2 style={{ margin: 0 }}>Stack baseline</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
          {stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card stack">
        <h2 style={{ margin: 0 }}>Server action smoke test</h2>
        <StatusForm />
      </section>
    </main>
  );
}
