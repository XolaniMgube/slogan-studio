import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getBySlug, getRelated } from "@/lib/products";
import { GRADE_LABEL, GRADE_BLURB } from "@/lib/types";
import { formatRand } from "@/lib/utils";
import { GradeBadge } from "@/components/grade-badge";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { CheckIcon, ArrowIcon } from "@/components/icons";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getBySlug(slug);
  if (!product) notFound();

  const related = getRelated(product);
  const saving = product.compareAt ? product.compareAt - product.price : 0;

  return (
    <div className="wrap py-10">
      <nav className="mb-6 flex items-center gap-2 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-ink">{product.category}</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* image */}
        <div className="relative aspect-square overflow-hidden border border-hairline bg-gradient-to-br from-mist to-white">
          <GradeBadge grade={product.grade} className="absolute left-4 top-4 z-[3]" />
          <Image src={product.images[0]} alt={product.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />
          <span className="pointer-events-none absolute -bottom-10 -right-8 font-display text-[260px] font-bold leading-none text-volt/[0.05]">/</span>
        </div>

        {/* info */}
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[1px] text-muted">{product.category}</div>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-[-0.5px] md:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-end gap-3">
            <span className="font-display text-3xl font-bold">{formatRand(product.price)}</span>
            {product.compareAt && <span className="pb-1 text-lg text-muted line-through">{formatRand(product.compareAt)}</span>}
            <span className="pb-1 text-xs text-muted">incl. VAT</span>
          </div>
          {saving > 0 && <p className="mt-1 font-display text-sm font-semibold text-grade-a">You save {formatRand(saving)}</p>}

          <div className="mt-5 flex items-center gap-2 border-y border-hairline py-4">
            <div className="flex items-center gap-2">
              <span
                className={`h-3.5 w-3.5 ${product.grade === "A" ? "bg-grade-a" : product.grade === "B" ? "bg-grade-b" : "bg-grade-c"}`}
                style={{ clipPath: "polygon(0 0,100% 0,68% 100%,0 100%)" }}
              />
              <span className="font-display text-sm font-semibold">Grade {product.grade} — {GRADE_LABEL[product.grade]}</span>
            </div>
            <span className="text-sm text-muted">·</span>
            <span className="text-sm text-muted">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-muted">{product.description}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{GRADE_BLURB[product.grade]}</p>

          <div className="mt-6">
            <AddToCart product={product} />
          </div>

          <ul className="mt-6 grid gap-2.5">
            {product.specs.map((s) => (
              <li key={s} className="flex items-center gap-2.5 text-sm">
                <CheckIcon className="h-4 w-4 stroke-volt" />
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-5 text-[13px] text-muted">
            <span>✓ 3-month warranty</span>
            <span>✓ {formatRand(product.shipping)} nationwide delivery</span>
            <span>✓ Secure Yoco checkout</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold tracking-[-0.5px]">More in {product.category}</h2>
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-volt">
              View all <ArrowIcon className="h-4 w-4 stroke-volt" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
