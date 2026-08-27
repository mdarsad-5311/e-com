import "@/styles/globals.css";
import "@/styles/auth.css";
import "@/styles/navbar.css";
import "@/styles/footer.css";
import "@/styles/hero-banner.css";
import "@/styles/categories.css";
import "@/styles/deal-of-the-day.css";
import "@/styles/product-card.css";
import "@/styles/featured-products.css";
import "@/styles/best-sellers.css";
import "@/styles/brand-trust.css";
import "@/styles/customer-testimonials.css";
import "@/styles/vip-perks.css";
import "@/styles/promo-banners.css";
import "@/styles/quick-view-modal.css";
import "@/styles/cart-drawer.css";
import "@/styles/toast-viewport.css";
import "@/styles/search-bar.css";
import "@/styles/category-page.css";
import "@/styles/product-info.css";
import "@/styles/product-gallery.css";
import "@/styles/product-reviews.css";
import "@/styles/order-summary.css";
import "@/styles/orders-page.css";
import "@/styles/profile.css";
import "@/styles/breadcrumbs.css";
import "@/styles/skeleton-card.css";
import "@/styles/recently-viewed.css";
import "@/styles/cart-page.css";
import "@/styles/cart-item.css";
import "@/styles/bottom-nav.css";
import "@/styles/checkout.css";
import "@/styles/wishlist.css";
import "@/styles/track-order.css";
import "@/styles/faq.css";
import "@/styles/admin.css";
import "@/styles/fashion-page.css";
import "@/styles/home-goods.css";
import "@/styles/product-detail-extra.css";
import "@/styles/search-page.css";
import "@/styles/order-success.css";
import "@/styles/electronics-page.css";
import "@/styles/saved-addresses.css";
import "@/styles/payment-methods.css";
import "@/styles/trending-now.css";



import AppProviders from "@/components/AppProviders";
import { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

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
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

