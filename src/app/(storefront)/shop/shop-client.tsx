"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, Category, Grade, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ShopClient({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const initialCat = (params.get("category") as Category | null) ?? "All";

  const [category, setCategory] = useState<Category | "All">(initialCat);
  const [grades, setGrades] = useState<Set<Grade>>(new Set());
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

  /* Filters are collapsed on phones. Previously the full sidebar — 12 categories,
     3 condition checkboxes and a sort dropdown — occupied the entire first screen,
     so you had to scroll past all of it before seeing a single product. */
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = category === "All" ? products : products.filter((p) => p.category === category);
    if (grades.size) list = list.filter((p) => grades.has(p.grade));
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, grades, sort]);

  const toggleGrade = (g: Grade) =>
    setGrades((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });

  const activeCount = (category === "All" ? 0 : 1) + grades.size;

  const clearAll = () => {
    setCategory("All");
    setGrades(new Set());
  };

  return (
    <div className="wrap py-8 sm:py-12">
      <div className="mb-5 sm:mb-8">
        <span className="mb-2 inline-flex items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[2.5px] text-volt before:h-0.5 before:w-6 before:bg-volt sm:mb-3">
          Shop
        </span>
        <h1 className="font-display text-[28px] font-bold tracking-[-1px] sm:text-4xl">All Products</h1>
        <p className="mt-1.5 text-sm text-muted sm:mt-2 sm:text-[15px]">
          {filtered.length} {filtered.length === 1 ? "item" : "items"} · every device tested, inspected and graded.
        </p>
      </div>

      {/* ---------- Mobile filter bar ---------- */}
      <div className="mb-4 flex items-center gap-2 md:hidden">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className={cn(
            "flex items-center gap-2 rounded-md border px-3.5 py-2.5 font-display text-sm font-semibold transition",
            activeCount > 0 ? "border-volt bg-volt/5 text-volt" : "border-hairline-strong bg-white text-ink"
          )}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={1.8}>
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-volt px-1 text-[11px] font-bold text-white">{activeCount}</span>
          )}
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          aria-label="Sort products"
          className="flex-1 rounded-md border border-hairline-strong bg-white px-3 py-2.5 text-sm outline-none focus:border-volt"
        >
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className={cn("min-w-0 space-y-6 md:block md:space-y-8", filtersOpen ? "block" : "hidden")}>
          <div className="rounded-lg border border-hairline bg-paper-2 p-4 md:border-0 md:bg-transparent md:p-0">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[1px]">Category</h3>
              {activeCount > 0 && (
                <button onClick={clearAll} className="text-xs font-semibold text-volt md:hidden">
                  Clear all
                </button>
              )}
            </div>

            {/* Chips on phones (scannable, thumb-friendly), plain list on desktop. */}
            <div className="flex flex-wrap gap-1.5 md:flex-col md:gap-1">
              {(["All", ...CATEGORIES] as (Category | "All")[]).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCategory(c);
                    setFiltersOpen(false);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[13px] transition md:rounded-none md:border-0 md:px-0 md:py-0 md:text-left md:text-sm",
                    category === c
                      ? "border-volt bg-volt text-white md:bg-transparent md:font-semibold md:text-volt"
                      : "border-hairline bg-white text-muted md:bg-transparent md:hover:text-ink"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-hairline bg-paper-2 p-4 md:border-0 md:bg-transparent md:p-0">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-[1px]">Condition</h3>
            <div className="flex flex-wrap gap-4 md:flex-col md:gap-2">
              {(["A", "B", "C"] as Grade[]).map((g) => (
                <label key={g} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input type="checkbox" checked={grades.has(g)} onChange={() => toggleGrade(g)} className="accent-volt" />
                  <span className={cn("h-3 w-3", g === "A" ? "bg-grade-a" : g === "B" ? "bg-grade-b" : "bg-grade-c")} />
                  Grade {g}
                </label>
              ))}
            </div>
          </div>

          {/* Sort lives in the mobile bar above, so it's desktop-only here. */}
          <div className="hidden md:block">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-[1px]">Sort by</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full rounded-md border border-hairline-strong bg-white px-3 py-2 text-sm outline-none focus:border-volt"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
        </aside>

        <div className="min-w-0">
          {filtered.length ? (
            <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-3 lg:gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-lg border border-dashed border-hairline py-16 text-center sm:py-24">
              <p className="font-display text-lg font-semibold">No matches</p>
              <p className="mt-1 text-sm text-muted">Try clearing a filter to see more.</p>
              {activeCount > 0 && (
                <button onClick={clearAll} className="btn btn-ghost mt-4">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
