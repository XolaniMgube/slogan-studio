"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCart, selectSubtotal, calculateShipping } from "@/lib/cart-store";
import { cn, formatRand } from "@/lib/utils";
import { GradeBadge } from "@/components/grade-badge";
import { ArrowIcon, LockIcon, ShieldIcon, TruckIcon, ChatIcon, CheckIcon } from "@/components/icons";
import { AddressAutocomplete, ResolvedAddress, isAddressAutocompleteEnabled } from "@/components/address-autocomplete";
import { VALIDATION_MESSAGES, isValidEmail, isValidName, isValidSaMobile, toInternationalPhone } from "@/lib/validation";

const WHATSAPP = "https://wa.me/27739098254";

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}

function CheckoutInner() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  const { items } = useCart();
  const subtotal = useCart(selectSubtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", address2: "", city: "", province: "", postal: "" });
  const [loading, setLoading] = useState(false);
  const [addressPicked, setAddressPicked] = useState(false);

  /* Deliberately no manual-entry escape hatch: we only ship to addresses Google
     can verify, so a parcel never goes to an address that doesn't exist. The
     trade is that customers Google can't resolve must reach us on WhatsApp —
     hence the prompts below and the lookupFailed branch. */
  const [lookupFailed, setLookupFailed] = useState(false);

  const handleResolved = useCallback((address: ResolvedAddress) => {
    setForm((prev) => ({
      ...prev,
      address: address.line1 || prev.address,
      city: address.city,
      province: address.province,
      postal: address.postal,
    }));
    setAddressPicked(true);
  }, []);

  const handleAutocompleteError = useCallback(() => setLookupFailed(true), []);

  const [error, setError] = useState<string | null>(
    payment === "cancelled"
      ? "Payment was cancelled — your cart is still here, so feel free to try again."
      : payment === "failed"
        ? "The payment didn't go through. Please check your details and try again."
        : null
  );

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  /* Errors only surface once a field has been left (or Pay was pressed), so we
     don't scold someone mid-way through typing their own email address. */
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (k: string) => () => setTouched((prev) => ({ ...prev, [k]: true }));

  const fieldErrors = {
    name: isValidName(form.name) ? undefined : VALIDATION_MESSAGES.name,
    email: isValidEmail(form.email) ? undefined : VALIDATION_MESSAGES.email,
    phone: isValidSaMobile(form.phone) ? undefined : VALIDATION_MESSAGES.phone,
  };
  const errorFor = (k: keyof typeof fieldErrors) => (touched[k] ? fieldErrors[k] : undefined);

  // An address is only usable once Google has given us a city and postal code.
  const addressComplete = Boolean(form.address && form.city && form.postal);
  const incompleteAddress = addressPicked && !addressComplete;
  const detailsValid = !fieldErrors.name && !fieldErrors.email && !fieldErrors.phone;
  const valid = detailsValid && addressComplete && !lookupFailed;

  const handlePay = async () => {
    // Reveal every message at once rather than one field at a time.
    setTouched({ name: true, email: true, phone: true });
    if (!valid) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ikhokha/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, slug: i.slug, qty: i.qty })),
          // Store one canonical phone format so the admin can dial/WhatsApp it directly.
          customer: { ...form, phone: toInternationalPhone(form.phone) },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed.");
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
    <div className="wrap py-10">
      <Steps />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
        <div className="space-y-5">
          <section className="rounded-lg border border-hairline bg-white p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold">Delivery details</h2>
                <p className="mt-1 text-sm text-muted">We deliver anywhere in South Africa, 3–5 working days.</p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full border border-hairline bg-paper-2 px-3 py-1.5 text-[11px] font-semibold text-muted sm:flex">
                <LockIcon className="h-3.5 w-3.5 stroke-muted" />
                Encrypted
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={form.name}
                onChange={set("name")}
                onBlur={touch("name")}
                error={errorFor("name")}
                className="sm:col-span-2"
                autoComplete="name"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={set("email")}
                onBlur={touch("email")}
                error={errorFor("email")}
                autoComplete="email"
              />
              <Field
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                onBlur={touch("phone")}
                error={errorFor("phone")}
                autoComplete="tel"
              />

              <div className="sm:col-span-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-display text-[13px] font-medium">
                    Street address
                    {addressComplete && <span className="ml-1.5 text-[11px] font-normal text-grade-a">✓ verified</span>}
                  </span>

                  {isAddressAutocompleteEnabled && !lookupFailed ? (
                    <>
                      <AddressAutocomplete onResolved={handleResolved} onError={handleAutocompleteError} />
                      {form.address && <span className="mt-1 text-xs text-muted">Selected: {form.address}</span>}
                    </>
                  ) : (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      Our address lookup isn&apos;t available right now. Message us on WhatsApp and we&apos;ll take your order
                      directly.
                    </div>
                  )}
                </label>

                <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                  <ChatIcon className="h-3.5 w-3.5 stroke-muted" />
                  Can&apos;t find your address?
                  <a href={WHATSAPP} className="font-semibold text-volt underline-offset-2 hover:underline">
                    Contact us on WhatsApp
                  </a>
                  and we&apos;ll arrange delivery.
                </p>

                {incompleteAddress && (
                  <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    We couldn&apos;t get a complete postal address for that selection. Please pick a different one, or message us on
                    WhatsApp so we can confirm delivery.
                  </p>
                )}
              </div>

              <Field
                label="Unit / Complex / Building (optional)"
                value={form.address2}
                onChange={set("address2")}
                className="sm:col-span-2"
                placeholder="e.g. Unit 12B, Sandton Gate"
              />

              <Field label="City / Town" value={form.city} readOnly placeholder="From your address" />
              <Field label="Province" value={form.province} readOnly placeholder="From your address" />
              <Field label="Postal code" value={form.postal} readOnly placeholder="From your address" className="sm:col-span-2" />
            </div>

            <p className="mt-4 text-xs text-muted">
              These are filled in from your verified address so your parcel reaches you. Add a unit or complex above if you need to.
            </p>
          </section>

          {error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <button
            onClick={handlePay}
            disabled={!valid || loading}
            className="btn btn-primary w-full justify-center py-4 text-base disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LockIcon className="h-4 w-4 stroke-white" />
            <span>{loading ? "Redirecting to payment…" : `Pay ${formatRand(total)} securely`}</span>
          </button>

          <div className="rounded-lg border border-hairline bg-paper-2 p-4">
            <p className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
              <ShieldIcon className="mt-px h-4 w-4 flex-shrink-0 stroke-volt" />
              <span>
                Payments are processed by <strong className="text-ink">iKhokha</strong>, a South African payment provider. Your card
                details are entered on their secure page — <strong className="text-ink">we never see or store them</strong>.
              </span>
            </p>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-lg border border-hairline bg-paper-2 p-6">
            <h2 className="mb-4 font-display text-lg font-bold">Order summary</h2>
            <div className="space-y-4">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-hairline bg-white">
                    <Image src={i.image} alt={i.name} fill sizes="64px" className="object-contain p-1" />
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
              <Row label="Shipping" value={shipping === 0 ? "Free" : formatRand(shipping)} />
              <div className="flex justify-between border-t border-hairline pt-3 font-display text-lg font-bold">
                <span>Total</span>
                <span>{formatRand(total)}</span>
              </div>
              <p className="pt-1 text-right text-[11px] text-muted">VAT included</p>
            </div>
          </div>

          <div className="rounded-lg border border-hairline bg-white p-5">
            <Assurance icon={<CheckIcon className="h-4 w-4 stroke-volt" />} title="Tested & graded" body="Inspected before it ships. No surprises." />
            <Assurance icon={<TruckIcon className="h-4 w-4 stroke-volt" />} title="Tracked delivery" body="3–5 working days, nationwide." />
            <Assurance icon={<ShieldIcon className="h-4 w-4 stroke-volt" />} title="Secure payment" body="Processed by iKhokha. We never store card details." last />
          </div>

          <a href={WHATSAPP} className="flex items-center justify-center gap-2 rounded-lg border border-hairline bg-white px-4 py-3 text-sm font-semibold transition hover:border-volt hover:text-volt">
            <ChatIcon className="h-4 w-4 stroke-current" />
            Need help? WhatsApp 073 909 8254
          </a>
        </aside>
      </div>
    </div>
  );
}

