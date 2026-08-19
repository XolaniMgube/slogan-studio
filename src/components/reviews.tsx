import Link from "next/link";
import { REVIEWS, Review } from "@/lib/reviews";
import { Eyebrow } from "./eyebrow";
import { Reveal } from "./reveal";
import { StarIcon, QuoteIcon, ChatIcon } from "./icons";

/**
 * Social proof section. Renders nothing when there are no reviews, so an empty
 * catalogue of feedback never leaves a hollow section on the homepage.
 */
export function Reviews() {
  if (!REVIEWS.length) return null;

  const average = REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;

  return (
    <section className="border-t border-hairline bg-paper-2 py-14 sm:py-16 md:py-20">
      <div className="wrap">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div className="max-w-2xl">
            <Eyebrow>What customers say</Eyebrow>
            <h2 className="font-display text-[28px] font-bold leading-[1.1] tracking-[-0.8px] sm:text-[32px] md:text-[36px]">
              Bought with confidence
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <Stars rating={Math.round(average)} />
              <span className="text-sm text-muted">
                <strong className="font-display text-ink">{average.toFixed(1)}</strong> from {REVIEWS.length}{" "}
                {REVIEWS.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>

          <a href="https://wa.me/27739098254" className="btn btn-ghost hidden sm:inline-flex">
            <ChatIcon className="h-4 w-4 stroke-current" />
            <span>Ask us anything</span>
          </a>
        </Reveal>

        <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {REVIEWS.map((review, index) => (
            <ReviewCard key={`${review.name}-${index}`} review={review} />
          ))}
        </Reveal>

        <Reveal className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="btn btn-primary w-full justify-center">
            Browse the shop
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="relative flex h-full flex-col rounded-lg border border-hairline bg-white p-6 transition hover:-translate-y-1 hover:border-mist-line hover:shadow-volt-sm">
      <QuoteIcon className="absolute right-5 top-5 h-8 w-8 fill-volt/[0.07]" />

      <Stars rating={review.rating} />

      <blockquote className="relative z-[2] mt-4 flex-1 text-[15px] leading-relaxed text-muted">
        &ldquo;{review.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-5 border-t border-hairline pt-4">
        <p className="font-display text-sm font-bold">{review.name}</p>
        {review.context && <p className="mt-0.5 text-xs text-muted">{review.context}</p>}
      </figcaption>
    </figure>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} className={`h-4 w-4 ${star <= rating ? "fill-grade-b" : "fill-hairline-strong"}`} />
      ))}
    </div>
  );
}
