"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { LoadingOverlay } from "./loading-overlay";

/**
 * Submit button that raises a full-screen loading overlay while its form is
 * submitting.
 *
 * `useFormStatus` reads the status of the nearest parent <form>, so this MUST be
 * rendered inside the form rather than alongside it. That's also why it's a
 * separate client component — the forms themselves stay server components.
 *
 * Pending covers the whole Server Action, including any redirect that follows,
 * so the overlay stays up until the destination page actually renders.
 */
export function SubmitButton({
  children,
  pendingLabel,
  disabled,
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  disabled?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <button
        type="submit"
        disabled={pending || disabled}
        aria-busy={pending}
        className={cn("btn btn-primary disabled:cursor-not-allowed disabled:opacity-60", className)}
      >
        {children}
      </button>
      {pending && <LoadingOverlay label={pendingLabel ?? "Saving…"} />}
    </>
  );
}
