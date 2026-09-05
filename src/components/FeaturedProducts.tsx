"use client";

import { useEffect, useState } from "react";
import { products as fallbackProducts, Product } from "@/data/products";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "./ProductCard";
import "@/styles/featured-products.css";

export default function FeaturedProducts() {
  const [featuredList, setFeaturedList] = useState<Product[]>(
    () => fallbackProducts.filter((p: Product) => p.isFeatured || p.id.startsWith("feat"))
  );

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        const items = await getFeaturedProducts();
        if (isMounted && items.length > 0) {
          setFeaturedList(items);
        }
      } catch (err) {
        console.error("Failed to load featured products from Django API:", err);
      }
    }
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

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
