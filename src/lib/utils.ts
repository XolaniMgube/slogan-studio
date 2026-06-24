/** Format a rand integer as "R12,499". */
export function formatRand(amount: number): string {
  return "R" + amount.toLocaleString("en-ZA");
}

/** Tiny classnames joiner. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const GRADE_CLASS: Record<"A" | "B" | "C", string> = {
  A: "bg-grade-a",
  B: "bg-grade-b",
  C: "bg-grade-c",
};
