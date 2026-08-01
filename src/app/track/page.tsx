"use client";

import { useActionState } from "react";
import { PageHero } from "@/components/page-hero";
import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/database.types";
import type { TrackedOrder } from "@/lib/orders-db";
import { trackOrderAction } from "./actions";

const STEPS: { label: string; matches: OrderStatus[] }[] = [
  { label: "Order placed", matches: ["pending_payment", "paid", "processing", "ready_to_ship", "shipped", "delivered"] },
  { label: "Payment confirmed", matches: ["paid", "processing", "ready_to_ship", "shipped", "delivered"] },
  { label: "Preparing your order", matches: ["processing", "ready_to_ship", "shipped", "delivered"] },
  { label: "Shipped", matches: ["shipped", "delivered"] },
  { label: "Delivered", matches: ["delivered"] },
];

export default function TrackOrderPage() {
  const [state, formAction, pending] = useActionState(trackOrderAction, undefined);

  return (
    <>
      <PageHero eyebrow="Delivery" title="Track your order" sub="Enter your order number and the email you used at checkout to see its status." />
      <section className="wrap max-w-xl py-16">
        <form action={formAction} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="font-display text-sm font-semibold">Order number</span>
            <input name="orderNumber" placeholder="SS-XXXXXXXXXX" required className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className="font-display text-sm font-semibold">Email</span>
            <input name="email" type="email" placeholder="you@example.com" required className="input" />
          </label>

          {state?.error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}

          <button disabled={pending} className="btn btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-50">
            {pending ? "Looking up your order…" : "Track order"}
          </button>
        </form>

        {state?.order && <OrderStatusTimeline order={state.order} />}
      </section>
    </>
  );
}

function OrderStatusTimeline({ order }: { order: TrackedOrder }) {
  if (order.status === "cancelled" || order.status === "refunded") {
    return (
      <div className="mt-10 rounded-lg border border-hairline bg-paper-2 p-6">
        <p className="font-display text-lg font-bold">Order {order.order_number}</p>
        <p className="mt-2 text-sm text-muted">
          This order was {order.status === "cancelled" ? "cancelled" : "refunded"}. If you think this is a mistake, get in touch on WhatsApp and
          we&apos;ll help sort it out.
        </p>
      </div>
    );
  }

  const activeIndex = STEPS.reduce((acc, step, i) => (step.matches.includes(order.status) ? i : acc), -1);

  return (
    <div className="mt-10 rounded-lg border border-hairline bg-paper-2 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-lg font-bold">Order {order.order_number}</p>
        <p className="text-sm text-muted">Placed {new Date(order.placed_at).toLocaleDateString()}</p>
      </div>
      <p className="mt-1 text-sm text-muted">Delivering to {order.shipping_city}</p>

      <ol className="mt-6 grid gap-4">
        {STEPS.map((step, i) => {
          const done = i <= activeIndex;
          const current = i === activeIndex;
          return (
            <li key={step.label} className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border text-xs font-bold",
                  done ? "border-volt bg-volt text-white" : "border-hairline bg-white text-muted"
                )}
              >
                {done ? <CheckIcon className="h-3.5 w-3.5 stroke-white" /> : i + 1}
              </span>
              <span className={cn("font-display text-sm", current ? "font-bold text-ink" : done ? "text-ink" : "text-muted")}>{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
