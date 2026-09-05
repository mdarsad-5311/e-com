"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { products as fallbackProducts, Product } from "@/data/products";
import { getTrendingProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import "@/styles/trending-now.css";

const CATEGORY_PILLS = [
  "All Items",
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Offers",
];

export default function TrendingNow() {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [trendingProducts, setTrendingProducts] = useState<Product[]>(() => {
    return [...fallbackProducts].sort((a, b) => b.rating - a.rating).slice(0, 8);
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchTrending() {
      try {
        const items = await getTrendingProducts(activeCategory);
        if (isMounted && items.length > 0) {
          setTrendingProducts(items);
        }
      } catch (err) {
        console.error("Failed to load trending items from Django API:", err);
      }
    }
    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  return (
    <section className="al-trending-now-section">
      <div className="header-container">
        {/* Category Pills Bar */}
        <div className="al-trending-pills-bar">
          {CATEGORY_PILLS.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`al-trending-pill-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Header Row */}
        <div className="al-trending-header-row">
          <h2 className="al-trending-heading">Trending Now</h2>
          <Link href="/products" className="al-trending-view-all">
            View All <ChevronRight size={15} />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="al-trending-grid">
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
