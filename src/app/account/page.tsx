import { PageHero } from "@/components/page-hero";

export default function AccountPage() {
  return (
    <>
      <PageHero eyebrow="Account" title="Sign in" sub="Account features are coming soon. For now, checkout works without an account." />
      <section className="wrap max-w-md py-16">
        <div className="border border-hairline bg-paper-2 p-8 text-center">
          <p className="text-muted">Order history, saved devices and faster checkout will live here once accounts go live.</p>
        </div>
      </section>
    </>
  );
}
