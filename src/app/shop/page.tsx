"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getAllProducts, CATEGORIES } from "@/lib/products";
import { Category, Grade } from "@/lib/types";
import { cn } from "@/lib/utils";

function ShopInner() {
  const params = useSearchParams();
  const initialCat = (params.get("category") as Category | null) ?? "All";

  const [category, setCategory] = useState<Category | "All">(initialCat);
  const [grades, setGrades] = useState<Set<Grade>>(new Set());
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

  const all = getAllProducts();

  const filtered = useMemo(() => {
    let list = category === "All" ? all : all.filter((p) => p.category === category);
    if (grades.size) list = list.filter((p) => grades.has(p.grade));
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [all, category, grades, sort]);

  const toggleGrade = (g: Grade) =>
    setGrades((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });

  return (
    <div className="wrap py-12">
      <div className="mb-8">
        <span className="mb-3 inline-flex items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[2.5px] text-volt before:h-0.5 before:w-6 before:bg-volt">
          Shop
        </span>
        <h1 className="font-display text-4xl font-bold tracking-[-1px]">All Products</h1>
        <p className="mt-2 text-[15px] text-muted">{filtered.length} items · every device tested, inspected and graded.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        {/* sidebar filters */}
        <aside className="space-y-8">
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-[1px]">Category</h3>
            <div className="flex flex-col gap-1">
              {(["All", ...CATEGORIES] as (Category | "All")[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "text-left text-sm transition",
                    category === c ? "font-semibold text-volt" : "text-muted hover:text-ink"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-[1px]">Condition</h3>
            <div className="flex flex-col gap-2">
              {(["A", "B", "C"] as Grade[]).map((g) => (
                <label key={g} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input type="checkbox" checked={grades.has(g)} onChange={() => toggleGrade(g)} className="accent-volt" />
                  <span
                    className={cn("h-3 w-3", g === "A" ? "bg-grade-a" : g === "B" ? "bg-grade-b" : "bg-grade-c")}
                    style={{ clipPath: "polygon(0 0,100% 0,68% 100%,0 100%)" }}
                  />
                  Grade {g}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-[1px]">Sort by</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-volt"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
        </aside>

        {/* grid */}
        <div>
          {filtered.length ? (
            <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-3 lg:gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center border border-dashed border-hairline py-24 text-center">
              <p className="font-display text-lg font-semibold">No matches</p>
              <p className="mt-1 text-sm text-muted">Try clearing a filter to see more.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="wrap py-24 text-center text-muted">Loading products…</div>}>
      <ShopInner />
    </Suspense>
  );
}