function Steps() {
  const steps = ["Cart", "Delivery", "Payment"];
  const current = 1;

  return (
    <div className="flex items-center gap-3">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "grid h-6 w-6 place-items-center rounded-full font-display text-[11px] font-bold",
                idx < current ? "bg-grade-a text-white" : idx === current ? "bg-volt text-white" : "border border-hairline bg-white text-muted"
              )}
            >
              {idx < current ? <CheckIcon className="h-3 w-3 stroke-white" /> : idx + 1}
            </span>
            <span className={cn("font-display text-sm", idx === current ? "font-bold text-ink" : "text-muted")}>{label}</span>
          </div>
          {idx < steps.length - 1 && <span className="h-px w-6 bg-hairline sm:w-10" />}
        </div>
      ))}
    </div>
  );
}

function Assurance({ icon, title, body, last }: { icon: React.ReactNode; title: string; body: string; last?: boolean }) {
  return (
    <div className={cn("flex gap-3", !last && "mb-4 border-b border-hairline pb-4")}>
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="font-display text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  className,
  readOnly,
  error,
  ...props
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="font-display text-[13px] font-medium">
        {label}
        {readOnly && props.value ? <span className="ml-1.5 text-[11px] font-normal text-grade-a">✓ verified</span> : null}
      </span>
      <input
        {...props}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        className={cn(
          "rounded-md border px-3.5 py-2.5 text-sm outline-none transition",
          readOnly
            ? "cursor-default border-hairline bg-paper-2 text-muted placeholder:text-muted/60"
            : error
              ? "border-red-400 bg-white focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,.15)]"
              : "border-hairline-strong bg-white focus:border-volt focus:shadow-[0_0_0_3px_rgba(0,148,255,.15)]"
        )}
      />
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
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
