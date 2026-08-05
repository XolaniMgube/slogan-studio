import { Spinner } from "./spinner";

/**
 * Full-screen blocking overlay shown while a form action is in flight.
 *
 * Rendered from inside the form (it's `fixed`, so it escapes the form's box
 * visually) and sits above everything, which also stops the admin clicking other
 * controls mid-save.
 */
export function LoadingOverlay({ label = "Working…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center bg-ink/60 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-12 w-12 stroke-volt" />
        <p className="font-display text-sm font-semibold tracking-[0.3px] text-white">{label}</p>
      </div>
    </div>
  );
}
