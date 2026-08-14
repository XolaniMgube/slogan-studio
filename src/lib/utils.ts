/** Format a rand integer as "R12,499". */
export function formatRand(amount: number): string {
  return "R" + amount.toLocaleString("en-ZA");
}

/** Tiny classnames joiner. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Turns any text into a URL-safe slug: "Razor Mouse Pad" -> "razor-mouse-pad".
 *
 * Product URLs are built from this, so a slug containing spaces or capitals
 * produces a percent-encoded URL that no longer matches the stored value —
 * the product 404s even though it exists and is visible.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    // Strip accents so "Café" becomes "cafe" rather than losing the letter.
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Percent-decodes a route param, tolerating values that were never encoded. */
export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export const GRADE_CLASS: Record<"A" | "B" | "C", string> = {
  A: "bg-grade-a",
  B: "bg-grade-b",
  C: "bg-grade-c",
};
