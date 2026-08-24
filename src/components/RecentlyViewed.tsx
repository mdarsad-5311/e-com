"use client";

import ProductCard from "./ProductCard";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import "@/styles/recently-viewed.css";

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const { recent } = useRecentlyViewed();
  const items = recent.filter((p) => p.id !== excludeId).slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Recently viewed</h2>
            <p className="section-subtitle">Pick up where you left off</p>
          </div>
        </div>
        <div className="recent-grid">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
