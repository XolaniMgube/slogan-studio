"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CartIcon, TruckIcon, ArrowIcon, MenuIcon, CloseIcon } from "@/components/icons";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: MenuIcon, exact: true },
  { href: "/admin/products", label: "Products", icon: CartIcon },
  { href: "/admin/orders", label: "Orders", icon: TruckIcon },
];

export function AdminShell({ children, logout }: { children: React.ReactNode; logout: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // The login screen sits under /admin but must not show the dashboard chrome —
  // there's nobody signed in to navigate yet.
  if (pathname === "/admin/login") return <>{children}</>;

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const navLinks = (
    <nav className="grid gap-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 font-display text-sm font-semibold transition",
            isActive(href, exact) ? "bg-volt text-white" : "text-[#a5aebc] hover:bg-white/[0.06] hover:text-white"
          )}
        >
          <Icon className={cn("h-[18px] w-[18px]", isActive(href, exact) ? "stroke-white" : "stroke-current")} />
          {label}
        </Link>
      ))}
    </nav>
  );

  const sidebarFooter = (
    <div className="grid gap-1 border-t border-white/[0.08] pt-4">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-md px-3 py-2.5 font-display text-sm font-semibold text-[#a5aebc] transition hover:bg-white/[0.06] hover:text-white"
      >
        <ArrowIcon className="h-[18px] w-[18px] stroke-current" />
        View store
      </Link>
      {logout}
    </div>
  );

  return (
    <div className="min-h-screen bg-paper-2 lg:grid lg:grid-cols-[248px_1fr]">
      {/* ---------- Sidebar (desktop) ---------- */}
      <aside className="sticky top-0 hidden h-screen flex-col justify-between bg-ink p-5 text-white lg:flex">
        <div>
          <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-3">
            <span className="font-display text-lg font-bold leading-none">
              Slogan Studio
              <small className="mt-1 block text-[10px] font-medium tracking-[2px] text-volt">BACK OFFICE</small>
            </span>
          </Link>
          {navLinks}
        </div>
        {sidebarFooter}
      </aside>

      {/* ---------- Mobile top bar ---------- */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-ink px-5 py-4 text-white">
          <Link href="/admin" className="font-display text-base font-bold">
            Back Office
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10"
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5 stroke-white" /> : <MenuIcon className="h-5 w-5 stroke-white" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="grid gap-1 border-t border-white/[0.08] bg-ink px-5 pb-5 pt-3 text-white">
            {navLinks}
            {sidebarFooter}
          </div>
        )}
      </div>

      {/* ---------- Content ---------- */}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Page header used by each admin screen, so titles and actions line up consistently. */
export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border-b border-hairline bg-white px-6 py-6 lg:px-9">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-[-0.5px]">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
