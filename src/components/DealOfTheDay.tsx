"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, Check, Flame, Star } from "lucide-react";
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

  const dealProducts = products.filter((p) => p.originalPrice).slice(0, 4);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const formatDigit = (num: number) => num.toString().padStart(2, "0");

  return (
    <section className="section flash-sale-section">
      <div className="container">
        {/* Flash Sale Header Banner with Orange Theme */}
        <div className="flash-header-banner">
          <div className="flash-header-left">
            <div className="flash-badge-pill">
              <Flame size={16} className="flame-icon animate-pulse-glow" />
              <span>LIGHTNING DEALS</span>
            </div>
            <h2 className="flash-title">Deal of the Day — Up to 50% OFF</h2>
            <p className="flash-subtitle">Grab high-demand products before the countdown timer expires!</p>
          </div>

          {/* Countdown Clock Component */}
          <div className="timer-wrapper">
            <div className="timer-label">
              <Clock size={16} /> Offers expire in:
            </div>
            <div className="digits-group">
              <div className="digit-box">
                <span className="num-val">{formatDigit(timeLeft.hours)}</span>
                <span className="lbl-val">HRS</span>
              </div>
              <span className="colon-sep">:</span>
              <div className="digit-box">
                <span className="num-val">{formatDigit(timeLeft.minutes)}</span>
                <span className="lbl-val">MIN</span>
              </div>
              <span className="colon-sep">:</span>
              <div className="digit-box pulse-second">
                <span className="num-val">{formatDigit(timeLeft.seconds)}</span>
                <span className="lbl-val">SEC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Flash Sale Product Grid */}
        <div className="flash-grid">
          {dealProducts.map((product, idx) => {
            const discountPct = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="flash-card-item"
              >
                <div className="discount-tag-badge">-{discountPct}% OFF</div>

                <div className="flash-img-wrapper">
                  <img src={product.image} alt={product.title} className="flash-img" />
                </div>

                <div className="flash-card-info">
                  <div className="flash-category-row">
                    <span className="flash-cat-name">{product.categoryName}</span>
                    <span className="rating-tag">
                      <Star size={11} fill="#FFFFFF" color="#FFFFFF" /> {product.rating}
                    </span>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="flash-item-title">{product.title}</h3>
                  </Link>

                  <div className="flash-price-row">
                    <span className="flash-price">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="flash-original">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Stock Bar */}
                  <div className="stock-meter">
                    <div className="stock-meter-label">
                      <span>Limited Stock</span>
                      <span className="stock-highlight">Only {product.stock || 4} left</span>
                    </div>
                    <div className="stock-meter-track">
                      <div className="stock-meter-fill" style={{ width: `${Math.min(100, (product.stock || 4) * 15)}%` }} />
                    </div>
                  </div>

                  <button
                    className={`btn btn-secondary flash-claim-btn ${addedIds[product.id] ? "claimed" : ""}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    {addedIds[product.id] ? (
                      <>
                        <Check size={16} /> Claimed & Added
                      </>
                    ) : (
                      <>
                        <Zap size={16} /> Claim Deal
                      </>
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
