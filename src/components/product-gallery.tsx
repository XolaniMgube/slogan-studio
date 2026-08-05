"use client";

import Image from "next/image";
import { useState } from "react";
import { Grade } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GradeBadge } from "./grade-badge";

/**
 * Product images with a thumbnail strip.
 *
 * Products carry 1–3 images. The detail page previously rendered only the first,
 * so any extra angles an admin uploaded were invisible to customers. Thumbnails
 * only appear when there's more than one image — a lone thumbnail under a single
 * photo just looks broken.
 */
export function ProductGallery({ images, name, grade }: { images: string[]; name: string; grade: Grade }) {
  const gallery = images.length ? images : ["/products/placeholder-laptop.svg"];
  const [active, setActive] = useState(0);
  const current = gallery[Math.min(active, gallery.length - 1)];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-hairline bg-gradient-to-br from-mist to-white">
        <GradeBadge grade={grade} className="absolute left-4 top-4 z-[3]" />
        <Image
          key={current}
          src={current}
          alt={gallery.length > 1 ? `${name} — image ${active + 1} of ${gallery.length}` : name}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          priority
          className="animate-rise object-contain p-6"
        />
        <span className="pointer-events-none absolute -bottom-10 -right-8 font-display text-[260px] font-bold leading-none text-volt/[0.05]">
          /
        </span>
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {gallery.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1} of ${gallery.length}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border bg-gradient-to-br from-mist to-white transition",
                index === active
                  ? "border-volt shadow-[0_0_0_2px_rgba(0,148,255,.2)]"
                  : "border-hairline hover:border-mist-line opacity-80 hover:opacity-100"
              )}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
