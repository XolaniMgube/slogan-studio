export const SHIPPING_FLAT = 150;
export const FREE_SHIPPING_THRESHOLD = 1000;

/** R150 delivery below the threshold, free at/above it. Empty cart ships for free (nothing to ship). */
export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}
