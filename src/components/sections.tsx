import Image from "next/image";
import Link from "next/link";
import { GRADE_LABEL, GRADE_BLURB } from "@/lib/types";
import { ArrowIcon } from "./icons";
import { Reveal } from "./reveal";

const GRADES = ["A", "B", "C"] as const;
const SWATCH = { A: "bg-grade-a text-grade-a", B: "bg-grade-b text-grade-b", C: "bg-grade-c text-grade-c" } as const;
const TAGTEXT = { A: "text-grade-a", B: "text-grade-b", C: "text-[#aeb8c6]" } as const;

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
          <Link href="/warranty-shipping" className="btn btn-primary">
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
      <div className="wrap grid items-center gap-10 py-16 md:grid-cols-[1fr_.72fr] md:py-20 lg:gap-16">
        <Reveal className="relative z-[3] max-w-[560px]">
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
          <Link href="/about#services" className="btn btn-primary">
            <span>Explore services</span>
            <ArrowIcon className="h-4 w-4 stroke-white" />
          </Link>
        </Reveal>

        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="/beyong-the-store.png"
            alt="Slogan Studio services beyond the online store"
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
