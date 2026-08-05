import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A reserved space for a photo that doesn't exist yet.
 *
 * Pass `src` once you have the real image and it renders that instead — no
 * layout change, no markup to rewrite. `label` describes what belongs here so
 * whoever sources the photos knows what each slot is for.
 */
export function ImageSlot({
  label,
  src,
  alt,
  ratio = "aspect-[4/3]",
  className,
  priority,
}: {
  label: string;
  src?: string;
  alt?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", ratio, className)}>
      {src ? (
        <Image src={src} alt={alt ?? label} fill priority={priority} sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center border border-dashed border-mist-line bg-gradient-to-br from-mist to-white">
          {/* Echoes the brand's sheared "/" motif so empty slots still look designed. */}
          <span className="pointer-events-none absolute -bottom-8 -right-4 select-none font-display text-[150px] font-bold leading-none text-volt/[0.06]">
            /
          </span>
          <div className="relative z-[2] px-6 text-center">
            <svg viewBox="0 0 24 24" className="mx-auto h-8 w-8 fill-none stroke-volt/45" strokeWidth={1.5}>
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="M21 16l-5-5-4.5 4.5L9 13l-6 6" />
            </svg>
            <p className="mt-2.5 font-display text-[13px] font-semibold text-volt/70">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
}
