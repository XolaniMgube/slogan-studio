import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products-db";
import { GRADE_LABEL, GRADE_BLURB, GRADE_NAME } from "@/lib/types";
import { GRADE_CLASS, cn, formatRand, safeDecode } from "@/lib/utils";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { CheckIcon, ArrowIcon } from "@/components/icons";

export const revalidate = 60;

// No generateStaticParams: products live in the database and change through the
// admin panel, so the set of slugs isn't known at build time. Pages render on
// demand and are then cached per the revalidate window above.

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  // Decode defensively: a slug containing spaces arrives percent-encoded, and
  // matching "Mouse%20Pad" against a stored "Mouse Pad" silently 404s a live
  // product. No-op for slugs that need no encoding.
  const slug = safeDecode(rawSlug);

  // A failed lookup and a genuinely missing product are different things: a
  // failure throws through to error.tsx (retryable, and ISR can serve stale),
  // while a missing product is a real 404.
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

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
        {/* images */}
        <ProductGallery images={product.images} name={product.name} grade={product.grade} />

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
                className={cn("h-3.5 w-3.5", GRADE_CLASS[product.grade])}
                style={{ clipPath: "polygon(0 0,100% 0,68% 100%,0 100%)" }}
              />
              <span className="font-display text-sm font-semibold">{GRADE_NAME[product.grade]} — {GRADE_LABEL[product.grade]}</span>
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
            <span>✓ Free shipping on orders over R1000</span>
            <span>✓ Secure iKhokha checkout</span>
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
          {/* Only the first two on phones — four cards is a long scroll after the
              full product detail, and "View all" above already covers the rest. */}
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-5">
            {related.map((p, index) => (
              <div key={p.id} className={index > 1 ? "hidden md:block" : undefined}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
