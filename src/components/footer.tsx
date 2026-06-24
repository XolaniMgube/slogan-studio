import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink pb-[30px] pt-[66px] text-white">
      <span className="pointer-events-none absolute left-1/2 top-[30px] -translate-x-1/2 font-display text-[200px] font-bold leading-none tracking-[-6px] text-white/[0.018]">
        /
      </span>
      <div className="wrap">
        <div className="relative z-[2] grid grid-cols-2 gap-10 border-b border-white/[0.08] pb-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-[18px]">
              <Logo />
            </div>
            <p className="max-w-[280px] text-sm leading-relaxed text-[#8a93a3]">
              Quality technology that&apos;s accessible, reliable and affordable. A proudly South African, youth-driven technology company.
            </p>
          </div>

          <FootCol title="Shop" links={[["Laptops & MacBooks", "/shop?category=Laptops"], ["iPhones", "/shop?category=iPhones"], ["Accessories", "/shop"], ["All products", "/shop"]]} />
          <FootCol title="Company" links={[["About us", "/about"], ["Warranty", "/warranty"], ["Shipping", "/shipping"], ["Services", "/services"]]} />

          <div>
            <h5 className="mb-[18px] font-display text-[13px] font-semibold uppercase tracking-[1.5px]">Get in touch</h5>
            <p className="mb-3 text-sm leading-relaxed text-[#8a93a3]">
              2 Cassandra Avenue,
              <br />
              Bedworth Park, Vereeniging, 1939
            </p>
            <a href="https://wa.me/27739812427" className="mb-3 block font-display text-sm font-semibold text-volt transition hover:text-white">
              WhatsApp 073 981 2427
            </a>
            <a href="mailto:info@sloganstudio.co.za" className="block text-sm text-[#8a93a3] transition hover:text-volt">
              info@sloganstudio.co.za
            </a>
          </div>
        </div>

        <div className="relative z-[2] flex flex-wrap items-center justify-between gap-3 pt-6">
          <p className="text-[13px] text-[#6b7280]">© {new Date().getFullYear()} Slogan Studio. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {["3-mo warranty", "R150 delivery", "Nationwide"].map((t) => (
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
    <div>
      <h5 className="mb-[18px] font-display text-[13px] font-semibold uppercase tracking-[1.5px]">{title}</h5>
      {links.map(([label, href]) => (
        <Link key={label} href={href} className="mb-3 block text-sm text-[#8a93a3] transition hover:translate-x-1 hover:text-volt">
          {label}
        </Link>
      ))}
    </div>
  );
}
