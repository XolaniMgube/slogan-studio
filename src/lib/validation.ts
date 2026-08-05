/**
 * Shared checkout validation. Deliberately NOT server-only — the checkout form
 * and the /api/ikhokha/initialize route both use it, so the rules can't drift
 * apart. Client-side checks are for UX; the server repeats them because a
 * crafted request never touches the form.
 */

export function isValidName(value: string): boolean {
  return value.trim().length >= 2;
}

export function isValidEmail(value: string): boolean {
  // Practical rather than RFC-exhaustive: something, @, something, dot, TLD.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** Strips the spacing, dashes and brackets people naturally type into phone fields. */
export function normalisePhone(value: string): string {
  return value.replace(/[\s\-().]/g, "");
}

/**
 * South African mobile numbers, in either form people actually write:
 *   local          0XX XXX XXXX
 *   international  +27XX XXX XXXX   (also accepted without the +)
 *
 * Second digit must be 6, 7 or 8 — those are SA mobile ranges. Landlines
 * (011, 021, …) are rejected on purpose: this number is used for delivery
 * contact and courier SMS.
 */
export function isValidSaMobile(value: string): boolean {
  const cleaned = normalisePhone(value);
  return /^0[6-8]\d{8}$/.test(cleaned) || /^\+?27[6-8]\d{8}$/.test(cleaned);
}

/**
 * Canonical +27 form, so every stored number looks the same and can be used
 * directly in a WhatsApp/tel link from the admin panel.
 */
export function toInternationalPhone(value: string): string {
  const cleaned = normalisePhone(value);
  if (/^0[6-8]\d{8}$/.test(cleaned)) return `+27${cleaned.slice(1)}`;
  if (/^27[6-8]\d{8}$/.test(cleaned)) return `+${cleaned}`;
  return cleaned;
}

/**
 * Order numbers are typed by hand off a screen or an email, so accept whatever
 * shape the customer produces: lower case, stray spaces, a dash they remembered
 * from somewhere. Strip everything that isn't a letter or digit and upper-case
 * the rest.
 */
export function normaliseOrderNumber(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

/**
 * Both stored shapes for a given input. Orders created before the dash was
 * dropped are stored as `SS-XXXX`; newer ones as `SSXXXX`. Returning both keeps
 * older orders trackable without rewriting historical data.
 */
export function orderNumberCandidates(value: string): string[] {
  const flat = normaliseOrderNumber(value);
  if (!flat) return [];
  if (!flat.startsWith("SS") || flat.length <= 2) return [flat];
  return [flat, `SS-${flat.slice(2)}`];
}

/**
 * Format masks rather than sample numbers on purpose — any realistic-looking SA
 * mobile number in an error message is almost certainly someone's real one.
 */
export const VALIDATION_MESSAGES = {
  name: "Please enter your full name.",
  email: "Please enter a valid email address.",
  phone: "Enter a valid SA mobile number — 0XX XXX XXXX or +27 XX XXX XXXX.",
} as const;
