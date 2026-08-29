"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart,
  Menu, 
  X, 
  LogOut, 
  PackageCheck, 
  HelpCircle,
  TrendingUp,
  Lock
} from "lucide-react";
import SearchBar from "./SearchBar";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import "@/styles/navbar.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");

  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const { isSearchOpen, openSearch, closeSearch, openCart } = useUI();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchInput.trim())}`);
      setIsMobileMenuOpen(false);
    } else {
      openSearch();
    }
  };

  const navLinks = [
    { name: "Electronics", href: "/category/electronics" },
    { name: "Fashion", href: "/category/fashion" },
    { name: "Home Goods", href: "/category/home-goods" },
    { name: "Deals", href: "/products?featured=true" },
    { name: "New Arrivals", href: "/category/new-arrivals" },
    { name: "Support", href: "/faq" },
  ];

  if (pathname === "/checkout") {
    return (
      <header className="al-cart-secure-header">
        <div className="header-container al-cart-header-flex">
          <Link href="/" className="al-brand-logo">
            AL-UMAIMA
          </Link>
          <div className="al-secure-badge">
            <Lock size={16} className="al-lock-icon" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`al-header ${pathname === "/" ? "al-header-home" : ""}`}>
      <div className="header-container al-header-inner">
        {/* Brand Logo */}
        <div className="al-brand-col">
          <button 
            type="button" 
            className="al-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link href="/" className="al-brand-logo">
            AL-UMAIMA
          </Link>
        </div>


        {/* Desktop Navigation Links */}
        <nav className="al-nav-menu">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || 
              (item.name === "Electronics" && (pathname === "/category/electronics" || pathname.startsWith("/products")));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`al-nav-link ${isActive ? "active" : ""}`}
              >
                <span>{item.name}</span>
                {isActive && <span className="al-active-indicator" />}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar matching Reference Screenshot */}
        <div className="al-search-col">
          <form className="al-search-form" onSubmit={handleSearchSubmit}>
            <input 
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="al-search-input"
            />
            <button type="submit" className="al-search-icon-btn" aria-label="Submit search">
              <Search size={16} className="al-search-icon" />
            </button>
          </form>
        </div>

        {/* Right Icon Actions (Cart, Wishlist, Profile) */}
        <div className="al-actions-col">
          {/* Wishlist Link */}
          <Link 
            href="/wishlist" 
            className="al-action-btn" 
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={20} strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <span className="al-badge-count">{wishlistCount}</span>
            )}
          </Link>

          {/* Shopping Cart Button */}
          <button 
            type="button" 
            className="al-action-btn"
            onClick={openCart}
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={20} strokeWidth={1.8} />
            {totalItemsCount > 0 && (
              <span className="al-badge-count">{totalItemsCount}</span>
            )}
          </button>

          {/* User Profile / Dropdown */}
          <div 
            className="al-user-dropdown-wrap"
            onMouseEnter={() => setIsUserDropdownOpen(true)}
            onMouseLeave={() => setIsUserDropdownOpen(false)}
          >
            <Link 
              href={user ? "/profile" : "/login"} 
              className="al-action-btn" 
              title="Account"
              aria-label="User Account"
            >
              <User size={20} strokeWidth={1.8} />
            </Link>

            {isUserDropdownOpen && (
              <div className="al-user-menu">
                {user ? (
                  <>
                    <div className="al-user-menu-header">
                      <div className="al-user-name">{user.name}</div>
                      <div className="al-user-email">{user.email}</div>
                    </div>
                    <div className="al-menu-divider" />
                    <Link href="/profile" className="al-menu-item"><User size={15} /> Your Account</Link>
                    <Link href="/orders" className="al-menu-item"><PackageCheck size={15} /> Your Orders</Link>
                    <Link href="/wishlist" className="al-menu-item"><Heart size={15} /> Wishlist ({wishlistCount})</Link>
                    <Link href="/admin" className="al-menu-item"><TrendingUp size={15} /> Seller Dashboard</Link>
                    <div className="al-menu-divider" />
                    <button onClick={logout} className="al-menu-item al-menu-logout"><LogOut size={15} /> Sign Out</button>
                  </>
                ) : (
                  <>
                    <div className="al-user-menu-guest">
                      <Link href="/login" className="al-menu-signin-btn">Sign In</Link>
                      <div className="al-menu-new-text">
                        New here? <Link href="/register" className="al-menu-link-orange">Create account</Link>
                      </div>
                    </div>
                    <div className="al-menu-divider" />
                    <Link href="/orders" className="al-menu-item"><PackageCheck size={15} /> Track Order</Link>
                    <Link href="/wishlist" className="al-menu-item"><Heart size={15} /> Wishlist ({wishlistCount})</Link>
                    <Link href="/faq" className="al-menu-item"><HelpCircle size={15} /> Help & FAQ</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flipkart-Style Full-Width Mobile Search Bar */}
      <div className="al-mobile-search-bar-wrap">
        <div className="header-container">
          <form className="al-mobile-search-form" onSubmit={handleSearchSubmit}>
            <Search size={17} className="al-mobile-search-icon-left" />
            <input 
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="al-mobile-search-input"
              aria-label="Search products"
            />
            {searchInput.trim().length > 0 && (
              <button 
                type="button" 
                className="al-mobile-search-clear-btn"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="al-mobile-backdrop" 
            onClick={() => setIsMobileMenuOpen(false)} 
            aria-hidden="true"
          />
          <aside className="al-mobile-drawer" aria-label="Mobile Navigation Menu">
            <div className="al-drawer-header">
              <span className="al-brand-logo">AL-UMAIMA</span>
              <button 
                type="button" 
                className="al-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="al-drawer-search">
              <form className="al-search-form" onSubmit={handleSearchSubmit}>
                <input 
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="al-search-input"
                />
                <button type="submit" className="al-search-icon-btn" aria-label="Submit search">
                  <Search size={16} />
                </button>
              </form>
            </div>

            <nav className="al-drawer-nav">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || 
                  (item.name === "Electronics" && (pathname === "/category/electronics" || pathname.startsWith("/products")));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`al-drawer-link ${isActive ? "active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="al-drawer-footer">
              {user ? (
                <Link href="/profile" className="al-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <User size={16} /> {user.name || "My Account"}
                </Link>
              ) : (
                <Link href="/login" className="al-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <User size={16} /> Sign In / Register
                </Link>
              )}
              <Link href="/wishlist" className="al-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
                <Heart size={16} /> Wishlist ({wishlistCount})
              </Link>
              <Link href="/orders" className="al-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
                <PackageCheck size={16} /> My Orders
              </Link>
              <Link href="/faq" className="al-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
                <HelpCircle size={16} /> Customer Service
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* Global Quick Search Modal */}
      {isSearchOpen && <SearchBar onClose={closeSearch} />}
    </header>
  );
}