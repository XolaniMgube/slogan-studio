"use client";

import Link from "next/link";
import { useState } from "react";
import { Product, Category } from "@/lib/types";
import { ProductCard } from "./product-card";
import { ArrowIcon } from "./icons";
import { cn } from "@/lib/utils";

const CHIPS: (Category | "All")[] = ["All", "Laptops", "MacBooks", "iPhones", "Headsets", "Keyboards", "Mice", "AirPods", "Phone Cases"];

export function Featured({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Category | "All">("All");
  const shown = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section className="wrap py-16 md:py-[76px]" id="featured">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="mb-3 inline-flex items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[2px] text-volt before:h-0.5 before:w-6 before:bg-volt">
            What we stock
          </span>
          <h2 className="font-display text-[32px] font-bold tracking-[-0.5px] md:text-4xl">Featured Products</h2>
          <p className="mt-2.5 max-w-[560px] text-base leading-relaxed text-muted">Hand-picked devices, every one graded, tested and ready to ship.</p>
        </div>
        <Link href="/shop" className="btn btn-ghost">
          View all
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-2.5">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "min-h-[42px] rounded-md border px-4 py-2 font-display text-[13.5px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-volt/25",
              active === c ? "border-ink bg-ink text-white shadow-[0_12px_26px_-18px_rgba(8,8,16,.8)]" : "border-hairline bg-white text-ink hover:-translate-y-0.5 hover:border-volt hover:text-volt"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-[22px]">
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {shown.length === 0 && <p className="py-12 text-center text-muted">No products in this category yet.</p>}

      <div className="mt-10 flex justify-center">
        <Link href="/shop" className="btn btn-primary">
          <span>Shop all products</span>
          <ArrowIcon className="h-4 w-4 stroke-white" />
        </Link>
      </div>
    </section>
  );
}
