import { PageHero } from "@/components/page-hero";
import { formatRand } from "@/lib/utils";
import { SHIPPING_FLAT } from "@/lib/cart-store";

export default function ShippingPage() {
  return (
    <>
      <PageHero eyebrow="Delivery" title="Shipping & delivery" sub="Fast, tracked delivery nationwide across South Africa." />
      <section className="wrap max-w-3xl py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <Info title="Flat-rate delivery" body={`${formatRand(SHIPPING_FLAT)} per order, anywhere in South Africa.`} />
          <Info title="Delivery time" body="3–5 working days once your order is confirmed and paid." />
          <Info title="Tracking" body="You'll receive a tracking reference as soon as your order ships." />
          <Info title="Collection" body="Local collection available in Vereeniging — message us to arrange." />
        </div>

        <div className="mt-10 space-y-4 text-[15px] leading-relaxed text-muted">
          <p>
            Orders are processed once payment is confirmed via our secure Yoco checkout. Devices are carefully packaged to make sure they
            reach you in the same condition they left us.
          </p>
          <p>
            If you have a specific delivery requirement or you&apos;re outside a major centre, get in touch on WhatsApp and we&apos;ll sort
            something out.
          </p>
        </div>
      </section>
    </>
  );
}

function Info({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-hairline bg-paper-2 p-6">
      <h3 className="font-display text-lg font-bold text-volt">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{body}</p>
    </div>
  );
}
