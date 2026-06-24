import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Grade, GRADE_LABEL, GRADE_BLURB } from "@/lib/types";
import { ArrowIcon } from "@/components/icons";

const GRADES: Grade[] = ["A", "B", "C"];
const SW: Record<Grade, string> = { A: "bg-grade-a", B: "bg-grade-b", C: "bg-grade-c" };

export default function WarrantyPage() {
  return (
    <>
      <PageHero
        eyebrow="Warranty & grading"
        title="How our condition grading works"
        sub="Refurbished doesn't mean a gamble. Here's exactly what each grade means — and what's covered."
      />

      <section className="wrap max-w-4xl py-16">
        <div className="grid gap-5">
          {GRADES.map((g, i) => (
            <div key={g} className="flex flex-col gap-4 border border-hairline bg-white p-7 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 sm:w-48 sm:flex-shrink-0">
                <span className={`h-5 w-5 ${SW[g]}`} style={{ clipPath: "polygon(0 0,100% 0,68% 100%,0 100%)" }} />
                <div>
                  <div className="font-display text-xl font-bold">Grade {g}</div>
                  <div className="text-sm text-muted">{GRADE_LABEL[g]}</div>
                </div>
                <span className="ml-auto font-display text-2xl font-bold opacity-15 sm:hidden">0{i + 1}</span>
              </div>
              <p className="text-[15px] leading-relaxed text-muted">{GRADE_BLURB[g]}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="border border-hairline bg-paper-2 p-7">
            <h3 className="mb-3 font-display text-lg font-bold">What&apos;s covered</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>· 3-month warranty on all refurbished devices</li>
              <li>· Hardware faults not caused by misuse</li>
              <li>· Battery performance as described at sale</li>
              <li>· Free diagnostic on any warranty claim</li>
            </ul>
          </div>
          <div className="border border-hairline bg-paper-2 p-7">
            <h3 className="mb-3 font-display text-lg font-bold">What&apos;s not covered</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>· Accidental damage (drops, liquid, cracks)</li>
              <li>· Cosmetic wear already noted in the grade</li>
              <li>· Unauthorised repairs or tampering</li>
              <li>· Normal battery ageing over time</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="max-w-md text-muted">Still not sure which grade is right for you? We&apos;re happy to help you choose.</p>
          <Link href="/services" className="btn btn-primary">
            <span>Talk to us</span>
            <ArrowIcon className="h-4 w-4 stroke-white" />
          </Link>
        </div>
      </section>
    </>
  );
}
