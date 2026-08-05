"use client";

import { useActionState } from "react";
import { LoadingOverlay } from "@/components/loading-overlay";
import { loginAdmin } from "../actions";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(loginAdmin, undefined);

  return (
    <form action={formAction} className="mt-6 grid gap-4">
      {!configured && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Add ADMIN_DASHBOARD_PASSWORD and ADMIN_SESSION_SECRET to enable admin login.
        </p>
      )}
      <label className="grid gap-1.5">
        <span className="font-display text-sm font-semibold">Admin password</span>
        <input
          name="password"
          type="password"
          disabled={!configured}
          className="rounded-md border border-hairline px-4 py-3 outline-none transition focus:border-volt focus:ring-2 focus:ring-volt/20 disabled:bg-paper-2"
        />
      </label>
      {state?.error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      <button
        disabled={!configured || pending}
        aria-busy={pending}
        className="btn btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        Sign in
      </button>
      {pending && <LoadingOverlay label="Signing in…" />}
    </form>
  );
}
