import { Category, Product } from "./types";

/**
 * MOCK DATA LAYER
 * ---------------
 * This is the single source of truth for products while the backend isn't live.
 * Every component reads from the helpers at the bottom — never hard-codes products.
 * When the real API / admin is ready, replace the `PRODUCTS` array (or make the
 * helpers async and fetch) and nothing else has to change.
 */

export const CATEGORIES: Category[] = [
  "Laptops",
  "MacBooks",
  "iPhones",
  "Headsets",
  "Keyboards",
  "Mice",
  "AirPods",
  "Phone Cases",
  "Chargers",
];

export const PRODUCTS: Product[] = [
  {
    id: "mbp14-m1pro",
    slug: "macbook-pro-14-m1-pro",
    name: 'MacBook Pro 14" M1 Pro',
    category: "MacBooks",
    grade: "A",
    price: 12499,
    compareAt: 15999,
    shipping: 150,
    spec: "16GB · 512GB SSD",
    specs: ["Apple M1 Pro (8-core)", "16GB unified memory", "512GB SSD", '14.2" Liquid Retina XDR', "Battery cycle count < 80"],
    description:
      "A Grade-A MacBook Pro 14\" with the M1 Pro chip — tested, inspected and cosmetically near-flawless. Ideal for developers, designers and creators who want pro performance without the brand-new price.",
    stock: 4,
    images: ["/products/placeholder-macbook.svg"],
    featured: true,
  },
  {
    id: "dell-7420-i7",
    slug: "dell-latitude-7420-i7",
    name: "Dell Latitude 7420 i7",
    category: "Laptops",
    grade: "B",
    price: 6299,
    shipping: 150,
    spec: "16GB · 256GB SSD",
    specs: ["Intel Core i7-1165G7", "16GB DDR4", "256GB NVMe SSD", '14" FHD', "Windows 11 Pro"],
    description:
      "A reliable business-class ultrabook with light cosmetic wear. Fully functional and great value for work, study or everyday use.",
    stock: 7,
    images: ["/products/placeholder-laptop.svg"],
    featured: true,
  },
  {
    id: "iphone13-128",
    slug: "iphone-13-128gb",
    name: "iPhone 13 128GB",
    category: "iPhones",
    grade: "A",
    price: 8999,
    compareAt: 11999,
    shipping: 150,
    spec: "Battery 92% · Unlocked",
    specs: ["128GB storage", "Battery health 92%", "Network unlocked", "Face ID tested", "Includes charging cable"],
    description:
      "Grade-A iPhone 13, network unlocked with strong battery health. Inspected inside and out — looks and runs like new.",
    stock: 9,
    images: ["/products/placeholder-iphone.svg"],
    featured: true,
  },
  {
    id: "thinkpad-t14",
    slug: "lenovo-thinkpad-t14",
    name: "Lenovo ThinkPad T14",
    category: "Laptops",
    grade: "C",
    price: 4150,
    shipping: 150,
    spec: "8GB · 256GB SSD",
    specs: ["Intel Core i5-10210U", "8GB DDR4", "256GB SSD", '14" FHD', "Windows 11"],
    description:
      "Honest-value ThinkPad with visible wear but full functionality. Built like a tank — perfect for a tight budget that still needs to get work done.",
    stock: 5,
    images: ["/products/placeholder-laptop.svg"],
  },
  {
    id: "sony-xm4",
    slug: "sony-wh-1000xm4",
    name: "Sony WH-1000XM4",
    category: "Headsets",
    grade: "B",
    price: 2799,
    shipping: 150,
    spec: "Noise cancelling",
    specs: ["Industry-leading ANC", "30hr battery", "Bluetooth multipoint", "Touch controls", "Includes case"],
    description:
      "Premium noise-cancelling headphones with light wear. The ANC and sound quality are still class-leading.",
    stock: 6,
    images: ["/products/placeholder-headset.svg"],
    featured: true,
  },
  {
    id: "iphone12-64",
    slug: "iphone-12-64gb",
    name: "iPhone 12 64GB",
    category: "iPhones",
    grade: "B",
    price: 6499,
    shipping: 150,
    spec: "Battery 88% · Unlocked",
    specs: ["64GB storage", "Battery health 88%", "Network unlocked", "Face ID tested", "Includes charging cable"],
    description:
      "Grade-B iPhone 12, unlocked and fully functional with light cosmetic marks. Excellent everyday phone at a fair price.",
    stock: 8,
    images: ["/products/placeholder-iphone.svg"],
  },
  {
    id: "keychron-k2",
    slug: "keychron-k2-mechanical",
    name: "Keychron K2 Mechanical",
    category: "Keyboards",
    grade: "A",
    price: 1299,
    shipping: 150,
    spec: "Wireless · Hot-swap",
    specs: ["Hot-swappable switches", "Bluetooth + USB-C", "White backlight", "Mac & Windows layout", "75% compact"],
    description:
      "Grade-A wireless mechanical keyboard with hot-swap switches. A favourite among developers and writers.",
    stock: 12,
    images: ["/products/placeholder-keyboard.svg"],
    featured: true,
  },
  {
    id: "airpods-pro-2",
    slug: "airpods-pro-2nd-gen",
    name: "AirPods Pro 2nd Gen",
    category: "AirPods",
    grade: "A",
    price: 3299,
    shipping: 150,
    spec: "USB-C · MagSafe case",
    specs: ["Active noise cancellation", "Adaptive transparency", "USB-C MagSafe case", "Up to 6hr listening", "Sanitised & tested"],
    description: "Grade-A AirPods Pro (2nd gen) with the USB-C MagSafe case. Cleaned, sanitised and fully tested.",
    stock: 10,
    images: ["/products/placeholder-airpods.svg"],
    featured: true,
  },
  {
    id: "logi-mx3",
    slug: "logitech-mx-master-3",
    name: "Logitech MX Master 3",
    category: "Mice",
    grade: "B",
    price: 999,
    shipping: 150,
    spec: "Wireless · Ergonomic",
    specs: ["Darkfield 4000 DPI", "USB-C quick charge", "Multi-device", "MagSpeed scroll", "Ergonomic shape"],
    description: "The productivity mouse of choice, with light wear. Smooth, precise and built for long sessions.",
    stock: 9,
    images: ["/products/placeholder-mouse.svg"],
  },
  {
    id: "iphone-case-13",
    slug: "iphone-13-silicone-case",
    name: "iPhone 13 Silicone Case",
    category: "Phone Cases",
    grade: "A",
    price: 199,
    shipping: 150,
    spec: "MagSafe compatible",
    specs: ["Soft-touch silicone", "MagSafe compatible", "Microfibre lining", "Multiple colours", "Brand new"],
    description: "Brand-new MagSafe-compatible silicone case for iPhone 13. Protect your device in style.",
    stock: 30,
    images: ["/products/placeholder-case.svg"],
  },
  {
    id: "usbc-charger-30w",
    slug: "usb-c-30w-charger",
    name: "USB-C 30W Charger",
    category: "Chargers",
    grade: "A",
    price: 349,
    shipping: 150,
    spec: "Fast charge · GaN",
    specs: ["30W USB-C PD", "GaN technology", "Compact design", "iPhone & MacBook Air", "Brand new"],
    description: "Brand-new 30W GaN fast charger. Compact, efficient and works with iPhone and MacBook Air.",
    stock: 25,
    images: ["/products/placeholder-charger.svg"],
  },
  {
    id: "mbp13-m2",
    slug: "macbook-air-13-m2",
    name: 'MacBook Air 13" M2',
    category: "MacBooks",
    grade: "B",
    price: 11999,
    shipping: 150,
    spec: "8GB · 256GB SSD",
    specs: ["Apple M2 (8-core)", "8GB unified memory", "256GB SSD", '13.6" Liquid Retina', "Light wear on lid"],
    description: "Grade-B MacBook Air M2 — the fanless everyday machine with light cosmetic wear. Fast, silent, portable.",
    stock: 3,
    images: ["/products/placeholder-macbook.svg"],
  },
];

/* ---------- helpers — the only API the rest of the app uses ---------- */

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getByCategory(category: Category | "All"): Product[] {
  if (category === "All") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export function getBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelated(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}
