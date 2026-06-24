export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div
        className="grid-texture absolute inset-0 opacity-50"
        style={{ maskImage: "radial-gradient(ellipse 80% 80% at 60% 50%,#000 20%,transparent 75%)" }}
      />
      <span className="pointer-events-none absolute -bottom-16 right-0 select-none font-display text-[240px] font-bold leading-none text-white/[0.022]">/</span>
      <div className="wrap relative z-[2] py-16">
        <span className="mb-3 inline-flex items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[2.5px] text-volt before:h-0.5 before:w-6 before:bg-volt">
          {eyebrow}
        </span>
        <h1 className="font-display text-[clamp(32px,4.5vw,52px)] font-bold leading-none tracking-[-1.5px]">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-[15px] text-[#9aa3b3]">{sub}</p>}
      </div>
    </section>
  );
}
