import type { ReactNode } from "react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { requireAuth } from "~/lib/auth-utils.server";
import { countAssetsByUser, listAssetsByUser } from "~/lib/storage.server";
import { countActiveUsers, countUsers } from "~/lib/users.server";
import { formatBytes } from "~/lib/utils";
import type { Route } from "./+types/app.dashboard";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Dashboard | bedrock-web" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const authState = await requireAuth(request);

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
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, stats, assets } = loaderData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Signed in as <strong>{user.email}</strong>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Role" value={<Badge>{user.role}</Badge>} />
        <StatCard label="My uploads" value={String(stats.ownedAssetCount)} />
        {user.role === "admin" ? (
          <StatCard label="Total users" value={String(stats.userCount)} />
        ) : null}
        {user.role === "admin" ? (
          <StatCard label="Active users" value={String(stats.activeUsers)} />
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload file to MinIO</CardTitle>
          <CardDescription>Stored securely under your account namespace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="/api/upload"
            className="flex flex-col gap-3 sm:flex-row"
            encType="multipart/form-data"
            method="post"
          >
            <input
              className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
              name="file"
              required
              type="file"
            />
            <Button type="submit">Upload</Button>
          </form>
          <p className="mt-2 text-xs text-slate-500">
            Default max size is 10 MB. Configure with `MAX_UPLOAD_BYTES`.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent uploads</CardTitle>
          <CardDescription>Latest objects you uploaded.</CardDescription>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <p className="text-sm text-slate-500">No uploads yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Object Key</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.originalFileName}</TableCell>
                    <TableCell>{asset.contentType}</TableCell>
                    <TableCell>{formatBytes(asset.sizeBytes)}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-xs text-slate-500">
                      {asset.objectKey}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="text-sm">
        <Link className="text-sky-700 hover:underline" to="/settings">
          Open settings and jobs
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">{value}</CardContent>
    </Card>
  );
}
