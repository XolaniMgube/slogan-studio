"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { deleteProductAction } from "../actions";
import { Spinner } from "@/components/spinner";

/**
 * Delete is irreversible, so it's guarded twice:
 *   1. Disabled up front when the product sits on an unfinished order, with the
 *      reason shown rather than letting the admin click into a failure.
 *   2. Re-checked server-side in the action, since a disabled button proves
 *      nothing — an order can also arrive between page load and click.
 */
export function DeleteProductButton({ id, name, blockedReason }: { id: string; name: string; blockedReason?: string }) {
  const [state, formAction] = useActionState(deleteProductAction, {});

  if (blockedReason) {
    return (
      <span
        title={blockedReason}
        className="inline-flex cursor-not-allowed items-center gap-1.5 font-display text-sm font-semibold text-muted/50"
      >
        Delete
      </span>
    );
  }

  return (
    <>
      <form
        action={formAction}
        onSubmit={(event) => {
          const ok = window.confirm(
            `Delete "${name}"?\n\nThis permanently removes the product and its images. Past orders keep their records, but the product can't be recovered.`
          );
          if (!ok) event.preventDefault();
        }}
        className="inline"
      >
        <input type="hidden" name="id" value={id} />
        <DeleteButton />
      </form>

      {state.error && (
        <p className="mt-2 max-w-xs whitespace-normal rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs font-medium text-amber-900">
          {state.error}
        </p>
      )}
    </>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-muted transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && <Spinner className="h-3.5 w-3.5 stroke-current" />}
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
