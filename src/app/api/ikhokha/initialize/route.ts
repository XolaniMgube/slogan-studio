import { NextRequest, NextResponse } from "next/server";
import { createPaylink, isIkhokhaConfigured } from "@/lib/ikhokha";
import { calculateShipping } from "@/lib/shop-config";
import { CheckoutCustomer, createOrderNumber, createPendingOrder } from "@/lib/orders-db";
import { getProductBySlug } from "@/lib/products-db";
import { VALIDATION_MESSAGES, isValidEmail, isValidName, isValidSaMobile, toInternationalPhone } from "@/lib/validation";
import { Grade } from "@/lib/types";

interface CheckoutItemInput {
  id: string;
  slug: string;
  qty: number;
}

interface Body {
  items: CheckoutItemInput[];
  customer: CheckoutCustomer;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.items?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (!body.customer?.address || !body.customer.city || !body.customer.postal) {
    return NextResponse.json({ error: "Delivery details are incomplete." }, { status: 400 });
  }

  // Same rules the form applies — repeated here because a crafted request never
  // goes near the form.
  if (!isValidName(body.customer.name ?? "")) {
    return NextResponse.json({ error: VALIDATION_MESSAGES.name }, { status: 400 });
  }
  if (!isValidEmail(body.customer.email ?? "")) {
    return NextResponse.json({ error: VALIDATION_MESSAGES.email }, { status: 400 });
  }
  if (!isValidSaMobile(body.customer.phone ?? "")) {
    return NextResponse.json({ error: VALIDATION_MESSAGES.phone }, { status: 400 });
  }

  const customer = { ...body.customer, phone: toInternationalPhone(body.customer.phone) };
  if (!isIkhokhaConfigured()) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  // Re-price every item from the database — never trust client-submitted prices/names.
  let resolvedItems: { id: string; slug: string; name: string; price: number; grade: Grade; image: string; qty: number }[];
  try {
    resolvedItems = await Promise.all(
      body.items.map(async (item) => {
        const product = await getProductBySlug(item.slug);
        if (!product || product.id !== item.id) throw new Error(`"${item.slug}" is no longer available.`);

        // Fail before taking payment. This is a best-effort check — stock can still
        // sell out between here and confirmation, which mark_order_paid catches
        // atomically and reports as a shortfall.
        const qty = Math.max(1, Math.round(item.qty));
        if (product.stock <= 0) throw new Error(`${product.name} is sold out.`);
        if (product.stock < qty) throw new Error(`Only ${product.stock} left of ${product.name} — please reduce the quantity.`);

        return {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          grade: product.grade,
          image: product.images[0],
          qty,
        };
      })
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "One or more items are no longer available.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const subtotal = resolvedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const amount = subtotal + calculateShipping(subtotal);
  const reference = createOrderNumber();

  let result;
  try {
    result = await createPaylink({ amount, reference });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment provider error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  try {
    const order = await createPendingOrder({
      customer,
      items: resolvedItems,
      ikhokhaCheckoutId: result.checkoutId,
      paymentReference: reference,
      paymentStatus: "pending",
    });

    return NextResponse.json({ redirectUrl: result.redirectUrl, reference, orderId: order.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
