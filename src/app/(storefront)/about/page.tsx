import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ImageSlot } from "@/components/image-slot";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";
import { WrenchIcon, CheckIcon, ArrowIcon, ShieldIcon, TruckIcon, ChatIcon } from "@/components/icons";

/** Merged from the old /about and /services pages. /services redirects to #services. */

const PROCESS = [
  { step: "01", title: "We source", body: "Devices come in from trade-ins, upgrades and business fleet refreshes — never unknown stock." },
  { step: "02", title: "We test", body: "Full hardware and software diagnostics: battery health, ports, screen, keyboard, storage, thermals." },
  { step: "03", title: "We grade", body: "Honest A / B / C grading against a fixed standard, with any cosmetic wear photographed and noted." },
  { step: "04", title: "We deliver", body: "Packaged carefully, shipped tracked, and backed by the warranty stated on the product." },
];

const VALUES = [
  { icon: CheckIcon, title: "Honest grading", body: "We describe wear as it is. The grade on the listing is the device you receive." },
  { icon: ShieldIcon, title: "Backed by warranty", body: "Refurbished devices carry cover, with a free diagnostic on any claim." },
  { icon: TruckIcon, title: "Nationwide reach", body: "Tracked delivery anywhere in South Africa, or collect from us in Vereeniging." },
];

const SERVICES = [
  {
    title: "Device Repairs",
    slot: "Repair bench / technician at work",
    blurb: "Cracked screens, dead batteries, water damage, slow machines — we diagnose and fix laptops, MacBooks and iPhones.",
    points: ["Screen & battery replacement", "Software & OS troubleshooting", "Data recovery & backup", "Free diagnostic quote"],
  },
  {
    title: "IT Support",
    slot: "On-site support / network setup",
    blurb: "On-call technical support for individuals and small businesses across Gauteng. Setup, security, and the stuff that breaks.",
    points: ["Network & Wi-Fi setup", "Email & account configuration", "Security & antivirus", "Remote & on-site support"],
  },
  {
    title: "Skills Development",
    slot: "Training session / learners",
    blurb: "We train the next generation of South African tech talent — practical, work-ready skills for a digital economy.",
    points: ["Hardware & repair basics", "IT fundamentals", "Entry-level certifications", "Youth-focused programmes"],
  },
];

