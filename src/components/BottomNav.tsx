"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Package, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "@/styles/bottom-nav.css";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isHome = pathname === "/";
  const isSearch = pathname.startsWith("/products") || pathname.startsWith("/category");
  const isOrders = pathname.startsWith("/orders");
  const isAccount = pathname.startsWith("/profile") || pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProductPage = pathname.startsWith("/products/") && pathname !== "/products";
  const isCheckout = pathname.startsWith("/checkout");

  if (isProductPage || isCheckout) return null;

  return (
    <nav className="al-bottom-nav">
      <Link href="/" className={`al-bottom-tab ${isHome ? "active" : ""}`}>
        <Home size={22} strokeWidth={isHome ? 2.5 : 1.8} />
        <span className="al-bottom-label">Home</span>
      </Link>

      <Link href="/products" className={`al-bottom-tab ${isSearch ? "active" : ""}`}>
        <Search size={22} strokeWidth={isSearch ? 2.5 : 1.8} />
        <span className="al-bottom-label">Search</span>
      </Link>

      <Link href="/orders" className={`al-bottom-tab ${isOrders ? "active" : ""}`}>
        <Package size={22} strokeWidth={isOrders ? 2.5 : 1.8} />
        <span className="al-bottom-label">Orders</span>
      </Link>

      <Link href={user ? "/profile" : "/login"} className={`al-bottom-tab ${isAccount ? "active" : ""}`}>
        <User size={22} strokeWidth={isAccount ? 2.5 : 1.8} />
        <span className="al-bottom-label">Account</span>
      </Link>
    </nav>
  );
}
