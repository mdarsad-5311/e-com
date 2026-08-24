"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Check } from "lucide-react";
import { products, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import "@/styles/deal-of-the-day.css";

export default function DealOfTheDay() {
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 38,
    seconds: 12,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Pick the 3 specific deal products featured in the reference design
  const dealProducts = [
    products.find((p) => p.id === "prod-1") || products[0],
    products.find((p) => p.id === "prod-2") || products[1],
    products.find((p) => p.id === "prod-4") || products[3],
  ];

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const formatDigit = (num: number) => num.toString().padStart(2, "0");

  return (
    <section className="al-deal-section">
      <div className="header-container">
        {/* Header Row: Deal of the Day + Up to 50% OFF + Countdown */}
        <div className="al-deal-header">
          <div className="al-deal-title-wrap">
            <div className="al-deal-title-row">
              <h2 className="al-deal-heading">Deal of the Day</h2>
              <span className="al-deal-badge">Up to 50% OFF</span>
            </div>
            <p className="al-deal-subheading">
              Grab high-demand products before the countdown timer expires!
            </p>
          </div>

          {/* Countdown Clock (ENDS IN: 04 : 38 : 12) */}
          <div className="al-deal-countdown">
            <span className="ends-in-label">ENDS IN:</span>
            <div className="countdown-boxes">
              <div className="time-digit-box">{formatDigit(timeLeft.hours)}</div>
              <span className="time-colon">:</span>
              <div className="time-digit-box">{formatDigit(timeLeft.minutes)}</div>
              <span className="time-colon">:</span>
              <div className="time-digit-box highlight-sec">{formatDigit(timeLeft.seconds)}</div>
            </div>
          </div>
        </div>

        {/* 3-Column Deals Grid */}
        <div className="al-deal-grid">
          {dealProducts.map((product, idx) => {
            const discountPct = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 17;

            // Custom stock message matching reference
            let stockText = `Limited Stock • Only ${product.stock || 14} left`;
            let isSellingFast = false;
            if (idx === 2) {
              stockText = `Selling Fast • 22 left`;
              isSellingFast = true;
            }

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                className="al-deal-card"
              >
                {/* Discount Badge Top Left */}
                <div className="card-discount-tag">-{discountPct}% OFF</div>

                {/* Product Image */}
                <Link href={`/products/${product.id}`} className="deal-img-link">
                  <div className="deal-img-frame">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="deal-product-img" 
                    />
                  </div>
                </Link>

                {/* Card Content Details */}
                <div className="deal-card-body">
                  {/* Category & Rating */}
                  <div className="deal-meta-row">
                    <span className="deal-cat-name">{product.categoryName}</span>
                    <div className="deal-rating">
                      <Star size={12} fill="#F59E0B" color="#F59E0B" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  {/* Product Title */}
                  <Link href={`/products/${product.id}`}>
                    <h3 className="deal-item-title">{product.title}</h3>
                  </Link>

                  {/* Price Row */}
                  <div className="deal-price-row">
                    <span className="deal-current-price">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="deal-original-price">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Stock Bar */}
                  <div className="deal-stock-bar">
                    <div className={`stock-progress-track ${isSellingFast ? "amber-track" : ""}`}>
                      <div 
                        className={`stock-progress-fill ${isSellingFast ? "amber-fill" : "red-fill"}`}
                        style={{ width: `${isSellingFast ? 65 : 40}%` }}
                      />
                    </div>
                    <span className={`stock-note ${isSellingFast ? "amber-note" : ""}`}>
                      {stockText}
                    </span>
                  </div>

                  {/* Full Width Orange CTA Button */}
                  <button
                    className={`deal-claim-btn ${addedIds[product.id] ? "claimed" : ""}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    {addedIds[product.id] ? (
                      <>
                        <Check size={16} /> Claimed!
                      </>
                    ) : (
                      "Claim Deal"
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
