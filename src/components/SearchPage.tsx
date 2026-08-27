"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  X, 
  Mic, 
  Clock, 
  ArrowUpRight, 
  ShoppingCart,
  TrendingUp
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import "@/styles/search-page.css";

const CATEGORY_PILLS = ["All", "Electronics", "Fashion", "Home", "Kitchen", "Books"];

const RECENT_SEARCHES = [
  "wireless headphones noise cancelling",
  "smart watch series 9",
  "men's running shoes",
];

const SUGGESTED_PRODUCTS = [
  {
    id: "smartphone-pro-max",
    name: "Smartphone Pro Max 256GB",
    category: "Electronics > Mobile",
    price: 1099.00,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80",
    href: "/products/smartphone-pro-max",
  },
  {
    id: "smart-home-security-camera",
    name: "Smart Home Security Camera",
    category: "Home > Security",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=80",
    href: "/products/smart-home-security-camera",
  },
];

const TRENDING_CATEGORIES = ["Laptops", "Skincare", "Activewear", "Headphones", "Cookware"];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart } = useCart();

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    router.push(`/products?q=${encodeURIComponent(term)}`);
  };

  const handleAddToCart = (productId: string) => {
    // find in products array or just show toast
    const found = SUGGESTED_PRODUCTS.find(p => p.id === productId);
    if (found) {
      // Create a minimal product object
      addToCart({
        id: found.id,
        title: found.name,
        price: found.price,
        image: found.image,
        slug: found.id,
        category: "electronics",
        categoryName: "Electronics",
        rating: 4.5,
        reviewsCount: 50,
        isFeatured: false,
        isBestSeller: false,
        isAssured: false,
        stock: 10,
        brand: "Al-Umaima",
        soldCount: 100,
        description: "",
        specifications: [],
        reviews: [],
      });

    }
  };

  const handleClearRecents = () => {
    // Could be hooked to localStorage; for now just UI feedback
  };

  return (
    <div className="al-search-page-wrapper">
      {/* Top Search Bar */}
      <div className="al-search-page-top-bar">
        <button
          type="button"
          className="al-search-page-back-btn"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>

        <form className="al-search-page-input-wrap" onSubmit={handleSearch}>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Al-Umaima..."
            className="al-search-page-input"
            aria-label="Search products"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="al-search-clear-btn"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            className="al-search-mic-btn"
            aria-label="Voice search"
          >
            <Mic size={17} />
          </button>
        </form>
      </div>

      {/* Category Filter Pills */}
      <nav className="al-search-cat-pills" aria-label="Search categories">
        {CATEGORY_PILLS.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`al-search-cat-pill ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Page Body */}
      <div className="al-search-page-body">
        {/* Recent Searches */}
        <div>
          <div className="al-search-section-header">
            <h2 className="al-search-section-title">Recent Searches</h2>
            <button
              type="button"
              className="al-search-section-action"
              onClick={handleClearRecents}
            >
              CLEAR
            </button>
          </div>
          <div className="al-recent-searches-list">
            {RECENT_SEARCHES.map((term) => (
              <div
                key={term}
                className="al-recent-search-row"
                role="button"
                tabIndex={0}
                onClick={() => handleRecentClick(term)}
                onKeyDown={(e) => e.key === "Enter" && handleRecentClick(term)}
              >
                <Clock size={16} className="al-recent-search-icon" />
                <span className="al-recent-search-text">{term}</span>
                <ArrowUpRight size={16} className="al-recent-search-arrow" />
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Products */}
        <div>
          <div className="al-search-section-header">
            <h2 className="al-search-section-title">Suggested Products</h2>
          </div>
          <div className="al-suggested-products-list">
            {SUGGESTED_PRODUCTS.map((product) => (
              <div key={product.id} className="al-suggested-product-row">
                <Link href={product.href} style={{ display: "contents" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="al-suggested-product-img"
                  />
                  <div className="al-suggested-product-info">
                    <span className="al-suggested-product-name">{product.name}</span>
                    <span className="al-suggested-product-cat">{product.category}</span>
                    <span className="al-suggested-product-price">${product.price.toFixed(2)}</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="al-suggested-cart-btn"
                  onClick={() => handleAddToCart(product.id)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Categories */}
        <div>
          <div className="al-search-section-header">
            <h2 className="al-search-section-title">Trending Categories</h2>
          </div>
          <div className="al-trending-cats-row">
            {TRENDING_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/products?q=${encodeURIComponent(cat)}`}
                className="al-trending-cat-tag"
              >
                <TrendingUp size={13} className="al-trending-icon" />
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
