import Link from "next/link";
import { Logo } from "./logo";

const SHOP_LINKS: [string, string][] = [
  ["Laptops & MacBooks", "/shop?category=Laptops"],
  ["iPhones", "/shop?category=iPhones"],
  ["Accessories", "/shop"],
  ["All products", "/shop"],
];

const COMPANY_LINKS: [string, string][] = [
  ["About us", "/about"],
  ["Services", "/about#services"],
  ["Warranty & Shipping", "/warranty-shipping"],
  ["Track order", "/track"],
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink pb-[30px] pt-10 text-white sm:pt-[66px]">
      <span className="pointer-events-none absolute left-1/2 top-[30px] hidden -translate-x-1/2 font-display text-[200px] font-bold leading-none tracking-[-6px] text-white/[0.018] sm:block">
        /
      </span>
      <div className="wrap">
        <div className="relative z-[2] border-b border-white/[0.08] pb-8 sm:pb-12 md:grid md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-10">
          <div>
            <div className="mb-4 sm:mb-[18px]">
              <Logo />
            </div>
            {/* The positioning statement is on /about — on a phone it's just a wall
                of text between the customer and the links they came here for. */}
            <p className="hidden max-w-[280px] text-sm leading-relaxed text-[#8a93a3] sm:block">
              Quality technology that&apos;s accessible, reliable and affordable. A proudly South African, youth-driven technology company.
            </p>
          </div>

          {/* Accordions on phones so the link lists don't add ~400px of scroll;
              plain columns from md up where there's room. */}
          <FootCol title="Shop" links={SHOP_LINKS} />
          <FootCol title="Company" links={COMPANY_LINKS} />

          <div className="mt-6 md:mt-0">
            <h5 className="mb-3 font-display text-[13px] font-semibold uppercase tracking-[1.5px] sm:mb-[18px]">Get in touch</h5>
            <a href="https://wa.me/27739812427" className="mb-3 block font-display text-sm font-semibold text-volt transition hover:text-white">
              WhatsApp 073 981 2427
            </a>
            <a href="mailto:info@sloganstudio.co.za" className="block text-sm text-[#8a93a3] transition hover:text-volt">
              info@sloganstudio.co.za
            </a>
          </div>
        </div>

        <div className="relative z-[2] flex flex-wrap items-center justify-between gap-3 pt-5 sm:pt-6">
          <p className="text-[13px] text-[#6b7280]">© {new Date().getFullYear()} Slogan Studio. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            {["Free shipping R1000+", "Nationwide"].map((t) => (
              <span key={t} className="rounded-sm border border-[#26262f] px-2.5 py-[5px] font-display text-[11px] font-medium text-[#8a93a3]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <>
      {/* Mobile: native <details> accordion — no JS, keyboard accessible. */}
      <details className="group border-b border-white/[0.06] md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-display text-[13px] font-semibold uppercase tracking-[1.5px] [&::-webkit-details-marker]:hidden">
          {title}
          <span className="text-lg leading-none text-[#8a93a3] transition group-open:rotate-45">+</span>
        </summary>
        <div className="pb-3">
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="mb-3 block text-sm text-[#8a93a3] transition hover:text-volt">
              {label}
            </Link>
          ))}
        </div>
      </details>

      {/* Desktop: plain column. */}
      <div className="hidden md:block">
        <h5 className="mb-[18px] font-display text-[13px] font-semibold uppercase tracking-[1.5px]">{title}</h5>
        {links.map(([label, href]) => (
          <Link key={label} href={href} className="mb-3 block text-sm text-[#8a93a3] transition hover:translate-x-1 hover:text-volt">
            {label}
          </Link>
        ))}
      </div>
    </>
  );
}
