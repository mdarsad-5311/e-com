"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, LayoutGrid, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import "@/styles/bottom-nav.css";

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItemsCount } = useCart();

  const isHome = pathname === "/";
  const isOffers = pathname === "/products" && typeof window !== "undefined" && window.location.search.includes("featured");
  const isCategories = pathname.startsWith("/category");
  const isCart = pathname === "/cart";
  const isAccount = pathname.startsWith("/profile") || pathname === "/login" || pathname === "/register" || pathname.startsWith("/orders") || pathname.startsWith("/track-order");
  const isCheckout = pathname.startsWith("/checkout");
  const isProductDetail = pathname.startsWith("/products/") && pathname !== "/products";

  if (isCheckout || isProductDetail) return null;

  return (
    <nav className="al-bottom-nav" aria-label="Mobile Bottom Navigation">
      {/* 1. Home Tab */}
      <Link 
        href="/" 
        className={`al-bottom-tab ${isHome ? "active" : ""}`} 
        aria-label="Home"
      >
        <Home size={22} strokeWidth={isHome ? 2.4 : 1.7} />
        <span className="al-bottom-label">Home</span>
      </Link>

      {/* 2. Offers / Deals Tab (Matching Reference Tab 2) */}
      <Link 
        href="/products?featured=true" 
        className={`al-bottom-tab ${isOffers ? "active" : ""}`} 
        aria-label="Offers"
      >
        <Flame size={22} strokeWidth={isOffers ? 2.4 : 1.7} />
        <span className="al-bottom-label">Offers</span>
      </Link>

      {/* 3. Categories Tab (Matching Reference Tab 3 Grid Icon) */}
      <Link 
        href="/category/electronics" 
        className={`al-bottom-tab ${isCategories ? "active" : ""}`} 
        aria-label="Categories"
      >
        <LayoutGrid size={22} strokeWidth={isCategories ? 2.4 : 1.7} />
        <span className="al-bottom-label">Categories</span>
      </Link>

      {/* 4. Account Tab (Matching Reference Tab 4 User Icon) */}
      <Link 
        href="/profile" 
        className={`al-bottom-tab ${isAccount ? "active" : ""}`} 
        aria-label="Account"
      >
        <User size={22} strokeWidth={isAccount ? 2.4 : 1.7} />
        <span className="al-bottom-label">Account</span>
      </Link>

      {/* 5. Cart Tab (Matching Reference Tab 5 Cart with Red Badge) */}
      <Link 
        href="/cart" 
        className={`al-bottom-tab ${isCart ? "active" : ""}`} 
        aria-label={`Cart, ${totalItemsCount} items`}
      >
        <div className="al-bottom-cart-wrap">
          <ShoppingCart size={22} strokeWidth={isCart ? 2.4 : 1.7} />
          {totalItemsCount > 0 && (
            <span className="al-bottom-cart-badge">{totalItemsCount}</span>
          )}
        </div>
        <span className="al-bottom-label">Cart</span>
      </Link>
    </nav>
  );
}


