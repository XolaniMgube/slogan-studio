import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";
import { GRADE_LABEL, GRADE_BLURB } from "@/lib/types";
import { formatRand } from "@/lib/utils";
import { SHIPPING_FLAT, FREE_SHIPPING_THRESHOLD } from "@/lib/shop-config";
import { ArrowIcon, CheckIcon, CloseIcon, ShieldIcon, TruckIcon, ChatIcon } from "@/components/icons";

/** Merged from the old /warranty and /shipping pages. Both old URLs redirect here. */

const GRADES = ["A", "B", "C"] as const;

const GRADE_STYLE = {
  A: { dot: "bg-grade-a", text: "text-grade-a", ring: "hover:border-grade-a", slot: "Grade A device — example condition" },
  B: { dot: "bg-grade-b", text: "text-grade-b", ring: "hover:border-grade-b", slot: "Grade B device — example wear" },
  C: { dot: "bg-grade-c", text: "text-grade-c", ring: "hover:border-grade-c", slot: "Grade C device — example wear" },
} as const;

const COVERED = [
  "Warranty on refurbished devices, as stated on each product",
  "Hardware faults not caused by misuse",
  "Battery performance as described at sale",
  "Free diagnostic on any warranty claim",
];

const NOT_COVERED = [
  "Accidental damage (drops, liquid, cracks)",
  "Cosmetic wear already noted in the grade",
  "Unauthorised repairs or tampering",
  "Normal battery ageing over time",
];

const DELIVERY_STEPS = [
  { step: "01", title: "Payment confirmed", body: "Your order is only processed once payment clears through our secure iKhokha checkout." },
  { step: "02", title: "Packed & checked", body: "The device is checked once more, then packaged to survive the trip in the condition it left us." },
  { step: "03", title: "Handed to courier", body: "You get a tracking reference by email as soon as the parcel is collected from us." },
  { step: "04", title: "Delivered to you", body: "3–5 working days nationwide. Track it any time from the Track order page." },
];

const FAQS = [
  {
    q: "How do I know what condition I'm getting?",
    a: "Every refurbished listing shows a grade — A, B or C — measured against the same fixed standard. Brand-new products are clearly labelled, and any cosmetic wear on refurbished products is noted on the product page.",
  },
  {
    q: "What happens if something goes wrong after delivery?",
    a: "Message us on WhatsApp. Warranty claims start with a free diagnostic, and we'll tell you honestly whether it's a covered fault before you commit to anything.",
  },
  {
    q: "Do you deliver outside the major centres?",
    a: "Yes. If you're somewhere a courier struggles to reach, get in touch before ordering and we'll confirm what's possible for your area.",
  },
  {
    q: "My address isn't coming up at checkout. What now?",
    a: "We only ship to addresses we can verify, so parcels don't go missing. If yours isn't found, message us on WhatsApp and we'll take your order and arrange delivery directly.",
  },
  {
    q: "Is my payment secure?",
    a: "Payments are handled by iKhokha, a South African payment provider. Your card details are entered on their secure page — we never see or store them.",
  },
];

export const metadata = {
  title: "Warranty & Shipping — Slogan Studio",
  description: "How our A/B/C condition grading works, what warranty covers, and how delivery works across South Africa.",
};

