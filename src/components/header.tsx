"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./logo";
import { SearchIcon, UserIcon, CartIcon, MenuIcon, CloseIcon } from "./icons";
import { useCart, selectCount } from "@/lib/cart-store";
import { CATEGORIES } from "@/lib/products";
import { cn } from "@/lib/utils";

const PAGES: [string, string][] = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Warranty", "/warranty"],
  ["Shipping", "/shipping"],
  ["About", "/about"],
  ["Services", "/services"],
];

export function Header() {
  const count = useCart(selectCount);
  const openCart = useCart((s) => s.open);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-ink/[0.96] text-white shadow-[0_10px_30px_rgba(8,8,16,.24)] backdrop-blur-md">
      <div className="wrap flex min-h-[76px] items-center gap-4 lg:gap-5">
        <Logo />

        <nav className="ml-2 hidden items-center gap-1 lg:flex">
          {PAGES.map(([label, href]) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-2 font-display text-sm font-semibold text-white/78 transition hover:bg-white/[0.07] hover:text-white",
                  active && "bg-white/[0.1] text-white"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="relative ml-auto hidden max-w-[400px] flex-1 md:block xl:max-w-[470px]">
          <SearchIcon className="absolute left-[14px] top-1/2 h-[17px] w-[17px] -translate-y-1/2 stroke-[#6b7280]" />
          <input
            type="text"
            placeholder="Search products..."
            className="h-11 w-full rounded-md border border-white/10 bg-white/[0.045] pl-[42px] pr-4 text-sm text-white outline-none transition placeholder:text-[#8a93a3] focus:border-volt focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(0,148,255,.22)]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/account"
            className="grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-white/[0.035] transition hover:border-white/20 hover:bg-white/[0.08]"
            aria-label="Account"
          >
            <UserIcon className="h-5 w-5 stroke-white" />
          </Link>
          <button
            onClick={openCart}
            className="relative grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-white/[0.035] transition hover:border-white/20 hover:bg-white/[0.08]"
            aria-label="Open cart"
          >
            <CartIcon className="h-5 w-5 stroke-white" />
            {count > 0 && (
              <span className="absolute right-[7px] top-[7px] grid h-4 w-4 place-items-center rounded-full bg-volt font-display text-[10px] font-bold text-white shadow-[0_0_0_2px_#080810]">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-white/[0.035] transition hover:border-white/20 hover:bg-white/[0.08] lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5 stroke-white" /> : <MenuIcon className="h-5 w-5 stroke-white" />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <nav className="border-t border-white/[0.08] bg-ink lg:hidden">
          <div className="wrap flex flex-col py-4">
            <div className="relative mb-3">
              <SearchIcon className="absolute left-[14px] top-1/2 h-[17px] w-[17px] -translate-y-1/2 stroke-[#8a93a3]" />
              <input
                type="text"
                placeholder="Search products..."
                className="h-11 w-full rounded-md border border-white/10 bg-white/[0.045] pl-[42px] pr-4 text-sm text-white outline-none placeholder:text-[#8a93a3] focus:border-volt"
              />
            </div>
            {PAGES.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 font-display text-[15px] font-semibold text-white/86",
                  pathname === href && "bg-white/[0.08] text-white"
                )}
              >
                {label}
              </Link>
            ))}
            <span className="my-1.5 h-px w-full bg-white/10" aria-hidden />
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/shop?category=${encodeURIComponent(c)}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 font-display text-sm font-medium text-white/68 transition hover:bg-white/[0.06] hover:text-white"
              >
                {c}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
