export type Grade = "A" | "B" | "C";

export type Category =
  | "Laptops"
  | "MacBooks"
  | "iPhones"
  | "Headsets"
  | "Keyboards"
  | "Mice"
  | "AirPods"
  | "Phone Cases"
  | "Chargers";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  grade: Grade;
  /** price in rands (integer), VAT-inclusive */
  price: number;
  /** optional strikethrough "was" price */
  compareAt?: number;
  shipping: number;
  spec: string;
  /** longer spec bullets for the detail page */
  specs: string[];
  description: string;
  stock: number;
  /** image paths — swap gradient placeholders for real photos later */
  images: string[];
  featured?: boolean;
}

export const GRADE_LABEL: Record<Grade, string> = {
  A: "Like new",
  B: "Light wear",
  C: "Honest value",
};

export const GRADE_BLURB: Record<Grade, string> = {
  A: "Minimal to no signs of use. Fully functional, cosmetically near-flawless — the closest you'll get to brand new without the price.",
  B: "Light cosmetic marks from normal use. Works perfectly, just gently used — the sweet spot for value.",
  C: "Visible wear, fully functional. For the buyer who cares about performance and price over looks.",
};
