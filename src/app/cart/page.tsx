"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, selectSubtotal, SHIPPING_FLAT } from "@/lib/cart-store";
import { formatRand } from "@/lib/utils";
import { GradeBadge } from "@/components/grade-badge";
import { PlusIcon, MinusIcon, CloseIcon, ArrowIcon } from "@/components/icons";

export default function CartPage() {
  const { items, setQty, remove } = useCart();
  const subtotal = useCart(selectSubtotal);
  const shipping = items.length ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="wrap grid place-items-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add some graded tech to get started.</p>
        <Link href="/shop" className="btn btn-primary mt-5">
          <span>Browse products</span>
          <ArrowIcon className="h-4 w-4 stroke-white" />
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap py-12">
      <h1 className="mb-8 font-display text-3xl font-bold tracking-[-0.5px]">Your Cart</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-hairline border-y border-hairline">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 py-5">
              <Link href={`/product/${i.slug}`} className="relative h-24 w-24 flex-shrink-0 overflow-hidden border border-hairline bg-mist">
                <Image src={i.image} alt={i.name} fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <Link href={`/product/${i.slug}`} className="font-display font-semibold">{i.name}</Link>
                  <button onClick={() => remove(i.id)} aria-label="Remove" className="text-muted hover:text-ink">
                    <CloseIcon className="h-4 w-4 stroke-current" />
                  </button>
                </div>
                <GradeBadge grade={i.grade} className="mt-1.5 w-fit" />
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center border border-hairline">
                    <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease" className="grid h-9 w-9 place-items-center hover:bg-paper-2">
                      <MinusIcon className="h-4 w-4 stroke-ink" />
                    </button>
                    <span className="w-9 text-center font-display font-semibold">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase" className="grid h-9 w-9 place-items-center hover:bg-paper-2">
                      <PlusIcon className="h-4 w-4 stroke-ink" />
                    </button>
                  </div>
                  <span className="font-display font-bold">{formatRand(i.price * i.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit border border-hairline bg-paper-2 p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Summary</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatRand(subtotal)}</span></div>
            <div className="flex justify-between text-muted"><span>Shipping</span><span>{formatRand(shipping)}</span></div>
            <div className="flex justify-between border-t border-hairline pt-3 font-display text-lg font-bold"><span>Total</span><span>{formatRand(total)}</span></div>
          </div>
          <Link href="/checkout" className="btn btn-primary mt-5 w-full justify-center">
            <span>Checkout</span>
            <ArrowIcon className="h-4 w-4 stroke-white" />
          </Link>
          <Link href="/shop" className="mt-3 block text-center text-sm font-semibold text-volt">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