export default function WarrantyShippingPage() {
  return (
    <>
      <PageHero
        eyebrow="Warranty, grading & delivery"
        title="What you get, and how it reaches you"
        sub="Refurbished doesn't mean a gamble. Here's exactly what each grade means, what's covered, and how we deliver."
      />

      {/* ---------- Grading ---------- */}
      <section className="wrap py-16 md:py-20">
        <Reveal className="max-w-2xl">
          <Eyebrow>Condition grading</Eyebrow>
          <h2 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.8px] md:text-[36px]">
            Three grades, <span className="text-volt">one honest standard</span>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Every device is measured the same way. The grade tells you about looks — never about whether it works.
          </p>
        </Reveal>

        <Reveal className="mt-10 grid gap-6 md:grid-cols-3">
          {GRADES.map((g, idx) => {
            const style = GRADE_STYLE[g];
            return (
              <article
                key={g}
                className={`flex flex-col overflow-hidden rounded-lg border border-hairline bg-white transition hover:-translate-y-1.5 hover:shadow-volt-sm ${style.ring}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={`/grade-${g}.png`}
                    alt={style.slot}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`inline-flex items-center gap-2.5 font-display text-sm font-bold ${style.text}`}>
                      <span className={`h-[13px] w-[13px] rounded-full ${style.dot} shadow-[0_0_14px_currentColor]`} />
                      GRADE {g}
                    </div>
                    <span className="font-display text-[15px] font-bold opacity-15">0{idx + 1}</span>
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold">{GRADE_LABEL[g]}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{GRADE_BLURB[g]}</p>
                </div>
              </article>
            );
          })}
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/shop" className="btn btn-primary">
            <span>Browse graded devices</span>
            <ArrowIcon className="h-4 w-4 stroke-white" />
          </Link>
          <p className="text-[15px] text-muted">Not sure which grade suits you? We&apos;ll help you choose.</p>
        </Reveal>
      </section>

      {/* ---------- Warranty: dark band ---------- */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="grid-texture absolute inset-0 opacity-30"
          style={{ maskImage: "radial-gradient(ellipse 70% 80% at 70% 50%,#000 20%,transparent 70%)" }}
        />
        <div className="wrap relative z-[2] py-16 md:py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Warranty cover</Eyebrow>
            <h2 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.8px] md:text-[36px]">
              What&apos;s covered, in plain terms
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#a5aebc]">
              Cover applies for the period stated on each product. Claims always start with a free diagnostic.
            </p>
          </Reveal>

          <Reveal className="mt-10 grid gap-[18px] md:grid-cols-2">
            <div className="rounded-lg border border-white/[0.08] bg-ink-2 p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-grade-a/15">
                  <ShieldIcon className="h-5 w-5 stroke-grade-a" />
                </span>
                <h3 className="font-display text-lg font-bold">What&apos;s covered</h3>
              </div>
              <ul className="grid gap-3">
                {COVERED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#c4ccd8]">
                    <CheckIcon className="mt-1 h-4 w-4 flex-shrink-0 stroke-grade-a" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-white/[0.08] bg-ink-2 p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-white/[0.06]">
                  <CloseIcon className="h-5 w-5 stroke-[#8a93a3]" />
                </span>
                <h3 className="font-display text-lg font-bold">What&apos;s not covered</h3>
              </div>
              <ul className="grid gap-3">
                {NOT_COVERED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#a5aebc]">
                    <CloseIcon className="mt-1 h-4 w-4 flex-shrink-0 stroke-[#6b7280]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Delivery ---------- */}
      <section className="wrap py-16 md:py-20">
        <Reveal className="max-w-2xl">
          <Eyebrow>Shipping &amp; delivery</Eyebrow>
          <h2 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.8px] md:text-[36px]">
            From our bench to your door
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-4 md:grid-cols-3">
          <Highlight
            icon={<TruckIcon className="h-5 w-5 stroke-volt" />}
            title="Delivery cost"
            body={`${formatRand(SHIPPING_FLAT)} under ${formatRand(FREE_SHIPPING_THRESHOLD)} — free on orders of ${formatRand(FREE_SHIPPING_THRESHOLD)} or more.`}
          />
          <Highlight icon={<ArrowIcon className="h-5 w-5 stroke-volt" />} title="Delivery time" body="3–5 working days once your order is confirmed and paid." />
          <Highlight icon={<ShieldIcon className="h-5 w-5 stroke-volt" />} title="Tracking" body="A tracking reference lands in your inbox the moment it ships." />
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
              <Image
                src="/packaging.png"
                alt="A product packaged securely for delivery"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal className="grid gap-4 sm:grid-cols-2">
            {DELIVERY_STEPS.map(({ step, title, body }) => (
              <div key={step} className="rounded-lg border border-hairline bg-white p-6 transition hover:border-volt hover:shadow-volt-sm">
                <span className="font-display text-[13px] font-bold tracking-[1px] text-volt">{step}</span>
                <h3 className="mt-2 font-display text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-y border-hairline bg-paper-2 py-16 md:py-20">
        <div className="wrap max-w-3xl">
          <Reveal>
            <Eyebrow>Common questions</Eyebrow>
            <h2 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.8px] md:text-[36px]">
              Before you order
            </h2>
          </Reveal>

          <Reveal className="mt-8 grid gap-3">
            {FAQS.map(({ q, a }) => (
              /* Native <details> — accessible and keyboard-operable with no JS. */
              <details key={q} className="group rounded-lg border border-hairline bg-white px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15.5px] font-semibold">
                  {q}
                  <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border border-hairline text-volt transition group-open:rotate-45">
                    <span className="text-lg leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="wrap py-16 md:py-20">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-[26px] font-bold tracking-[-0.5px] md:text-[30px]">Still have a question?</h2>
          <p className="max-w-md text-[15px] leading-relaxed text-muted">
            Ask us before you buy — we&apos;d rather help you pick the right device than sell you the wrong one.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <a href="https://wa.me/27739812427" className="btn btn-primary">
              <ChatIcon className="h-4 w-4 stroke-white" />
              <span>WhatsApp 073 981 2427</span>
            </a>
            <Link href="/track" className="btn btn-ghost">
              Track an existing order
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Highlight({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-paper-2 p-6 transition hover:border-volt hover:bg-white">
      <span className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-volt/10">{icon}</span>
      <h3 className="font-display text-base font-bold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
