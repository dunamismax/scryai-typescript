import { data, redirect } from "react-router";
import { writeAuditEvent } from "~/lib/audit.server";
import { requirePermission } from "~/lib/auth-utils.server";
import { env } from "~/lib/env.server";
import { assertSameOrigin } from "~/lib/http.server";
import { uploadAsset } from "~/lib/storage.server";
import type { Route } from "./+types/api.upload";

export async function action({ request }: Route.ActionArgs) {
  assertSameOrigin(request);

  const authState = await requirePermission(request, "upload_files");
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return data({ error: "File is required." }, { status: 400 });
  }

  if (file.size > env.MAX_UPLOAD_BYTES) {
    return data(
      { error: `File exceeds upload limit (${env.MAX_UPLOAD_BYTES} bytes).` },
      { status: 413 },
    );
  }

  const asset = await uploadAsset({
    ownerUserId: authState.user.id,
    file,
  });

  await writeAuditEvent({
    actorUserId: authState.user.id,
    action: "asset.uploaded",
    targetType: "asset",
    targetId: asset.id,
    metadata: {
      objectKey: asset.objectKey,
      sizeBytes: asset.sizeBytes,
      contentType: asset.contentType,
    },
  });

  return redirect("/dashboard?uploaded=1");
}
