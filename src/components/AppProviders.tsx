"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import { UIProvider } from "@/context/UIContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import ToastViewport from "@/components/ToastViewport";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <UIProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <Navbar />
                <main className="main-content">{children}</main>
                <Footer />
                <BottomNav />
                <CartDrawer />
                <QuickViewModal />
                <ToastViewport />
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </UIProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
