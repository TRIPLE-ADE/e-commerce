import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FlyToCart } from "@/components/fly-to-cart";
import { Header } from "@/components/header";
import { CartSidebar } from "@/components/cart-sidebar";
import { SearchOverlay } from "@/components/search-overlay";
import { AuthModal } from "@/components/auth-modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Triplex | Future of Wear",
  description: "Experience the world's first collection of neuro-interactive hardware. Meticulously engineered for the absolute elite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-emerald-500 selection:text-black bg-black text-white`}
      >
        <Header />
        {children}
        <CartSidebar />
        <SearchOverlay />
        <AuthModal />
        <FlyToCart />
      </body>
    </html>
  );
}
