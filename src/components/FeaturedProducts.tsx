"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { products, Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/featured-products.css";

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const featuredList = products.filter((p: Product) => p.isFeatured);

  const filteredProducts = activeTab === "all"
    ? featuredList
    : featuredList.filter((p: Product) => p.category === activeTab);

  return (
    <section className="section featured-section">
      <div className="container">
        <div className="section-header featured-header">
          <div>
            <div className="badge-curated">
              <Sparkles size={13} /> CURATED SELECTION
            </div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Trending gadgets and style staples engineered for everyday excellence.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {[
              { id: "all", label: "All Featured" },
              { id: "electronics", label: "Electronics" },
              { id: "fashion", label: "Fashion" },
              { id: "home-living", label: "Home" },
              { id: "accessories", label: "Accessories" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Grid of Product Cards */}
        <div className="products-grid-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product: Product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="featured-footer">
          <Link href="/products" className="btn btn-secondary">
            <span>Explore Entire Catalog</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
