"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Clears the persisted cart once the customer actually lands on a confirmed order — never before. */
export function ClearCartOnSuccess() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
