import Image from "next/image";
import Link from "next/link";

export function Logo({ variant = "white", withText = true }: { variant?: "white" | "black"; withText?: boolean }) {
  const src = variant === "white" ? "/logo-white.png" : "/logo-black.png";
  return (
    <Link href="/" className="group flex flex-shrink-0 items-center gap-[11px]">
      <Image
        src={src}
        alt="Slogan Studio"
        width={526}
        height={354}
        priority
        className="h-[26px] w-auto transition-transform duration-300 group-hover:-rotate-6"
      />
      {withText && (
        <span className="font-display text-[18px] font-semibold leading-none tracking-[0.5px]">
          SLOGAN STUDIO
          <small className="mt-0.5 block text-[9.5px] font-medium tracking-[3px] text-volt">REFURBISHED TECH</small>
        </span>
      )}
    </Link>
  );
}
