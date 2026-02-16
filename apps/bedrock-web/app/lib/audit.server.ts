import { db } from "~/lib/db.server";

export type AuditEvent = {
  actorUserId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function writeAuditEvent(event: AuditEvent): Promise<void> {
  await db`
    insert into "auditLog" (
      "actorUserId",
      action,
      "targetType",
      "targetId",
      metadata
    )
    values (
      ${event.actorUserId ?? null},
      ${event.action},
      ${event.targetType},
      ${event.targetId ?? null},
      ${JSON.stringify(event.metadata ?? {})}::jsonb
    )
  `;
}
