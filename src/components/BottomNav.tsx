"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import "@/styles/bottom-nav.css";

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItemsCount } = useCart();

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/category") || pathname === "/products";
  const isCart = pathname === "/cart";
  const isProfile = pathname.startsWith("/profile") || pathname === "/login" || pathname === "/register" || pathname.startsWith("/orders") || pathname.startsWith("/track-order");
  const isCheckout = pathname.startsWith("/checkout");
  const isProductDetail = pathname.startsWith("/products/") && pathname !== "/products";

  if (isCheckout || isProductDetail) return null;

  return (
    <nav className="al-bottom-nav">
      {/* 1. Home Tab */}
      <Link href="/" className={`al-bottom-tab ${isHome ? "active" : ""}`}>
        <Home size={22} strokeWidth={isHome ? 2.5 : 1.8} />
        <span className="al-bottom-label">Home</span>
      </Link>

      {/* 2. Shop Tab */}
      <Link href="/products" className={`al-bottom-tab ${isShop ? "active" : ""}`}>
        <Search size={22} strokeWidth={isShop ? 2.5 : 1.8} />
        <span className="al-bottom-label">Shop</span>
      </Link>

      {/* 3. Cart Tab */}
      <Link href="/cart" className={`al-bottom-tab ${isCart ? "active" : ""}`}>
        <div className="al-bottom-cart-wrap">
          <ShoppingBag size={22} strokeWidth={isCart ? 2.5 : 1.8} />
          {totalItemsCount > 0 && (
            <span className="al-bottom-cart-badge">{totalItemsCount}</span>
          )}
        </div>
        <span className="al-bottom-label">Cart</span>
      </Link>

      {/* 4. Account Tab (Attachment 3 & 5) */}
      <Link href="/profile" className={`al-bottom-tab ${isProfile ? "active" : ""}`}>
        <User size={22} strokeWidth={isProfile ? 2.5 : 1.8} />
        <span className="al-bottom-label">Account</span>
      </Link>
    </nav>
  );
}

