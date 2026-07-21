import { Hero } from "@/components/hero";
import { Featured } from "@/components/featured";
import { WhySection, PromoSection } from "@/components/sections";
import { getFeaturedProducts } from "@/lib/products-db";

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  return (
    <>
      <Hero />
      <Featured products={featured} />
      <WhySection />
      <PromoSection />
    </>
  );
}
