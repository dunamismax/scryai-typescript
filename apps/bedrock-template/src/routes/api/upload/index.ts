import type { RequestHandler } from "@builder.io/qwik-city";

import { writeAuditEvent } from "~/lib/audit.server";
import { requirePermission } from "~/lib/auth-utils.server";
import { env } from "~/lib/env.server";
import { getSameOriginError } from "~/lib/http.server";
import { uploadAsset } from "~/lib/storage.server";

export const onPost: RequestHandler = async (event) => {
  const sameOriginError = getSameOriginError(event.request);
  if (sameOriginError) {
    event.json(403, { error: sameOriginError });
    return;
  }

  const authState = await requirePermission(event, "upload_files");
  const formData = await event.request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    event.json(400, { error: "File is required." });
    return;
  }

  if (file.size > env.MAX_UPLOAD_BYTES) {
    event.json(413, { error: `File exceeds upload limit (${env.MAX_UPLOAD_BYTES} bytes).` });
    return;
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

  throw event.redirect(302, "/dashboard?uploaded=1");
};
