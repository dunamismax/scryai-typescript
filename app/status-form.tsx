"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { type StatusActionState, saveStatusAction } from "./actions";

const initialState: StatusActionState = {
  ok: false,
  message: "",
};

export function StatusForm() {
  const [state, action, pending] = useActionState(
    saveStatusAction,
    initialState,
  );

  return (
    <form className="stack" action={action}>
      <label className="stack">
        Project
        <input name="project" placeholder="scryai" required />
      </label>
      <label className="stack">
        Status note
        <input
          name="note"
          placeholder="Migrated to Bun + TypeScript"
          required
        />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
      {state.message ? (
        <p
          aria-live="polite"
          style={{ color: state.ok ? "#166534" : "#b91c1c", margin: 0 }}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
