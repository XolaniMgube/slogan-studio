import { PageHero } from "@/components/page-hero";

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Who we are" title="Quality tech, made accessible" sub="A proudly South African, youth-driven technology company based in Vereeniging." />
      <section className="wrap max-w-3xl py-16">
        <div className="space-y-6 text-[15.5px] leading-relaxed text-muted">
          <p>
            Slogan Studio exists to make quality technology accessible, reliable and affordable. We specialise in refurbished electronics —
            laptops, MacBooks and iPhones — alongside a range of accessories, repairs, IT support and skills development.
          </p>
          <p>
            Every device we sell is tested and inspected, then honestly graded so you know exactly what you&apos;re getting. No surprises, no
            inflated claims — just fair prices on tech that works.
          </p>
          <p>
            As a youth-driven business, we&apos;re also invested in growing local talent. Our skills development work helps train the next
            generation of South African technicians and IT professionals.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            ["Tested", "Every device inspected before sale"],
            ["Graded", "Honest A / B / C condition grading"],
            ["Backed", "3-month warranty on refurbished tech"],
          ].map(([h, p]) => (
            <div key={h} className="border border-hairline bg-paper-2 p-6">
              <h3 className="font-display text-lg font-bold text-volt">{h}</h3>
              <p className="mt-1.5 text-sm text-muted">{p}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
