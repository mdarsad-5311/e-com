"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import "@/styles/bottom-nav.css";

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItemsCount } = useCart();

  const isHome = pathname === "/";
  const isCategories = pathname.startsWith("/category");
  const isSearch = pathname === "/search" || (pathname === "/products" && !pathname.startsWith("/category"));
  const isCart = pathname === "/cart";
  const isProfile = pathname.startsWith("/profile") || pathname === "/login" || pathname === "/register" || pathname.startsWith("/orders") || pathname.startsWith("/track-order");
  const isCheckout = pathname.startsWith("/checkout");
  const isProductDetail = pathname.startsWith("/products/") && pathname !== "/products";

  if (isCheckout || isProductDetail) return null;

  return (
    <nav className="al-bottom-nav" aria-label="Mobile Navigation">
      {/* 1. Home Tab */}
      <Link href="/" className={`al-bottom-tab ${isHome ? "active" : ""}`} aria-label="Home">
        <Home size={20} strokeWidth={isHome ? 2.5 : 1.8} />
        <span className="al-bottom-label">Home</span>
      </Link>

      {/* 2. Categories Tab */}
      <Link href="/category/electronics" className={`al-bottom-tab ${isCategories ? "active" : ""}`} aria-label="Categories">
        <LayoutGrid size={20} strokeWidth={isCategories ? 2.5 : 1.8} />
        <span className="al-bottom-label">Categories</span>
      </Link>

      {/* 3. Search Tab */}
      <Link href="/search" className={`al-bottom-tab ${isSearch ? "active" : ""}`} aria-label="Search">
        <Search size={20} strokeWidth={isSearch ? 2.5 : 1.8} />
        <span className="al-bottom-label">Search</span>
      </Link>

      {/* 4. Cart Tab */}
      <Link href="/cart" className={`al-bottom-tab ${isCart ? "active" : ""}`} aria-label="Cart">
        <div className="al-bottom-cart-wrap">
          <ShoppingBag size={20} strokeWidth={isCart ? 2.5 : 1.8} />
          {totalItemsCount > 0 && (
            <span className="al-bottom-cart-badge">{totalItemsCount}</span>
          )}
        </div>
        <span className="al-bottom-label">Cart</span>
      </Link>

      {/* 5. Account Tab */}
      <Link href="/profile" className={`al-bottom-tab ${isProfile ? "active" : ""}`} aria-label="Account">
        <User size={20} strokeWidth={isProfile ? 2.5 : 1.8} />
        <span className="al-bottom-label">Account</span>
      </Link>
    </nav>
  );
}

