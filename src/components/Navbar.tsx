"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  ChevronDown, 
  MapPin, 
  UserCircle, 
  User, 
  Shirt, 
  Smartphone, 
  Home, 
  Tv, 
  Heart, 
  Gift, 
  PackageCheck, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  HelpCircle, 
  TrendingUp, 
  Download 
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
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [locationText, setLocationText] = useState<string>("Location not set");
  const [pincodeInput, setPincodeInput] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("home");
  const [searchInput, setSearchInput] = useState<string>("");

  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const { isSearchOpen, openSearch, closeSearch, openCart } = useUI();
  const router = useRouter();

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
      router.push(`/products?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      openSearch();
    }
  };

  const handleSetPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.trim()) {
      setLocationText(`Delivering to ${pincodeInput.trim()}`);
      setIsLocationModalOpen(false);
      setPincodeInput("");
    }
  };

  const handleSelectCity = (cityName: string, code: string) => {
    setLocationText(`${code} - ${cityName}`);
    setIsLocationModalOpen(false);
  };

  const categoriesList = [
    { id: "home", name: "HOME", shortName: "HOME", icon: Home, link: "/category/home-living" },
    { id: "mobiles", name: "MOBILES", shortName: "MOBILES", icon: Smartphone, link: "/category/electronics" },
    { id: "fashion", name: "FASHION", shortName: "FASHION", icon: Shirt, link: "/category/fashion" },
    { id: "appliances", name: "APPLIANCES", shortName: "APPLIANCES", icon: Tv, link: "/category/electronics" },
  ];

  return (
    <div className="site-header-wrapper">
      {/* ROW 1: Top Bar with Logo & Location */}
      <div className="top-brand-bar">
        <div className="container header-container row1-flex">
          {/* Top Left: al-umaima Logo Yellow Pill Button */}
          <div className="logo-section">
            <Link href="/" className="al-umaima-pill-btn" title="Al-Umaima Home">
              <div className="pill-logo-icon">
                <span className="logo-letter">a</span>
              </div>
              <span className="pill-brand-text">al-umaima</span>
            </Link>
          </div>

          {/* Top Right: Location selector */}
          <div className="location-section">
            <MapPin size={16} className="loc-pin-icon" />
            <span className="loc-status-text">{locationText}</span>
            <button 
              type="button" 
              className="select-loc-link"
              onClick={() => setIsLocationModalOpen(true)}
            >
              Select delivery location &gt;
            </button>
          </div>
        </div>
      </div>

      {/* ROW 2: Main Navigation Bar (Search Bar & Actions) */}
      <header className="main-search-navbar">
        <div className="container header-container row2-flex">
          {/* Center Search Bar */}
          <form className="search-bar-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search size={20} strokeWidth={1.5} className="search-icon-inside" />
              <input 
                type="text"
                placeholder="Search for Products, Brands and More"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onClick={openSearch}
                className="search-input-field"
              />
            </div>
          </form>

          {/* Right Action Icons: Login Dropdown, More Dropdown, Cart */}
          <div className="nav-actions-group">
            {/* Login Dropdown */}
            <div 
              className="dropdown-wrapper"
              onMouseEnter={() => setIsUserDropdownOpen(true)}
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              <button className="nav-action-btn login-btn">
                {user ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                ) : (
                  <UserCircle size={20} className="action-icon" />
                )}
                <span className="action-label">{user ? user.name.split(" ")[0] : "Login"}</span>
                <ChevronDown size={14} className={`chevron-icon ${isUserDropdownOpen ? "open" : ""}`} />
              </button>

              {isUserDropdownOpen && (
                <div className="flip-dropdown-menu">
                  {user ? (
                    <>
                      <div className="dropdown-user-header">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                      <div className="menu-divider" />
                      <Link href="/profile" className="menu-item"><User size={16} /> My Profile</Link>
                      <Link href="/orders" className="menu-item"><PackageCheck size={16} /> My Orders</Link>
                      <Link href="/admin" className="menu-item"><TrendingUp size={16} /> Admin Panel</Link>
                      <Link href="/wishlist" className="menu-item"><Heart size={16} /> Wishlist ({wishlistCount})</Link>
                      <div className="menu-divider" />
                      <button onClick={logout} className="menu-item logout-item"><LogOut size={16} /> Sign Out</button>
                    </>
                  ) : (
                    <>
                      <div className="dropdown-header-guest">
                        <span>New customer?</span>
                        <Link href="/register" className="sign-up-link">Sign Up</Link>
                      </div>
                      <div className="menu-divider" />
                      <Link href="/login" className="login-menu-cta">Sign In</Link>
                      <div className="menu-divider" />
                      <Link href="/profile" className="menu-item"><User size={16} /> My Profile</Link>
                      <Link href="/orders" className="menu-item"><PackageCheck size={16} /> My Orders</Link>
                      <Link href="/admin" className="menu-item"><TrendingUp size={16} /> Admin Panel</Link>
                      <Link href="/wishlist" className="menu-item"><Heart size={16} /> Wishlist ({wishlistCount})</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* More Dropdown */}
            <div 
              className="dropdown-wrapper"
              onMouseEnter={() => setIsMoreDropdownOpen(true)}
              onMouseLeave={() => setIsMoreDropdownOpen(false)}
            >
              <button className="nav-action-btn more-btn">
                <span className="action-label">More</span>
                <ChevronDown size={14} className={`chevron-icon ${isMoreDropdownOpen ? "open" : ""}`} />
              </button>

              {isMoreDropdownOpen && (
                <div className="flip-dropdown-menu compact">
                  <Link href="/notifications" className="menu-item"><Bell size={16} className="text-blue" /> Notification Preferences</Link>
                  <Link href="/faq" className="menu-item"><HelpCircle size={16} className="text-blue" /> 24x7 Customer Care</Link>
                  <Link href="/advertise" className="menu-item"><TrendingUp size={16} className="text-blue" /> Advertise on Al-Umaima</Link>
                  <Link href="/app" className="menu-item"><Download size={16} className="text-blue" /> Download App</Link>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button 
              type="button" 
              className="nav-action-btn cart-btn" 
              onClick={openCart}
              title="View Cart"
            >
              <div className="cart-icon-relative">
                <ShoppingCart size={20} className="action-icon" />
                {totalItemsCount > 0 && (
                  <span className="cart-badge-count">{totalItemsCount}</span>
                )}
              </div>
              <span className="action-label">Cart</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button 
              className="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* ROW 3: Bottom Category Strip */}
      <nav className="category-strip-bar">
        <div className="container header-container">
          <div className="cat-scroll-container">
            {categoriesList.map((cat) => {
              const IconComp = cat.icon;
              const isActive = cat.id === activeCategory;
              return (
                <Link
                  key={cat.id}
                  href={cat.link}
                  className={`cat-strip-item ${isActive ? "active-tab" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                  title={cat.name}
                >
                  <div className="cat-icon-wrapper">
                    <IconComp size={24} className="cat-icon" />
                  </div>
                  <span className="cat-label">{cat.shortName}</span>
                  {isActive && <div className="active-underline" />}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer-box" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="al-umaima-pill-btn mini">
                <span className="logo-letter">a</span>
                <span className="pill-brand-text">al-umaima</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="mobile-drawer-body">
              <button className="mobile-search-trigger" onClick={() => { setIsMobileMenuOpen(false); openSearch(); }}>
                <Search size={16} /> Search products, brands...
              </button>

              <div className="mobile-links-section">
                <div className="mobile-section-title">Categories</div>
                <div className="mobile-cat-grid">
                  {categoriesList.map((c) => {
                    const Icon = c.icon;
                    return (
                      <Link 
                        key={c.id} 
                        href={c.link} 
                        className="mobile-cat-card"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon size={20} />
                        <span>{c.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Search Modal */}
      {isSearchOpen && <SearchBar onClose={closeSearch} />}

      {/* Location Picker Modal */}
      {isLocationModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsLocationModalOpen(false)}>
          <div className="location-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose your location</h3>
              <button onClick={() => setIsLocationModalOpen(false)} className="close-modal-btn"><X size={18} /></button>
            </div>
            <p className="modal-sub">Select a delivery location to see product availability and delivery options.</p>

            <form onSubmit={handleSetPincode} className="pincode-form">
              <input 
                type="text" 
                maxLength={6}
                placeholder="Enter 6-digit Pincode" 
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                className="pincode-input"
              />
              <button type="submit" className="pincode-submit-btn" disabled={!pincodeInput}>Check</button>
            </form>

            <div className="city-pills-title">Popular Cities</div>
            <div className="city-pills-grid">
              <button type="button" onClick={() => handleSelectCity("Bengaluru", "560001")} className="city-pill">Bengaluru</button>
              <button type="button" onClick={() => handleSelectCity("Mumbai", "400001")} className="city-pill">Mumbai</button>
              <button type="button" onClick={() => handleSelectCity("New Delhi", "110001")} className="city-pill">New Delhi</button>
              <button type="button" onClick={() => handleSelectCity("Hyderabad", "500001")} className="city-pill">Hyderabad</button>
              <button type="button" onClick={() => handleSelectCity("Chennai", "600001")} className="city-pill">Chennai</button>
              <button type="button" onClick={() => handleSelectCity("Kolkata", "700001")} className="city-pill">Kolkata</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}