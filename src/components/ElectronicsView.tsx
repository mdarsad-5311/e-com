"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Check, ShieldCheck } from "lucide-react";
import { Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import "@/styles/electronics-page.css";

interface ElectronicsViewProps {
  products: Product[];
}

const CATEGORY_TABS = [
  "All Audio",
  "Headphones",
  "Earbuds",
  "Speakers",
  "Smartwatch",
  "Keyboards",
];

export default function ElectronicsView({ products }: ElectronicsViewProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("All Audio");
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleWishlistClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    showToast(`${product.title} added to cart!`);
    setTimeout(() => setAddedId(null), 1500);
  };

  // Trending electronics products - Attachment 1 exact showcase
  const defaultElectronics: Product[] = useMemo(() => [
    {
      id: "nexus-chrono-series-5",
      title: "Nexus Chrono Series 5",
      slug: "nexus-chrono-series-5",
      category: "electronics",
      categoryName: "Electronics",
      subCategory: "Smartwatch",
      price: 299.00,
      originalPrice: 349.00,
      rating: 4.9,
      reviewsCount: 142,
      isFeatured: true,
      isBestSeller: true,
      isAssured: true,
      stock: 28,
      brand: "Nexus",
      colors: ["Space Black", "Silver Mesh"],
      soldCount: 280,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      description: "Precision engineered smartwatch with ECG telemetry and always-on AMOLED retina display.",
      specifications: ["Retina AMOLED", "ECG Sensor", "7 Days Battery"],
      reviews: []
    },
    {
      id: "typemaster-pro-mechanical",
      title: "TypeMaster Pro Mechanical",
      slug: "typemaster-pro-mechanical",
      category: "electronics",
      categoryName: "Electronics",
      subCategory: "Keyboard",
      price: 149.99,
      originalPrice: 179.99,
      rating: 4.8,
      reviewsCount: 96,
      isFeatured: true,
      isBestSeller: false,
      isAssured: false,
      stock: 35,
      brand: "TypeMaster",
      colors: ["Navy / Cream"],
      soldCount: 190,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      description: "Hot-swappable custom mechanical keyboard with Gateron Pro switches and wireless Bluetooth 5.2.",
      specifications: ["Gasket Mount", "Wireless 2.4GHz + BT", "RGB Backlight"],
      reviews: []
    },
    {
      id: "acoustic-cylinder-home-hub",
      title: "Acoustic Cylinder Home Hub",
      slug: "acoustic-cylinder-home-hub",
      category: "electronics",
      categoryName: "Electronics",
      subCategory: "Speaker",
      price: 189.00,
      originalPrice: 219.00,
      rating: 4.9,
      reviewsCount: 110,
      badge: "HOT",
      isFeatured: true,
      isBestSeller: true,
      isAssured: true,
      stock: 20,
      brand: "Aura",
      colors: ["Charcoal Heather"],
      soldCount: 220,
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
      description: "360-degree spatial sound smart speaker with built-in voice assistant.",
      specifications: ["360° Omnidirectional", "High-Excursion Woofer", "Matter Hub"],
      reviews: []
    },
    {
      id: "aura-pods-essential",
      title: "Aura Pods Essential",
      slug: "aura-pods-essential",
      category: "electronics",
      categoryName: "Electronics",
      subCategory: "Earbuds",
      price: 129.00,
      originalPrice: 159.00,
      rating: 4.7,
      reviewsCount: 235,
      badge: "BESTSELLER",
      isFeatured: true,
      isBestSeller: true,
      isAssured: false,
      stock: 50,
      brand: "Aura",
      colors: ["Midnight Black"],
      soldCount: 450,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      description: "True wireless active noise-canceling earbuds with transparency mode and Qi wireless charging.",
      specifications: ["Active Noise Cancellation", "32h Total Battery", "IPX5 Sweatproof"],
      reviews: []
    }
  ], []);

  const displayList = useMemo(() => {
    // If specific tab selected
    if (activeTab === "Headphones") {
      return products.filter(p => p.subCategory?.toLowerCase().includes("headphone") || p.title.toLowerCase().includes("headphone"));
    }
    if (activeTab === "Earbuds") {
      return products.filter(p => p.subCategory?.toLowerCase().includes("earbud") || p.title.toLowerCase().includes("pods") || p.title.toLowerCase().includes("earbuds"));
    }
    if (activeTab === "Speakers") {
      return products.filter(p => p.subCategory?.toLowerCase().includes("speaker") || p.title.toLowerCase().includes("speaker") || p.title.toLowerCase().includes("cylinder"));
    }
    if (activeTab === "Smartwatch") {
      return products.filter(p => p.subCategory?.toLowerCase().includes("wearable") || p.subCategory?.toLowerCase().includes("smartwatch") || p.title.toLowerCase().includes("watch"));
    }
    if (activeTab === "Keyboards") {
      return products.filter(p => p.subCategory?.toLowerCase().includes("keyboard") || p.title.toLowerCase().includes("keyboard"));
    }

    // Default "All Audio" or initial: show default curated 4 from Attachment 1, followed by other electronics
    const combined = [...defaultElectronics];
    products.forEach(p => {
      if (!combined.some(existing => existing.id === p.id)) {
        combined.push(p);
      }
    });
    return combined;
  }, [activeTab, defaultElectronics, products]);

  return (
    <div className="al-electronics-page-wrapper">
      {/* 1. HERO BANNER */}
      <section className="al-electronics-hero">
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
          alt="Aura Pro Max ANC Headphones"
          className="al-electronics-hero-bg-img"
        />
        <div className="al-electronics-hero-overlay" />
        <div className="container">
          <div className="al-electronics-hero-content">
            <span className="al-electronics-hero-tag">NEW ARRIVAL</span>
            <h1 className="al-electronics-hero-title">Aura Pro Max</h1>
            <p className="al-electronics-hero-desc">
              Experience studio-quality sound with our most advanced noise-canceling technology yet.
            </p>
            <div className="al-electronics-hero-actions">
              <Link href="/products/aura-pro-headphones" className="al-btn-hero-shop">
                Shop Now
              </Link>
              <Link href="/products/aura-pro-headphones" className="al-btn-hero-details">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILL TABS */}
      <nav className="al-electronics-tabs-bar" aria-label="Electronics categories">
        <div className="container">
          <div className="al-electronics-tabs-scroll">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`al-electronics-tab-pill ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. TRENDING IN ELECTRONICS */}
      <section className="al-electronics-products-section">
        <div className="container">
          <h2 className="al-electronics-section-heading">Trending in Electronics</h2>

          <div className="al-electronics-grid-2col">
            {displayList.map((product) => {
              const isWish = isInWishlist(product.id);
              const isItemAdded = addedId === product.id;

              return (
                <div key={product.id} className="al-elec-card">
                  {/* Card Image Wrap */}
                  <div className="al-elec-card-img-wrap">
                    <Link href={`/products/${product.slug || product.id}`} style={{ display: "contents" }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="al-elec-card-img"
                      />
                    </Link>

                    {/* Assured Badge */}
                    {product.isAssured && (
                      <div className="al-elec-assured-pill">
                        <ShieldCheck size={11} />
                        <span>Assured</span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      className={`al-elec-wish-btn ${isWish ? "active" : ""}`}
                      onClick={(e) => handleWishlistClick(e, product)}
                      aria-label="Toggle wishlist"
                    >
                      <Heart size={15} fill={isWish ? "#e11d48" : "none"} color={isWish ? "#e11d48" : "#64748b"} />
                    </button>
                  </div>

                  {/* Card Info */}
                  <div className="al-elec-card-info">
                    <span className="al-elec-card-subcat">{product.subCategory || "Electronics"}</span>
                    <Link
                      href={`/products/${product.slug || product.id}`}
                      className="al-elec-card-title"
                    >
                      {product.title}
                    </Link>
                    <div className="al-elec-card-bottom">
                      <span className="al-elec-card-price">${product.price.toFixed(2)}</span>
                      <button
                        type="button"
                        className={`al-elec-card-cart-btn ${isItemAdded ? "added" : ""}`}
                        onClick={(e) => handleAddToCart(e, product)}
                        aria-label={`Add ${product.title} to cart`}
                        title="Add to cart"
                      >
                        {isItemAdded ? <Check size={15} /> : <ShoppingCart size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
