import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "AnnaDrishti — See Beyond the Label | AI Food Label Intelligence",
  description:
    "AI-powered food label intelligence platform. Decode packaged food nutrition, ingredient purposes, personal allergen matching, transparent product ratings, and verified Open Food Facts alternatives.",
  keywords: [
    "food label intelligence",
    "packaged food nutrition",
    "OCR food label",
    "allergen checker",
    "FSSAI label analyzer",
    "healthier food alternatives",
    "AnnaDrishti",
  ],
  authors: [{ name: "AnnaDrishti Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-ivory-50 text-stone-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
