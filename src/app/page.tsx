import { Hero } from "@/components/hero";
import { Featured } from "@/components/featured";
import { WhySection, PromoSection } from "@/components/sections";
import { getFeatured } from "@/lib/products";

export default function HomePage() {
  const featured = getFeatured();
  return (
    <>
      <Hero />
      <Featured products={featured} />
      <WhySection />
      <PromoSection />
    </>
  );
}
