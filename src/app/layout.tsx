import "@/styles/globals.css";
import AppProviders from "@/components/AppProviders";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Al-Umaima | Premium Tech & Fashion",
    template: "%s | Al-Umaima",
  },
  description: "Experience cutting-edge technology, ANC audio gear, minimalist fashion, and smart home innovations with express global shipping.",
  keywords: ["e-commerce", "Next.js", "TypeScript", "online shop", "electronics", "fashion", "smart home", "noise canceling headphones"],
  authors: [{ name: "Al-Umaima Retail" }],
  creator: "Al-Umaima Team",
  openGraph: {
    title: "Al-Umaima | Premium Tech & Fashion",
    description: "Discover ANC headphones, smartwatch gadgets, minimalist jackets, and smart home lighting.",
    url: "https://al-umaima.example.com",
    siteName: "Al-Umaima",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Al-Umaima Spotlight",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Umaima | Premium Tech & Fashion",
    description: "Shop precision audio, minimalist fashion, and smart home gadgets.",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

