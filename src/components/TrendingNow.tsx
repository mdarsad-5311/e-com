"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { products as allProducts, Product } from "@/data/products";
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

  const trendingProducts: Product[] = useMemo(() => {
    let filtered = allProducts;
    if (activeCategory === "Electronics") {
      filtered = allProducts.filter((p) => p.category === "electronics");
    } else if (activeCategory === "Fashion") {
      filtered = allProducts.filter((p) => p.category === "fashion");
    } else if (activeCategory === "Home") {
      filtered = allProducts.filter((p) => p.category === "home-goods" || p.category === "home-living");
    } else if (activeCategory === "Beauty") {
      filtered = allProducts.filter((p) => p.category === "beauty" || p.category === "accessories");
    } else if (activeCategory === "Offers") {
      filtered = allProducts.filter((p) => (p.discountPercentage && p.discountPercentage > 0) || p.badge === "SALE" || p.isFeatured);
    }
    
    // Sort by rating / best seller and take top items
    const sorted = [...filtered].sort((a, b) => b.rating - a.rating);
    return sorted.slice(0, 8);
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
