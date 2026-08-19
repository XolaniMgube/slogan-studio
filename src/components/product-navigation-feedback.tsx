"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LOADING_CLASS = "product-navigation-pending";

export function ProductNavigationFeedback() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  // The storefront layout stays mounted between pages, so explicitly clear the
  // cursor as soon as Next has committed the destination route.
  useEffect(() => {
    document.documentElement.classList.remove(LOADING_CLASS);
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    let fallbackTimer: number | undefined;

    const stopLoading = () => {
      document.documentElement.classList.remove(LOADING_CLASS);
      setIsLoading(false);
      window.clearTimeout(fallbackTimer);
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const link = target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      const isProductPage = destination.origin === window.location.origin && destination.pathname.startsWith("/product/");

      if (!isProductPage || destination.href === window.location.href) return;

      document.documentElement.classList.add(LOADING_CLASS);
      setIsLoading(true);
      window.clearTimeout(fallbackTimer);
      fallbackTimer = window.setTimeout(stopLoading, 10_000);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      stopLoading();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-ink/15 px-5 backdrop-blur-[1px]"
      role="status"
      aria-live="polite"
      aria-label="Opening product"
    >
      <div className="flex items-center gap-3 rounded-lg bg-ink px-5 py-3.5 font-display text-sm font-semibold text-white shadow-2xl">
        <span
          className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-volt motion-reduce:animate-none"
          aria-hidden="true"
        />
        Opening product…
      </div>
    </div>
  );
}
