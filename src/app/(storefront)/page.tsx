import { Hero } from "@/components/hero";
import { Featured } from "@/components/featured";
import { Reviews } from "@/components/reviews";
import { WhySection, PromoSection } from "@/components/sections";
import { getStoreProducts } from "@/lib/products-db";
import { CatalogueUnavailable } from "@/components/catalogue-unavailable";
import { Product } from "@/lib/types";

export const revalidate = 60;

/** Hero slideshow size. Enough to feel alive, few enough to stay fast. */
const MAX_HERO_SLIDES = 5;

export default async function HomePage() {
  let products: Product[] = [];
  let failed = false;

  try {
    // One query serves both the hero and the featured strip.
    products = await getStoreProducts();
  } catch (err) {
    console.error("[home] Failed to load products:", err instanceof Error ? err.message : err);
    failed = true;
  }

  const featured = products.filter((product) => product.featured);

  // Prefer featured products, but never leave the hero empty — fall back to the
  // rest of the catalogue so there's always at least one device on show.
  const heroProducts = (featured.length ? featured : products).slice(0, MAX_HERO_SLIDES);

  return (
    <>
      <Hero products={heroProducts} />
      {failed ? (
        <section className="wrap py-16">
          <CatalogueUnavailable compact />
        </section>
      ) : (
        <Featured products={featured} />
      )}
      {/* Social proof sits directly after the products — the visitor has just seen
          what's on offer, which is when other people's experience carries most weight. */}
      <Reviews />
      <WhySection />
      <PromoSection />
    </>
  );
}
