import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { WrenchIcon, CheckIcon, ArrowIcon } from "@/components/icons";

const SERVICES = [
  {
    title: "Device Repairs",
    blurb: "Cracked screens, dead batteries, water damage, slow machines — we diagnose and fix laptops, MacBooks and iPhones.",
    points: ["Screen & battery replacement", "Software & OS troubleshooting", "Data recovery & backup", "Free diagnostic quote"],
  },
  {
    title: "IT Support",
    blurb: "On-call technical support for individuals and small businesses across Gauteng. Setup, security, and the stuff that breaks.",
    points: ["Network & Wi-Fi setup", "Email & account configuration", "Security & antivirus", "Remote & on-site support"],
  },
  {
    title: "Skills Development",
    blurb: "We train the next generation of South African tech talent — practical, work-ready skills for a digital economy.",
    points: ["Hardware & repair basics", "IT fundamentals", "Entry-level certifications", "Youth-focused programmes"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Beyond the store"
        title="Repairs, IT support & skills development"
        sub="We don't just sell tech — we fix it and teach it. Here's how we can help beyond the store."
      />

      <section className="wrap py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="card-shear relative border border-hairline bg-white p-7 transition hover:-translate-y-1.5 hover:border-volt hover:shadow-volt"
            >
              <div
                className="mb-5 grid h-14 w-14 place-items-center border-2 border-volt"
                style={{ clipPath: "polygon(8% 0,100% 0,92% 100%,0 100%)" }}
              >
                <WrenchIcon className="h-7 w-7 stroke-volt" />
              </div>
              <h3 className="mb-2.5 font-display text-xl font-bold">{s.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-muted">{s.blurb}</p>
              <ul className="grid gap-2.5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm">
                    <CheckIcon className="h-4 w-4 stroke-volt" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-hairline pt-12 text-center">
          <h2 className="font-display text-2xl font-bold tracking-[-0.5px]">Need a repair or a quote?</h2>
          <p className="max-w-md text-muted">Message us on WhatsApp and we&apos;ll get back to you with a free diagnostic and a fair price.</p>
          <a href="https://wa.me/27739812427" className="btn btn-primary">
            <span>WhatsApp 073 981 2427</span>
            <ArrowIcon className="h-4 w-4 stroke-white" />
          </a>
          <Link href="/shop" className="text-sm font-semibold text-volt">
            Or browse the store →
          </Link>
        </div>
      </section>
    </>
  );
}
