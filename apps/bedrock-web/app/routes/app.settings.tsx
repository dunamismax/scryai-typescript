import { data, Form, useActionData, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { writeAuditEvent } from "~/lib/audit.server";
import { requireAuth } from "~/lib/auth-utils.server";
import { env } from "~/lib/env.server";
import { assertSameOrigin } from "~/lib/http.server";
import { enqueueJob } from "~/lib/jobs.server";
import type { Route } from "./+types/app.settings";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Settings | bedrock-web" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  return {
    jobsEnabled: env.enableJobs,
    minioBucket: env.MINIO_BUCKET,
    maxUploadBytes: env.MAX_UPLOAD_BYTES,
  };
}

export async function action({ request }: Route.ActionArgs) {
  assertSameOrigin(request);

  const authState = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "enqueue-demo") {
    const jobId = await enqueueJob("system.demo", {
      requestedByUserId: authState.user.id,
      requestedAt: new Date().toISOString(),
    });

    await writeAuditEvent({
      actorUserId: authState.user.id,
      action: "jobs.enqueue_demo",
      targetType: "queue",
      metadata: { jobId },
    });

    return data({
      message: jobId
        ? `Queued demo job: ${jobId}`
        : "Job queue is disabled. Set ENABLE_JOBS=true to activate pg-boss.",
    });
  }

  return data({ message: "Unknown action" }, { status: 400 });
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Runtime configuration</CardTitle>
          <CardDescription>Values from environment and infra wiring.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <p>
            <strong>Jobs enabled:</strong> {loaderData.jobsEnabled ? "yes" : "no"}
          </p>
          <p>
            <strong>MinIO bucket:</strong> {loaderData.minioBucket}
          </p>
          <p>
            <strong>Max upload bytes:</strong> {loaderData.maxUploadBytes}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Background jobs</CardTitle>
          <CardDescription>Queue a sample pg-boss job to validate worker plumbing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <input name="intent" type="hidden" value="enqueue-demo" />
            <Button disabled={navigation.state === "submitting"} type="submit">
              {navigation.state === "submitting" ? "Queueing..." : "Queue demo job"}
            </Button>
          </Form>
          {actionData?.message ? (
            <p className="mt-3 text-sm text-slate-600">{actionData.message}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
