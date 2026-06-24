import Link from "next/link";
import { Grade } from "@/lib/types";
import { GRADE_LABEL, GRADE_BLURB } from "@/lib/types";
import { ArrowIcon, CheckIcon, WrenchIcon } from "./icons";
import { Reveal } from "./reveal";

const GRADES: Grade[] = ["A", "B", "C"];
const SWATCH: Record<Grade, string> = { A: "bg-grade-a text-grade-a", B: "bg-grade-b text-grade-b", C: "bg-grade-c text-grade-c" };
const TAGTEXT: Record<Grade, string> = { A: "text-grade-a", B: "text-grade-b", C: "text-[#aeb8c6]" };

export function WhySection() {
  return (
    <section className="relative mt-8 overflow-hidden bg-ink text-white">
      <div
        className="grid-texture absolute inset-0 opacity-30"
        style={{ maskImage: "radial-gradient(ellipse 70% 80% at 30% 50%,#000 20%,transparent 70%)" }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-white/[0.08]" />

      <div className="wrap relative z-[2] py-16 md:py-20">
        <Reveal>
          <span className="mb-3 inline-flex items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[2px] text-volt before:h-0.5 before:w-6 before:bg-volt">
            Why shop with us
          </span>
          <h2 className="font-display text-[32px] font-bold leading-[1.08] tracking-[-0.5px] md:text-[38px]">
            Get refurbished electronics
            <br />
            at honest, affordable prices.
          </h2>
          <p className="mt-3 max-w-[620px] text-base leading-relaxed text-[#a5aebc]">
            Every device is tested and inspected, then graded so you know exactly what you&apos;re getting.
          </p>
        </Reveal>

        <Reveal className="mt-10 grid gap-[18px] md:grid-cols-3">
          {GRADES.map((g, idx) => (
            <div
              key={g}
              className="relative rounded-lg border border-white/[0.08] bg-ink-2 p-7 transition hover:-translate-y-1 hover:border-white/[0.18]"
            >
              <span className="absolute right-6 top-[22px] font-display text-[15px] font-bold opacity-25">0{idx + 1}</span>
              <div className={`mb-4 inline-flex items-center gap-2.5 font-display text-sm font-bold ${TAGTEXT[g]}`}>
                <span className={`h-[13px] w-[13px] rounded-full ${SWATCH[g].split(" ")[0]} shadow-[0_0_14px_currentColor]`} />
                GRADE {g}
              </div>
              <h4 className="mb-2.5 font-display text-lg font-semibold text-white">{GRADE_LABEL[g]}</h4>
              <p className="text-[15px] leading-relaxed text-[#a5aebc]">{GRADE_BLURB[g]}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-9 flex flex-wrap items-center gap-[18px]">
          <Link href="/warranty" className="btn btn-primary">
            <span>Read the condition guide</span>
            <ArrowIcon className="h-4 w-4 stroke-white" />
          </Link>
          <p className="text-[15px] text-[#8a93a3]">Not sure which grade suits you? We&apos;ll help you choose.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function PromoSection() {
  return (
    <section className="relative overflow-hidden bg-paper-2 text-ink">
      <div className="wrap">
        <Reveal className="relative z-[3] max-w-[560px] py-16 md:py-20">
          <span className="mb-3.5 inline-flex items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[2px] text-volt before:h-0.5 before:w-6 before:bg-volt">
            Beyond the store
          </span>
          <h3 className="mb-3.5 font-display text-[30px] font-bold leading-[1.08] tracking-[-0.5px] md:text-[34px]">
            Repairs, IT support &amp;
            <br />
            <span className="text-volt">skills development</span>
          </h3>
          <p className="mb-6 max-w-[470px] text-base leading-relaxed text-muted">
            We don&apos;t just sell tech — we fix it and teach it. From cracked screens to full IT support, plus training the next generation of
            South African tech talent.
          </p>
          <div className="mb-[30px] flex flex-wrap gap-2.5">
            {["Device repairs", "IT support", "Skills development"].map((s) => (
              <span key={s} className="flex items-center gap-2 border border-hairline bg-white px-[15px] py-2 font-display text-[13px] font-medium">
                <span className="h-1.5 w-1.5 bg-volt" style={{ clipPath: "polygon(0 0,100% 0,60% 100%,0 100%)" }} />
                {s}
              </span>
            ))}
          </div>
          <Link href="/services" className="btn btn-primary">
            <span>Explore services</span>
            <ArrowIcon className="h-4 w-4 stroke-white" />
          </Link>
        </Reveal>
      </div>

      <div
        className="absolute bottom-10 right-0 top-10 hidden w-[38%] overflow-hidden rounded-l-2xl bg-ink md:block"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_50%,rgba(0,148,255,.35),transparent_60%)] blur-[30px]" />
        <div
          className="absolute left-[58%] top-1/2 grid h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border-2 border-volt shadow-[0_0_50px_rgba(0,148,255,.35)]"
        >
          <WrenchIcon className="h-[54px] w-[54px] stroke-volt" />
        </div>
      </div>
    </section>
  );
}

const TRUST = ["3-Month Warranty", "Tested & Inspected", "Nationwide Delivery", "Secure Checkout", "Youth-Owned"];

export function TrustMarquee() {
  const doubled = [...TRUST, ...TRUST];
  return (
    <div className="overflow-hidden border-t border-white/[0.06] bg-ink py-[26px] text-white">
      <div className="inline-flex animate-scroll-slow whitespace-nowrap">
        {doubled.map((t, i) => (
          <div key={i} className="flex items-center gap-3.5 px-10 font-display text-[19px] font-semibold tracking-[0.5px] text-white/85">
            <CheckIcon className="h-[18px] w-[18px] stroke-volt" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
