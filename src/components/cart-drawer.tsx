"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, selectSubtotal, SHIPPING_FLAT } from "@/lib/cart-store";
import { formatRand } from "@/lib/utils";
import { CloseIcon, PlusIcon, MinusIcon, ArrowIcon, CartIcon } from "./icons";
import { GradeBadge } from "./grade-badge";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove } = useCart();
  const subtotal = useCart(selectSubtotal);
  const shipping = items.length ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-[70] bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[80] flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2 className="font-display text-lg font-bold">Your Cart</h2>
          <button onClick={close} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-sm transition hover:bg-paper-2">
            <CloseIcon className="h-5 w-5 stroke-ink" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <CartIcon className="h-12 w-12 stroke-hairline" />
            <p className="font-display text-lg font-semibold">Your cart is empty</p>
            <p className="text-sm text-muted">Add some graded tech and it&apos;ll show up here.</p>
            <Link href="/shop" onClick={close} className="btn btn-primary mt-2">
              <span>Browse products</span>
              <ArrowIcon className="h-4 w-4 stroke-white" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-hairline py-4 last:border-0">
                  <Link href={`/product/${item.slug}`} onClick={close} className="relative h-20 w-20 flex-shrink-0 overflow-hidden border border-hairline bg-mist">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/product/${item.slug}`} onClick={close} className="font-display text-sm font-semibold leading-tight">
                        {item.name}
                      </Link>
                      <button onClick={() => remove(item.id)} aria-label="Remove" className="text-muted transition hover:text-ink">
                        <CloseIcon className="h-4 w-4 stroke-current" />
                      </button>
                    </div>
                    <GradeBadge grade={item.grade} className="mt-1 w-fit" />
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-hairline">
                        <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease" className="grid h-7 w-7 place-items-center transition hover:bg-paper-2">
                          <MinusIcon className="h-3.5 w-3.5 stroke-ink" />
                        </button>
                        <span className="w-7 text-center font-display text-sm font-semibold">{item.qty}</span>
                        <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase" className="grid h-7 w-7 place-items-center transition hover:bg-paper-2">
                          <PlusIcon className="h-3.5 w-3.5 stroke-ink" />
                        </button>
                      </div>
                      <span className="font-display text-sm font-bold">{formatRand(item.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-hairline px-6 py-5">
              <div className="mb-1 flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span>{formatRand(subtotal)}</span>
              </div>
              <div className="mb-3 flex justify-between text-sm text-muted">
                <span>Shipping</span>
                <span>{formatRand(shipping)}</span>
              </div>
              <div className="mb-4 flex justify-between border-t border-hairline pt-3 font-display text-lg font-bold">
                <span>Total</span>
                <span>{formatRand(total)}</span>
              </div>
              <Link href="/checkout" onClick={close} className="btn btn-primary w-full justify-center">
                <span>Checkout</span>
                <ArrowIcon className="h-4 w-4 stroke-white" />
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
