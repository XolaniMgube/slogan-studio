import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

/**
 * Root layout holds only the document shell and fonts.
 *
 * Storefront chrome (header, footer, cart drawer) lives in the (storefront)
 * route group's layout, and the admin dashboard has its own — otherwise the
 * shop header renders on top of the back office.
 */

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Slogan Studio — Refurbished Tech, Engineered to Last",
  description:
    "Quality-graded refurbished laptops, MacBooks and iPhones — tested, inspected and backed by warranty. Proudly South African.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
