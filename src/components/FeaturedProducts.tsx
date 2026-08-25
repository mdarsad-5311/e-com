"use client";

import { products, Product } from "@/data/products";
import ProductCard from "./ProductCard";
import "@/styles/featured-products.css";

export default function FeaturedProducts() {
  const featuredList = products.filter((p: Product) => p.isFeatured || p.id.startsWith("feat"));

  return (
    <section className="al-featured-section">
      <div className="header-container">
        {/* Section Title */}
        <div className="al-featured-header">
          <h2 className="al-featured-title">Featured for You</h2>
        </div>

        {/* 2-Column Mobile Grid of Product Cards */}
        <div className="al-products-grid">
          {featuredList.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
