import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { ClerkProvider } from '@clerk/nextjs';
import { DynamicImports } from '@/components/layouts/dynamic';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Triplex | Future of Wear",
    template: "%s | Triplex",
  },
  description: "Experience the world's first collection of neuro-interactive hardware. Meticulously engineered for the absolute elite.",
  keywords: ["wearables", "neuro-interactive", "hardware", "tech", "fashion tech"],
  authors: [{ name: "Triplex" }],
  creator: "Triplex",
  publisher: "Triplex",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Triplex",
    title: "Triplex | Future of Wear",
    description: "Experience the world's first collection of neuro-interactive hardware. Meticulously engineered for the absolute elite.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Triplex - Future of Wear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Triplex | Future of Wear",
    description: "Experience the world's first collection of neuro-interactive hardware.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black selection:bg-emerald-500/30`}
        >
          <Header />
          {children}
          <DynamicImports />
          <Toaster 
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}

