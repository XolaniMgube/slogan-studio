"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { PlusIcon, MinusIcon, CartIcon, CheckIcon } from "./icons";

export function AddToCart({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const out = product.stock <= 0;

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center border border-hairline">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="grid h-12 w-12 place-items-center transition hover:bg-paper-2"
        >
          <MinusIcon className="h-4 w-4 stroke-ink" />
        </button>
        <span className="w-10 text-center font-display text-base font-semibold">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          aria-label="Increase quantity"
          className="grid h-12 w-12 place-items-center transition hover:bg-paper-2"
        >
          <PlusIcon className="h-4 w-4 stroke-ink" />
        </button>
      </div>

      <button onClick={handleAdd} disabled={out} className="btn btn-primary min-w-[200px] justify-center disabled:cursor-not-allowed disabled:opacity-50">
        {added ? (
          <>
            <CheckIcon className="h-4 w-4 stroke-white" />
            <span>Added to cart</span>
          </>
        ) : (
          <>
            <CartIcon className="h-[18px] w-[18px] stroke-white" />
            <span>{out ? "Out of stock" : "Add to cart"}</span>
          </>
        )}
      </button>
    </div>
  );
}
