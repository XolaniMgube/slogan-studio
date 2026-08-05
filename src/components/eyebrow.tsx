/** Small uppercase kicker above a section heading — the recurring label style across the site. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 inline-flex items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[2px] text-volt before:h-0.5 before:w-6 before:bg-volt">
      {children}
    </span>
  );
}
