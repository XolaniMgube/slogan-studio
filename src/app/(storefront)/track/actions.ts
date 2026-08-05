"use server";

import { getOrderForTracking, TrackedOrder } from "@/lib/orders-db";

export interface TrackOrderState {
  order?: TrackedOrder;
  error?: string;
}

export async function trackOrderAction(_: TrackOrderState | undefined, formData: FormData): Promise<TrackOrderState> {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!orderNumber || !email) {
    return { error: "Enter both your order number and the email you used at checkout." };
  }

  try {
    const order = await getOrderForTracking(orderNumber, email);
    if (!order) {
      return { error: "We couldn't find an order with that number and email. Double-check both and try again." };
    }
    return { order };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong looking up your order." };
  }
}
