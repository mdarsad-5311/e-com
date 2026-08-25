"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { products, Product } from "@/data/products";
import "@/styles/deal-of-the-day.css";

export default function DealOfTheDay() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 45,
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

  // Pick the 3 deal products matching reference
  const dealProducts = products.filter((p) => p.isDealOfTheDay || p.id.startsWith("deal"));

  const formatDigit = (num: number) => num.toString().padStart(2, "0");

  return (
    <section className="al-deal-section">
      <div className="header-container">
        {/* Deal Header Row */}
        <div className="al-deal-header-box">
          <div className="al-deal-title-row">
            <h2 className="al-deal-heading">Deal of the Day</h2>
            <Flame size={20} className="deal-flame-icon" />
          </div>

          <div className="al-deal-timer-view-row">
            <div className="al-deal-countdown">
              <span className="ends-in-label">Ends in:</span>
              <div className="countdown-boxes">
                <div className="time-digit-box">{formatDigit(timeLeft.hours)}</div>
                <span className="time-colon">:</span>
                <div className="time-digit-box">{formatDigit(timeLeft.minutes)}</div>
                <span className="time-colon">:</span>
                <div className="time-digit-box">{formatDigit(timeLeft.seconds)}</div>
              </div>
            </div>

            <Link href="/products?featured=true" className="deal-view-all-link">
              View All
            </Link>
          </div>
        </div>

        {/* Horizontal Deals Scroll Strip */}
        <div className="al-deal-scroll-wrap">
          <div className="al-deal-grid">
            {dealProducts.map((product: Product) => {
              const discountPct = product.discountPercentage || (product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 20);

              return (
                <div key={product.id} className="al-deal-card">
                  {/* Discount Tag Top Left */}
                  <div className="card-discount-tag">-{discountPct}%</div>

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

                  {/* Card Body */}
                  <div className="deal-card-body">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="deal-item-title">{product.title}</h3>
                    </Link>

                    <div className="deal-price-row">
                      <span className="deal-current-price">AED {product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="deal-original-price">AED {product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
