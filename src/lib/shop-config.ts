export const SHIPPING_FLAT = 150;
export const FREE_SHIPPING_THRESHOLD = 1000;

/**
 * ⚠️ TEMPORARY TESTING OVERRIDE — REVERT TO `false` BEFORE GOING LIVE.
 *
 * While true, EVERY order ships free regardless of subtotal. This exists so
 * live iKhokha tests (which move real money — there is no sandbox mode) cost
 * ~R1–R2 instead of R1 + R150 shipping.
 *
 * Flipping this back to `false` restores the real rule: R150 under R1000,
 * free at/above R1000. Nothing else needs changing — every shipping
 * calculation in the app goes through `calculateShipping()` below.
 */
export const FREE_SHIPPING_OVERRIDE = true;

/** R150 delivery below the threshold, free at/above it. Empty cart ships for free (nothing to ship). */
export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (FREE_SHIPPING_OVERRIDE) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}
