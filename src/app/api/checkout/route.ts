import { NextRequest, NextResponse } from "next/server";
import { createCheckout, CheckoutLineItem } from "@/lib/yoco";
import { SHIPPING_FLAT } from "@/lib/cart-store";

interface Body {
  items: CheckoutLineItem[];
  email?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const subtotal = body.items.reduce((n, i) => n + i.price * i.qty, 0);
    const amount = subtotal + SHIPPING_FLAT;
    const reference = `SS-${Date.now().toString(36).toUpperCase()}`;

    const result = await createCheckout({
      items: body.items,
      amount,
      reference,
      customerEmail: body.email,
    });

    return NextResponse.json({ redirectUrl: result.redirectUrl, reference, mock: result.mock });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
