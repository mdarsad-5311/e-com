"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  ChevronDown, 
  MapPin, 
  User, 
  PackageCheck, 
  LogOut, 
  Menu, 
  X, 
  TrendingUp, 
  Heart,
  HelpCircle,
  Truck
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
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [locationText, setLocationText] = useState<string>("New York 10001");
  const [pincodeInput, setPincodeInput] = useState<string>("");
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const catQuery = selectedCategory !== "All" ? `&category=${encodeURIComponent(selectedCategory.toLowerCase())}` : "";
      router.push(`/products?q=${encodeURIComponent(searchInput.trim())}${catQuery}`);
    } else {
      openSearch();
    }
  };

  const handleSetPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.trim()) {
      setLocationText(pincodeInput.trim());
      setIsLocationModalOpen(false);
      setPincodeInput("");
    }
  };

  const handleSelectCity = (cityName: string, code: string) => {
    setLocationText(`${cityName} ${code}`);
    setIsLocationModalOpen(false);
  };

  const subNavLinks = [
    { name: "Mobiles", href: "/category/electronics" },
    { name: "Electronics", href: "/category/electronics" },
    { name: "Fashion", href: "/category/fashion" },
    { name: "Home", href: "/" },
    { name: "Deals", href: "/products?featured=true" },
  ];

  return (
    <header className="al-umaima-header">
      {/* Tier 1: Utility Top Bar */}
      <div className="utility-top-bar">
        <div className="header-container utility-flex">
          {/* Deliver to location */}
          <button 
            type="button" 
            className="deliver-location-btn" 
            onClick={() => setIsLocationModalOpen(true)}
            title="Choose delivery location"
          >
            <MapPin size={13} className="pin-icon" />
            <span className="deliver-text">
              Deliver to <span className="deliver-highlight">{locationText}</span>
            </span>
          </button>

          {/* Quick Utility Links */}
          <div className="utility-quick-links">
            <Link href="/faq" className="utility-link">Customer Service</Link>
            <Link href="/wishlist" className="utility-link">Registry</Link>
            <Link href="/products?featured=true" className="utility-link">Gift Cards</Link>
            <Link href="/admin" className="utility-link">Sell</Link>
          </div>
        </div>
      </div>

      {/* Tier 2: Main Navigation & Search Row */}
      <div className="main-nav-bar">
        <div className="header-container main-nav-flex">
          {/* Brand Logo */}
          <div className="brand-logo-wrap">
            <Link href="/" className="brand-logo-link">
              <span className="brand-name-text">Al-Umaima</span>
            </Link>
          </div>

          {/* Center Search Bar with All dropdown + Input + Orange Button */}
          <form className="nav-search-form" onSubmit={handleSearchSubmit}>
            <div className="search-group">
              <div className="search-select-wrap">
                <select 
                  className="search-cat-dropdown"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Select category"
                >
                  <option value="All">All</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home-living">Home & Living</option>
                  <option value="accessories">Accessories</option>
                </select>
                <ChevronDown size={12} className="select-chevron" />
              </div>

              <input 
                type="text"
                placeholder="Search products, brands and more"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="search-input"
              />

              <button type="submit" className="search-submit-btn" aria-label="Search">
                <Search size={18} strokeWidth={2.5} />
              </button>
            </div>
          </form>

          {/* Right Actions: Profile, Orders, Cart */}
          <div className="header-actions">
            {/* Profile Dropdown */}
            <div 
              className="user-nav-wrap"
              onMouseEnter={() => setIsUserDropdownOpen(true)}
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              <Link href={user ? "/profile" : "/login"} className="user-action-link nav-icon-link">
                <User size={19} className="nav-top-icon" />
                <span className="nav-top-label">{user ? user.name.split(" ")[0] : "Profile"}</span>
              </Link>

              {isUserDropdownOpen && (
                <div className="user-dropdown-menu">
                  {user ? (
                    <>
                      <div className="user-drop-header">
                        <div className="user-drop-name">{user.name}</div>
                        <div className="user-drop-email">{user.email}</div>
                      </div>
                      <div className="drop-divider" />
                      <Link href="/profile" className="drop-item"><User size={15} /> Your Account</Link>
                      <Link href="/orders" className="drop-item"><PackageCheck size={15} /> Your Orders</Link>
                      <Link href="/wishlist" className="drop-item"><Heart size={15} /> Your Wishlist ({wishlistCount})</Link>
                      <Link href="/admin" className="drop-item"><TrendingUp size={15} /> Seller Dashboard</Link>
                      <div className="drop-divider" />
                      <button onClick={logout} className="drop-item drop-logout"><LogOut size={15} /> Sign Out</button>
                    </>
                  ) : (
                    <>
                      <div className="drop-guest-header">
                        <Link href="/login" className="drop-signin-btn">Sign in</Link>
                        <div className="drop-new-text">
                          New customer? <Link href="/register" className="drop-start-link">Start here.</Link>
                        </div>
                      </div>
                      <div className="drop-divider" />
                      <Link href="/orders" className="drop-item"><PackageCheck size={15} /> Your Orders</Link>
                      <Link href="/wishlist" className="drop-item"><Heart size={15} /> Your Wishlist ({wishlistCount})</Link>
                      <Link href="/faq" className="drop-item"><HelpCircle size={15} /> Customer Service</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Orders Link */}
            <Link href="/orders" className="nav-icon-link" title="Your Orders">
              <Truck size={19} className="nav-top-icon" />
              <span className="nav-top-label">Orders</span>
            </Link>

            {/* Cart Button */}
            <button 
              type="button" 
              className="cart-action-btn nav-icon-link" 
              onClick={openCart}
              title="Shopping Cart"
            >
              <div className="cart-icon-container">
                <ShoppingCart size={20} className="nav-top-icon" />
                <span className="cart-badge">{totalItemsCount > 0 ? totalItemsCount : 3}</span>
              </div>
              <span className="nav-top-label">Cart</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              type="button" 
              className="mobile-nav-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Tier 3: Sub-Navigation Bar */}
      <nav className="sub-nav-bar">
        <div className="header-container sub-nav-flex">
          <div className="sub-nav-links">
            {subNavLinks.map((item) => {
              const isActive = item.name === "Home" 
                ? pathname === "/" 
                : (item.name === "Electronics" && (pathname.includes("electronics") || pathname.startsWith("/products")))
                  || (item.href !== "/" && pathname === item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sub-nav-item ${isActive ? "active" : ""}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-top">
              <div className="mobile-logo">Al-Umaima</div>
              <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-content">
              <div className="mobile-nav-list">
                {subNavLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mobile-divider" />

              <div className="mobile-quick-links">
                <Link href="/wishlist" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <Heart size={16} /> Wishlist ({wishlistCount})
                </Link>
                <Link href="/orders" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <PackageCheck size={16} /> My Orders
                </Link>
                <Link href="/faq" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <HelpCircle size={16} /> Help & Customer Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Overlay (Ctrl+K) */}
      {isSearchOpen && <SearchBar onClose={closeSearch} />}

      {/* Location Picker Modal */}
      {isLocationModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsLocationModalOpen(false)}>
          <div className="location-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose your location</h3>
              <button onClick={() => setIsLocationModalOpen(false)} className="close-modal-btn">
                <X size={18} />
              </button>
            </div>
            <p className="modal-sub">Select a delivery location to see product availability and delivery options.</p>

            <form onSubmit={handleSetPincode} className="pincode-form">
              <input 
                type="text" 
                placeholder="Enter ZIP code or City" 
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value)}
                className="pincode-input"
              />
              <button type="submit" className="pincode-submit-btn" disabled={!pincodeInput}>
                Apply
              </button>
            </form>

            <div className="city-pills-title">Popular Cities</div>
            <div className="city-pills-grid">
              <button type="button" onClick={() => handleSelectCity("New York", "10001")} className="city-pill">New York 10001</button>
              <button type="button" onClick={() => handleSelectCity("Los Angeles", "90001")} className="city-pill">Los Angeles 90001</button>
              <button type="button" onClick={() => handleSelectCity("Chicago", "60601")} className="city-pill">Chicago 60601</button>
              <button type="button" onClick={() => handleSelectCity("Houston", "77001")} className="city-pill">Houston 77001</button>
              <button type="button" onClick={() => handleSelectCity("Miami", "33101")} className="city-pill">Miami 33101</button>
              <button type="button" onClick={() => handleSelectCity("San Francisco", "94101")} className="city-pill">San Francisco 94101</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}