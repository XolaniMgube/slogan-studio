"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { formatRand } from "@/lib/utils";
import { ArrowIcon } from "./icons";

/** Backdrops cycled behind whatever products come through — no per-product config needed. */
const GRADIENTS = [
  "linear-gradient(135deg,#0b1220,#12385c)",
  "linear-gradient(135deg,#081627,#0b3a5e)",
  "linear-gradient(135deg,#0c111d,#12362d)",
  "linear-gradient(135deg,#12111d,#3b2a5e)",
  "linear-gradient(135deg,#0d1a1a,#0b4f4a)",
];

export function Hero({ products = [] }: { products?: Product[] }) {
  const slides = products.slice(0, GRADIENTS.length);
  const [i, setI] = useState(0);

  // Keep the index valid if the catalogue shrinks between renders.
  const active = slides.length ? slides[Math.min(i, slides.length - 1)] : undefined;

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div
        className="grid-texture absolute inset-0 opacity-35"
        style={{ maskImage: "radial-gradient(ellipse 80% 70% at 70% 40%,#000 30%,transparent 75%)" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(8,8,16,.92)_0%,rgba(8,8,16,.78)_48%,rgba(0,148,255,.16)_100%)]" />

      <div className="wrap relative z-[2] grid items-center gap-12 py-16 md:grid-cols-[1fr_1.04fr] md:py-20 lg:py-[88px]">
        <div>
          <span className="mb-5 inline-flex animate-rise items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[2px] text-volt [animation-delay:.1s]">
            <span className="h-[7px] w-[7px] animate-pulse2 rounded-full bg-volt" />
            Latest Drops · In Stock Now
          </span>
          <h1 className="mb-[22px] font-display text-[clamp(40px,5.4vw,68px)] font-bold leading-none tracking-[-2px]">
            <span className="block animate-rise [animation-delay:.18s]">Refurbished tech,</span>
            <span className="block animate-rise [animation-delay:.3s]">
              <span className="text-volt [text-shadow:0_0_30px_rgba(0,148,255,.35)]">engineered</span> to last.
            </span>
          </h1>
          <p className="mb-[32px] max-w-[500px] animate-rise text-[17px] leading-relaxed text-[#b6becb] md:text-lg [animation-delay:.42s]">
            Shop tested laptops, MacBooks, iPhones and accessories with transparent grading, warranty cover and nationwide delivery.
          </p>
          <div className="flex animate-rise flex-wrap gap-3.5 [animation-delay:.54s]">
            <Link href="/shop" className="btn btn-primary">
              <span>Shop now</span>
              <ArrowIcon className="h-4 w-4 stroke-white" />
            </Link>
            <Link href="/warranty-shipping" className="btn btn-ghost-light">
              How grading works
            </Link>
          </div>
          <div className="mt-10 grid max-w-[560px] animate-rise grid-cols-2 gap-x-7 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-3 [animation-delay:.66s]">
            <Stat n="3-Mo" l="Warranty on refurb" />
            <Stat n="100%" l="Tested & inspected" highlight />
            <Stat n="3–5d" l="Nationwide shipping" />
          </div>
        </div>

        <div className="relative animate-rise [animation-delay:.35s]">
          <div
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0f18] p-5 shadow-[0_34px_80px_-42px_rgba(0,148,255,.65),inset_0_1px_0_rgba(255,255,255,.08)] sm:p-6"
          >
            {(slides.length ? slides : [null]).map((_, idx) => (
              <div
                key={idx}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{ backgroundImage: GRADIENTS[idx % GRADIENTS.length], opacity: idx === i || !slides.length ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,.08),transparent_44%,rgba(8,8,16,.42))]" />

            <div className="relative z-[2] flex min-h-[300px] flex-col justify-between sm:min-h-[390px]">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-[1.2px] text-white/80">
                  Featured device
                </div>
              </div>

              {active ? (
                /* Horizontal track — all slides rendered side by side and shifted,
                   so products slide rather than pop. Matches the dot animation. */
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)]"
                    style={{ transform: `translateX(-${i * 100}%)` }}
                  >
                    {slides.map((product, idx) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        aria-hidden={idx !== i}
                        tabIndex={idx === i ? undefined : -1}
                        className="group/slide w-full shrink-0 px-px"
                      >
                        {/* The product photos have white backgrounds. Rounding and
                            ringing the frame makes that read as a deliberate white
                            product card rather than a pasted rectangle. */}
                        <div className="relative mx-auto h-[210px] w-full max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_44px_-18px_rgba(0,0,0,.55)] ring-1 ring-white/15 sm:h-[280px]">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            priority={idx === 0}
                            sizes="(max-width:640px) 90vw, 440px"
                            className="object-contain p-3 transition-transform duration-500 group-hover/slide:scale-[1.04]"
                          />
                        </div>

                        <div className="mt-4 rounded-xl border border-white/10 bg-ink/[0.74] p-4 backdrop-blur transition group-hover/slide:border-volt/40">
                          <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                              <p className="font-display text-xl font-bold text-white">{product.name}</p>
                              <p className="mt-1 text-sm text-[#b6becb]">
                                Grade {product.grade} · {product.spec}
                              </p>
                            </div>
                            <p className="font-display text-2xl font-bold text-volt">{formatRand(product.price)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                /* Catalogue empty or unreachable — keep the panel looking intentional. */
                <>
                  <div className="grid flex-1 place-items-center px-6 text-center">
                    <p className="max-w-[280px] text-[15px] text-[#b6becb]">
                      Fresh stock lands every week — tested, graded and covered by warranty.
                    </p>
                  </div>
                  <Link href="/shop" className="btn btn-primary w-full justify-center">
                    <span>Browse the shop</span>
                    <ArrowIcon className="h-4 w-4 stroke-white" />
                  </Link>
                </>
              )}
            </div>

            {slides.length > 1 && (
              <div className="relative z-[3] mt-4 flex justify-center gap-2">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setI(idx)}
                    aria-label={`Show ${slide.name}`}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === i ? "w-9 bg-volt shadow-[0_0_10px_#0094ff]" : "w-2 bg-white/40"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l, highlight }: { n: string; l: string; highlight?: boolean }) {
  return (
    <div>
      <div className={`font-display text-[27px] font-bold leading-none ${highlight ? "text-volt" : "text-white"}`}>{n}</div>
      <div className="mt-1.5 text-[12.5px] tracking-[0.3px] text-[#7c8696]">{l}</div>
    </div>
  );
}
