"use server";

import { z } from "zod";

const statusInputSchema = z.object({
  project: z.string().trim().min(1, "Project is required").max(64),
  note: z.string().trim().min(3, "Note must be at least 3 characters").max(240),
});

export type StatusActionState = {
  ok: boolean;
  message: string;
};

export async function saveStatusAction(
  _: StatusActionState,
  formData: FormData,
): Promise<StatusActionState> {
  const parsed = statusInputSchema.safeParse({
    project: formData.get("project"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { project, note } = parsed.data;

  return {
    ok: true,
    message: `Saved status for ${project}: ${note}`,
  };
}
