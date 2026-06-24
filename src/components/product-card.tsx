"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatRand } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";
import { GradeBadge } from "./grade-badge";
import { PlusIcon } from "./icons";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);

  return (
    <article className="card-shear group relative flex flex-col border border-hairline bg-white shadow-[0_12px_30px_-26px_rgba(8,8,16,.55)] transition-all duration-300 hover:-translate-y-1 hover:border-mist-line hover:shadow-volt-sm">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#f4f9fd] to-white">
        <GradeBadge grade={product.grade} className="absolute left-3 top-3 z-[3]" />
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width:600px) 50vw, 25vw"
          className="p-5 object-contain transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-x-0 bottom-0 z-[3] translate-y-full bg-ink/90 py-[11px] text-center font-display text-[12.5px] font-semibold tracking-[0.4px] text-white backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
          View details
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.8px] text-muted">{product.category}</div>
        <Link href={`/product/${product.slug}`} className="mb-2 font-display text-[15.5px] font-bold leading-tight transition hover:text-volt md:text-base">
          {product.name}
        </Link>
        <div className="mb-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px] leading-snug text-muted">
          {product.spec}
          <span className="h-[3px] w-[3px] rounded-full bg-muted" />
          Ship {formatRand(product.shipping)}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="font-display text-xl font-bold">
            {formatRand(product.price)}
            <small className="mt-px block text-[11px] font-medium text-muted">incl. VAT</small>
          </div>
          <button
            onClick={() => add(product)}
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-md bg-ink px-3 text-white transition duration-200 hover:-translate-y-0.5 hover:bg-volt focus:outline-none focus:ring-2 focus:ring-volt/35"
          >
            <PlusIcon className="h-[18px] w-[18px] stroke-white" />
            <span className="hidden font-display text-sm font-semibold sm:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
