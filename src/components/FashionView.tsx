"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Heart, 
  ShieldCheck, 
  Star,
  Plus
} from "lucide-react";
import { Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import "@/styles/fashion-page.css";

interface FashionViewProps {
  products: Product[];
}

const CATEGORY_TABS = ["All", "Jackets", "Knitwear", "Accessories", "Footwear", "Bags"];

export default function FashionView({ products }: FashionViewProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("All");

  const handleWishlistClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Curated Fashion Products from Attachment
  const latestArrivalsData: Product[] = useMemo(() => {
    const defaultFashionProducts: Product[] = [
      {
        id: "technical-shell-jacket",
        title: "Technical Shell Jacket",
        slug: "technical-shell-jacket",
        category: "fashion",
        categoryName: "Fashion",
        subCategory: "Outerwear",
        price: 189.00,
        rating: 4.9,
        reviewsCount: 92,
        isFeatured: true,
        isBestSeller: true,
        isAssured: true,
        stock: 18,
        brand: "Al-Umaima TechLab",
        colors: ["#1B2A4A", "#5C5A42"],
        soldCount: 215,
        image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
        description: "3-layer weatherproof technical shell jacket.",
        specifications: ["Waterproof", "Windproof"],
        reviews: []
      },
      {
        id: "structured-crossbody",
        title: "Structured Crossbody Bag",
        slug: "structured-crossbody",
        category: "fashion",
        categoryName: "Fashion",
        subCategory: "Accessories",
        price: 145.00,
        rating: 4.8,
        reviewsCount: 78,
        isFeatured: true,
        isBestSeller: false,
        isAssured: true,
        stock: 35,
        brand: "Al-Umaima Atelier",
        colors: ["#C28854"],
        soldCount: 420,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
        description: "Vegetable-tanned structured leather crossbody bag.",
        specifications: ["Italian Leather", "Nickel Clasp"],
        reviews: []
      },
      {
        id: "oversized-cashmere-turtleneck",
        title: "Oversized Cashmere Turtleneck",
        slug: "oversized-cashmere-turtleneck",
        category: "fashion",
        categoryName: "Fashion",
        subCategory: "Knitwear",
        price: 210.00,
        rating: 4.5,
        reviewsCount: 42,
        isFeatured: true,
        isBestSeller: true,
        isAssured: false,
        stock: 14,
        brand: "Al-Umaima Atelier",
        colors: ["#8E9297"],
        soldCount: 180,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
        description: "Pure Mongolian cashmere ribbed turtleneck.",
        specifications: ["100% Cashmere", "7-Gauge Rib"],
        reviews: []
      },
      {
        id: "lug-sole-leather-boots",
        title: "Lug-Sole Leather Boots",
        slug: "lug-sole-leather-boots",
        category: "fashion",
        categoryName: "Fashion",
        subCategory: "Footwear",
        price: 195.00,
        rating: 4.9,
        reviewsCount: 88,
        isFeatured: true,
        isBestSeller: true,
        isAssured: true,
        stock: 22,
        brand: "Al-Umaima Atelier",
        colors: ["#1E1E1E"],
        soldCount: 310,
        image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
        description: "Rugged oiled calfskin boot with Vibram lug sole.",
        specifications: ["Goodyear Welt", "Vibram Commando Sole"],
        reviews: []
      }
    ];

    const foundFashion = products.filter(p => p.category === "fashion");
    if (foundFashion.length >= 4) return foundFashion;
    return defaultFashionProducts;
  }, [products]);

  // Featured product (the cashmere turtleneck — used in the horizontal featured card)
  const featuredProduct = latestArrivalsData.find(p => p.subCategory === "Knitwear") || latestArrivalsData[2];

  // Grid products (first 2 for the 2-col grid)
  const gridProducts = useMemo(() => {
    const filtered = activeTab === "All"
      ? latestArrivalsData
      : latestArrivalsData.filter(p => p.subCategory === activeTab);
    return filtered.slice(0, 2);
  }, [latestArrivalsData, activeTab]);

  return (
    <div className="al-fashion-page-wrapper">
      {/* 1. HERO BANNER — Full-width mobile-first */}
      <section className="al-fashion-hero al-fashion-hero--mobile">
        <img
          src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80"
          alt="Leather Jacket Fashion"
          className="al-fashion-hero-bg-img"
        />
        <div className="al-fashion-hero-overlay" />
        <div className="al-fashion-hero-mobile-content">
          <span className="al-fashion-hero-tag">NEW SEASON</span>
          <h1 className="al-fashion-hero-title">
            The Icon<br />Redefined
          </h1>
          <p className="al-fashion-hero-desc">
            Elevate your everyday with premium materials and precision tailoring.
          </p>
          <a href="#latest-arrivals" className="al-btn-hero-collection">
            Shop The Collection <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* 2. CATEGORY FILTER TABS — Scrollable horizontal pills */}
      <nav className="al-fashion-cat-tabs" aria-label="Category filter">
        <div className="al-fashion-cat-tabs-inner">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab}
              type="button"
              className={`al-fashion-cat-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* 3. LATEST ARRIVALS — 2-column grid */}
      <section id="latest-arrivals" className="al-latest-arrivals-section">
        <div className="header-container">
          <div className="al-section-header-row">
            <h2 className="al-fashion-section-heading">Latest Arrivals</h2>
            <Link href="/products?category=fashion" className="al-view-all-fashion-link">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 2-Column Product Grid */}
          <div className="al-fashion-products-grid-2col">
            {gridProducts.map((product) => {
              const isWish = isInWishlist(product.id);
              return (
                <div key={product.id} className="al-fashion-product-card">
                  <div className="al-product-card-img-wrap">
                    <Link href={`/products/${product.slug || product.id}`}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="al-product-card-img"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleWishlistClick(e, product)}
                      className={`al-card-wishlist-btn ${isWish ? "active" : ""}`}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={15} fill={isWish ? "#e11d48" : "none"} />
                    </button>
                  </div>
                  <div className="al-product-card-info">
                    <span className="al-fashion-card-subcategory">{product.subCategory}</span>
                    <Link
                      href={`/products/${product.slug || product.id}`}
                      className="al-fashion-card-title"
                    >
                      {product.title}
                    </Link>
                    <div className="al-fashion-card-bottom-row">
                      <span className="al-fashion-card-price">${product.price.toFixed(2)}</span>
                      <span className="al-fashion-card-assured-icon" title="Al-Umaima Assured">
                        <ShieldCheck size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Featured Product Card — horizontal layout */}
          {featuredProduct && (
            <div className="al-fashion-featured-card">
              <div className="al-fashion-featured-img-wrap">
                <Link href={`/products/${featuredProduct.slug || featuredProduct.id}`}>
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.title}
                    className="al-fashion-featured-img"
                  />
                </Link>
                <button
                  type="button"
                  onClick={(e) => handleWishlistClick(e, featuredProduct)}
                  className={`al-card-wishlist-btn ${isInWishlist(featuredProduct.id) ? "active" : ""}`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={15} fill={isInWishlist(featuredProduct.id) ? "#e11d48" : "none"} />
                </button>
              </div>
              <div className="al-fashion-featured-info">
                <span className="al-fashion-card-subcategory">{featuredProduct.subCategory}</span>
                <Link
                  href={`/products/${featuredProduct.slug || featuredProduct.id}`}
                  className="al-fashion-featured-title"
                >
                  {featuredProduct.title}
                </Link>
                {/* Star Rating */}
                <div className="al-fashion-featured-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={13}
                      fill={star <= Math.round(featuredProduct.rating) ? "#FF7A00" : "none"}
                      color={star <= Math.round(featuredProduct.rating) ? "#FF7A00" : "#cbd5e1"}
                    />
                  ))}
                  <span className="al-fashion-featured-reviews">({featuredProduct.reviewsCount})</span>
                </div>
                <div className="al-fashion-featured-bottom">
                  <span className="al-fashion-featured-price">${featuredProduct.price.toFixed(2)}</span>
                  <button
                    type="button"
                    className="al-fashion-add-btn"
                    onClick={(e) => handleAddToCart(e, featuredProduct)}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. CURATED COLLECTIONS (Desktop Bento Grid) */}
      <section id="curated-collections" className="al-curated-collections-section al-desktop-only">
        <div className="header-container">
          <div className="al-section-header-row">
            <h2 className="al-fashion-section-heading">Curated Collections</h2>
            <Link href="/products?category=fashion" className="al-view-all-fashion-link">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="al-bento-grid">
            <Link href="/products?category=fashion" className="al-bento-left-card">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
                alt="Urban Utility Fashion Store"
                className="al-bento-bg-img"
              />
              <div className="al-bento-gradient-overlay" />
              <div className="al-bento-left-content">
                <span className="al-bento-trending-pill">Trending</span>
                <h3 className="al-bento-main-title">Urban Utility</h3>
                <button type="button" className="al-bento-shop-btn">Shop Collection</button>
              </div>
            </Link>
            <div className="al-bento-right-col">
              <Link href="/products?q=minimalist" className="al-bento-mini-card">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
                  alt="Minimalist Classics"
                  className="al-bento-bg-img"
                />
                <div className="al-bento-gradient-overlay" />
                <div className="al-bento-mini-content">
                  <h3 className="al-bento-mini-title">Minimalist Classics</h3>
                  <span className="al-bento-mini-subtitle">Explore</span>
                </div>
              </Link>
              <Link href="/products/oversized-cashmere-turtleneck" className="al-bento-mini-card">
                <img
                  src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
                  alt="Eco-Knitwear"
                  className="al-bento-bg-img"
                />
                <div className="al-bento-gradient-overlay" />
                <div className="al-bento-mini-content">
                  <h3 className="al-bento-mini-title">Eco-Knitwear</h3>
                  <span className="al-bento-mini-subtitle">Explore</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AL-UMAIMA ASSURED STRIP */}
      <div className="al-fashion-assured-strip">
        <ShieldCheck size={18} className="al-fashion-assured-icon" />
        <span className="al-fashion-assured-text">Al-Umaima Assured</span>
        <span className="al-fashion-assured-sub">Quality guaranteed on every order</span>
      </div>
    </div>
  );
}
