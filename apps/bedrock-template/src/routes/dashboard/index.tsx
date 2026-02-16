import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, routeLoader$, useLocation } from "@builder.io/qwik-city";

import { AppShell } from "~/components/app-shell";
import { requireAuth } from "~/lib/auth-utils.server";
import { countAssetsByUser, listAssetsByUser } from "~/lib/storage.server";
import { countActiveUsers, countUsers } from "~/lib/users.server";
import { formatBytes } from "~/lib/utils";

export const useDashboardLoader = routeLoader$(async (event) => {
  const authState = await requireAuth(event);

  const [userCount, activeUsers, ownedAssetCount, recentAssets] = await Promise.all([
    authState.user.role === "admin" ? countUsers() : Promise.resolve(0),
    authState.user.role === "admin" ? countActiveUsers() : Promise.resolve(0),
    countAssetsByUser(authState.user.id),
    listAssetsByUser(authState.user.id, 10),
  ]);

  return {
    user: authState.user,
    stats: {
      userCount,
      activeUsers,
      ownedAssetCount,
    },
    assets: recentAssets,
  };
});

export default component$(() => {
  const dashboard = useDashboardLoader();
  const loc = useLocation();

  return (
    <AppShell isAdmin={dashboard.value.user.role === "admin"}>
      <div class="space-y-6">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p class="mt-1 text-sm text-slate-600">
            Signed in as <strong>{dashboard.value.user.email}</strong>
          </p>
        </div>

        {loc.url.searchParams.get("uploaded") === "1" ? (
          <p class="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Upload completed.
          </p>
        ) : null}

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Role" value={dashboard.value.user.role} />
          <StatCard label="My uploads" value={String(dashboard.value.stats.ownedAssetCount)} />
          {dashboard.value.user.role === "admin" ? (
            <StatCard label="Total users" value={String(dashboard.value.stats.userCount)} />
          ) : null}
          {dashboard.value.user.role === "admin" ? (
            <StatCard label="Active users" value={String(dashboard.value.stats.activeUsers)} />
          ) : null}
        </div>

        <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold">Upload file to MinIO</h2>
          <p class="mt-1 text-sm text-slate-600">Stored under your account namespace.</p>

          <form
            action="/api/upload"
            class="mt-4 flex flex-col gap-3 sm:flex-row"
            enctype="multipart/form-data"
            method="post"
          >
            <input
              class="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
              name="file"
              required
              type="file"
            />
            <button
              class="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700"
              type="submit"
            >
              Upload
            </button>
          </form>
          <p class="mt-2 text-xs text-slate-500">
            Default max size is 10 MB. Configure with `MAX_UPLOAD_BYTES`.
          </p>
        </section>

        <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold">Recent uploads</h2>
          <p class="mt-1 text-sm text-slate-600">Latest objects you uploaded.</p>

          {dashboard.value.assets.length === 0 ? (
            <p class="mt-4 text-sm text-slate-500">No uploads yet.</p>
          ) : (
            <div class="mt-4 overflow-auto">
              <table class="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr class="border-b border-slate-200 text-left text-slate-500">
                    <th class="pb-2 font-medium">File</th>
                    <th class="pb-2 font-medium">Type</th>
                    <th class="pb-2 font-medium">Size</th>
                    <th class="pb-2 font-medium">Object Key</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.value.assets.map((asset) => (
                    <tr key={asset.id} class="border-b border-slate-100">
                      <td class="py-2 font-medium text-slate-800">{asset.originalFileName}</td>
                      <td class="py-2 text-slate-600">{asset.contentType}</td>
                      <td class="py-2 text-slate-600">{formatBytes(asset.sizeBytes)}</td>
                      <td class="max-w-[220px] truncate py-2 text-xs text-slate-500">
                        {asset.objectKey}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div class="text-sm">
          <Link class="text-sky-700 hover:underline" href="/settings">
            Open settings and jobs
          </Link>
        </div>
      </div>
    </AppShell>
  );
});

type StatCardProps = {
  label: string;
  value: string;
};

const StatCard = component$<StatCardProps>(({ label, value }) => {
  return (
    <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p class="text-sm text-slate-500">{label}</p>
      <p class="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  );
});

export const head: DocumentHead = {
  title: "Dashboard | bedrock-template",
};
