"use client";

import { useRef } from "react";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { products as fallbackProducts, Product } from "@/data/products";
import { getBestSellers } from "@/lib/products";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "@/styles/best-sellers.css";

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState<Product[]>(
    () => fallbackProducts.filter((p: Product) => p.isBestSeller)
  );

  useEffect(() => {
    let isMounted = true;
    async function loadBestSellers() {
      try {
        const items = await getBestSellers();
        if (isMounted && items.length > 0) {
          setBestSellers(items);
        }
      } catch (err) {
        console.error("Failed to load best sellers from Django API:", err);
      }
    }
    loadBestSellers();
    return () => {
      isMounted = false;
    };
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="section bestsellers-dark-section">
      <div className="container">
        <div className="bestsellers-dark-card">
          <div className="bestseller-header">
            <div>
              <div className="dark-badge">
                <Flame size={14} className="flame-spark" />
                <span>2026 TOP SELLERS</span>
              </div>
              <h2 className="dark-title">Best Sellers Spotlight</h2>
              <p className="dark-subtitle">
                Highlighting our top-rated tech gadgets, apparel, and lifestyle gear.
              </p>
            </div>

            {/* Slider Navigation Controls */}
            <div className="slider-controls">
              <button 
                onClick={() => handleScroll("left")} 
                className="slider-btn"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => handleScroll("right")} 
                className="slider-btn"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Horizontal Carousel Slider */}
          <div className="carousel-track no-scrollbar" ref={scrollRef}>
            {bestSellers.map((product) => (
              <div key={product.id} className="carousel-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