export const metadata = {
  title: "About & Services — Slogan Studio",
  description:
    "A proudly South African, youth-driven technology company in Vereeniging. Refurbished devices, repairs, IT support and skills development.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="Quality tech, made accessible"
        sub="A proudly South African, youth-driven technology company based in Vereeniging."
      />

      {/* ---------- Story: text + photo ---------- */}
      <section className="wrap py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.8px] md:text-[36px]">
              Good technology shouldn&apos;t be
              <br />
              <span className="text-volt">out of reach.</span>
            </h2>
            <div className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-muted">
              <p>
                Slogan Studio exists to make quality technology accessible, reliable and affordable. We specialise in refurbished
                electronics — laptops, MacBooks and iPhones — alongside accessories, repairs, IT support and skills development.
              </p>
              <p>
                Every device we sell is tested and inspected, then honestly graded so you know exactly what you&apos;re getting. No
                surprises, no inflated claims — just fair prices on tech that works.
              </p>
              <p>
                As a youth-driven business, we&apos;re invested in growing local talent. Our skills development work helps train the next
                generation of South African technicians and IT professionals.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">
                <span>Browse the store</span>
                <ArrowIcon className="h-4 w-4 stroke-white" />
              </Link>
              <Link href="/warranty-shipping" className="btn btn-ghost">
                How grading works
              </Link>
            </div>
          </Reveal>

          <Reveal className="relative">
            <ImageSlot label="Team or storefront photo" ratio="aspect-[4/3]" />
            {/* Offset second image gives the block depth instead of one flat rectangle. */}
            <div className="absolute -bottom-8 -left-6 hidden w-40 lg:block">
              <ImageSlot label="Detail shot" ratio="aspect-square" className="border-4 border-white shadow-xl" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Values: dark band ---------- */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="grid-texture absolute inset-0 opacity-30"
          style={{ maskImage: "radial-gradient(ellipse 70% 80% at 30% 50%,#000 20%,transparent 70%)" }}
        />
        <div className="wrap relative z-[2] py-16 md:py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>What we stand for</Eyebrow>
            <h2 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.8px] md:text-[36px]">
              Refurbished, without the guesswork
            </h2>
          </Reveal>

          <Reveal className="mt-10 grid gap-[18px] md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-lg border border-white/[0.08] bg-ink-2 p-7 transition hover:-translate-y-1 hover:border-white/[0.18]"
              >
                <div
                  className="mb-5 grid h-12 w-12 place-items-center border-2 border-volt"
                  style={{ clipPath: "polygon(8% 0,100% 0,92% 100%,0 100%)" }}
                >
                  <Icon className="h-6 w-6 stroke-volt" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
                <p className="text-[15px] leading-relaxed text-[#a5aebc]">{body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="wrap py-16 md:py-20">
        <Reveal className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.8px] md:text-[36px]">
            From trade-in to your desk
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Every device follows the same route before it reaches a listing. No shortcuts, no unknown stock.
          </p>
        </Reveal>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <Reveal className="grid gap-4 sm:grid-cols-2">
            {PROCESS.map(({ step, title, body }) => (
              <div key={step} className="relative rounded-lg border border-hairline bg-white p-6 transition hover:border-volt hover:shadow-volt-sm">
                <span className="font-display text-[13px] font-bold tracking-[1px] text-volt">{step}</span>
                <h3 className="mt-2 font-display text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </Reveal>

          <Reveal>
            <ImageSlot label="Testing / workshop photo" ratio="aspect-[3/4]" />
          </Reveal>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section id="services" className="scroll-mt-24 border-y border-hairline bg-paper-2 py-16 md:py-20">
        <div className="wrap">
          <Reveal className="max-w-2xl">
            <Eyebrow>Beyond the store</Eyebrow>
            <h2 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.8px] md:text-[36px]">
              Repairs, IT support &amp; <span className="text-volt">skills development</span>
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              We don&apos;t just sell tech — we fix it and teach it. Here&apos;s how we can help beyond the store.
            </p>
          </Reveal>

          <Reveal className="mt-10 grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <article
                key={s.title}
                className="group flex flex-col overflow-hidden rounded-lg border border-hairline bg-white transition hover:-translate-y-1.5 hover:border-volt hover:shadow-volt"
              >
                <ImageSlot label={s.slot} ratio="aspect-[16/10]" className="rounded-none" />
                <div className="flex flex-1 flex-col p-7">
                  <div
                    className="mb-4 grid h-11 w-11 place-items-center border-2 border-volt"
                    style={{ clipPath: "polygon(8% 0,100% 0,92% 100%,0 100%)" }}
                  >
                    <WrenchIcon className="h-5 w-5 stroke-volt" />
                  </div>
                  <h3 className="mb-2.5 font-display text-xl font-bold">{s.title}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-muted">{s.blurb}</p>
                  <ul className="mt-auto grid gap-2.5 border-t border-hairline pt-5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm">
                        <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 stroke-volt" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- Visit + CTA ---------- */}
      <section className="wrap py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>Get in touch</Eyebrow>
            <h2 className="font-display text-[28px] font-bold leading-[1.1] tracking-[-0.6px] md:text-[32px]">
              Talk to a real person
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Questions about a device, a repair or an order — message us and we&apos;ll come back to you.
            </p>

            <dl className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="font-display text-[13px] font-semibold uppercase tracking-[1px] text-muted">WhatsApp</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed">
                  <a href="https://wa.me/27739812427" className="font-semibold text-volt hover:text-ink">
                    073 981 2427
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-display text-[13px] font-semibold uppercase tracking-[1px] text-muted">Email</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed">
                  <a href="mailto:info@sloganstudio.co.za" className="hover:text-volt">
                    info@sloganstudio.co.za
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 rounded-lg border border-hairline bg-paper-2 p-6">
              <h3 className="font-display text-lg font-bold">Need a repair or a quote?</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Message us and we&apos;ll come back to you with a free diagnostic and a fair price.
              </p>
              <a href="https://wa.me/27739812427" className="btn btn-primary mt-5">
                <ChatIcon className="h-4 w-4 stroke-white" />
                <span>WhatsApp us</span>
              </a>
            </div>
          </Reveal>

          <Reveal>
            <ImageSlot label="Team or workspace photo" ratio="aspect-[4/3]" className="h-full" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
