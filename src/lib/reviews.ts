/**
 * ⚠️ DEMO CONTENT — NOT REAL CUSTOMER REVIEWS.
 *
 * Written to show the client how the reviews section looks and reads with
 * realistic content. Nobody below is a real customer and none of these words
 * were said by anyone.
 *
 * REPLACE BEFORE THE SITE IS PROMOTED TO CUSTOMERS. Attributing invented praise
 * to named people misleads buyers, and for a refurbished-goods store — where the
 * whole proposition is honest grading — it's the wrong thing to fake.
 *
 * Real sources to draw from: WhatsApp messages, Google Business reviews, emails.
 * Ask permission before using someone's name, even a first name and initial.
 */

export interface Review {
  /** 1–5. Don't round real ratings up. */
  rating: number;
  quote: string;
  /** However the customer is happy to be credited — first name + initial is fine. */
  name: string;
  /** Optional context: what they bought, or where they're based. */
  context?: string;
}

export const REVIEWS: Review[] = [
  {
    rating: 5,
    quote:
      "The Grade A rating was spot on — I genuinely couldn't find a mark on it. Came charged, wiped and ready to go. For the price difference against new, this was a no-brainer.",
    name: "Thabo M.",
    context: 'MacBook Pro 14" · Johannesburg',
  },
  {
    rating: 5,
    quote:
      "Battery health was exactly what the listing said, which is more than I can say for the guy I nearly bought from on Facebook. Arrived in three days, properly packaged.",
    name: "Nadia P.",
    context: "iPhone 13 · Pretoria",
  },
  {
    rating: 4,
    quote:
      "Grade B was honest — there's a small scuff on the lid, exactly where the photos showed it. Machine itself runs perfectly. Only reason it's not five stars is I'd have liked a charger included.",
    name: "Sipho D.",
    context: "Dell Latitude 7420 · Vereeniging",
  },
  {
    rating: 5,
    quote:
      "Ordered on the Monday, had it by Wednesday with a tracking number the whole way. I was nervous buying refurbished online but the grading system made it clear what I was getting.",
    name: "Lerato K.",
    context: "iPhone 13 · Soweto",
  },
  {
    rating: 5,
    quote:
      "Had an issue with the keyboard about a month in. Messaged them on WhatsApp, they sorted it under warranty with no argument and no cost. That's the part that made me a repeat customer.",
    name: "Johan v. R.",
    context: 'MacBook Pro 14" · Centurion',
  },
  {
    rating: 5,
    quote:
      "Bought for my daughter starting varsity and it's held up all semester. Good spec for the money and I didn't have to worry about it being a dud.",
    name: "Ayanda N.",
    context: "Dell Latitude 7420 · Vanderbijlpark",
  },
];
