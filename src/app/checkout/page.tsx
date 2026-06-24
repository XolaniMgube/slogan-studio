"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, selectSubtotal, SHIPPING_FLAT } from "@/lib/cart-store";
import { formatRand } from "@/lib/utils";
import { GradeBadge } from "@/components/grade-badge";
import { ArrowIcon } from "@/components/icons";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const subtotal = useCart(selectSubtotal);
  const shipping = items.length ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postal: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const valid = form.name && form.email && form.phone && form.address && form.city && form.postal;

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
          email: form.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed.");
      clear();
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="wrap grid place-items-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add some products before checking out.</p>
        <Link href="/shop" className="btn btn-primary mt-5">
          <span>Browse products</span>
          <ArrowIcon className="h-4 w-4 stroke-white" />
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap py-12">
      <h1 className="mb-8 font-display text-3xl font-bold tracking-[-0.5px]">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* form */}
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold">Delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={form.name} onChange={set("name")} className="sm:col-span-2" />
            <Field label="Email" type="email" value={form.email} onChange={set("email")} />
            <Field label="Phone" type="tel" value={form.phone} onChange={set("phone")} />
            <Field label="Street address" value={form.address} onChange={set("address")} className="sm:col-span-2" />
            <Field label="City / Town" value={form.city} onChange={set("city")} />
            <Field label="Postal code" value={form.postal} onChange={set("postal")} />
          </div>

          {error && <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <button onClick={handlePay} disabled={!valid || loading} className="btn btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
            <span>{loading ? "Redirecting to payment…" : `Pay ${formatRand(total)}`}</span>
            {!loading && <ArrowIcon className="h-4 w-4 stroke-white" />}
          </button>
          <p className="mt-3 text-center text-xs text-muted">Secure payment via Yoco. You&apos;ll be redirected to complete your purchase.</p>
        </div>

        {/* summary */}
        <aside className="h-fit border border-hairline bg-paper-2 p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Order summary</h2>
          <div className="space-y-4">
            {items.map((i) => (
              <div key={i.id} className="flex gap-3">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden border border-hairline bg-mist">
                  <Image src={i.image} alt={i.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="font-display text-sm font-semibold leading-tight">{i.name}</span>
                  <GradeBadge grade={i.grade} className="mt-1 w-fit" />
                  <div className="mt-auto flex justify-between text-sm">
                    <span className="text-muted">Qty {i.qty}</span>
                    <span className="font-semibold">{formatRand(i.price * i.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-1.5 border-t border-hairline pt-4 text-sm">
            <Row label="Subtotal" value={formatRand(subtotal)} />
            <Row label="Shipping" value={formatRand(shipping)} />
            <div className="flex justify-between border-t border-hairline pt-3 font-display text-lg font-bold">
              <span>Total</span>
              <span>{formatRand(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  className,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="font-display text-[13px] font-medium">{label}</span>
      <input {...props} className="border border-hairline bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-volt focus:shadow-[0_0_0_3px_rgba(0,148,255,.15)]" />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
