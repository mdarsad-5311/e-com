"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ShieldCheck, ShoppingCart, Check } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import "@/styles/deal-of-the-day.css";

export default function DealOfTheDay() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 15,
    seconds: 32,
  });
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

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

  const formatDigit = (num: number) => num.toString().padStart(2, "0");

  const dealProduct = products.find((p) => p.id === "aura-pro-headphones") || products[0];

  const handleAddToCart = () => {
    addToCart(
      {
        ...dealProduct,
        id: "aurasync-pro-deal",
        title: "AuraSync Pro Wireless Headphones",
        price: 249.00,
        originalPrice: 349.00,
      },
      1
    );
    setIsAdded(true);
    showToast("AuraSync Pro Wireless Headphones added to cart!");
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <section className="al-deal-section">
      <div className="header-container">
        {/* Deal Section Header */}
        <div className="al-deal-header">
          <div className="al-deal-title-col">
            <h2 className="al-deal-title">Deal of the Day</h2>
            <p className="al-deal-subtitle">Premium audio at an unbeatable price.</p>
          </div>

          <div className="al-deal-countdown-badge">
            <Clock size={16} className="al-clock-icon" />
            <span>{formatDigit(timeLeft.hours)}:{formatDigit(timeLeft.minutes)}:{formatDigit(timeLeft.seconds)} left</span>
          </div>
        </div>

        {/* Featured Deal Card */}
        <div className="al-deal-feature-card">
          {/* Left Media Panel */}
          <div className="al-deal-media-panel">
            <span className="al-deal-discount-tag">-30% OFF</span>
            <div className="al-deal-image-wrap">
              <Image
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
                alt="AuraSync Pro Wireless Headphones"
                width={540}
                height={380}
                className="al-deal-product-image"
              />
            </div>
            <div className="al-deal-image-caption">
              <span className="al-caption-brand">AL-UMAIMA | PREMIUM AUDIO</span>
              <span className="al-caption-model">AURA P1 Wireless Headphones</span>
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="al-deal-content-panel">
            {/* Assured Badge */}
            <div className="al-deal-assured">
              <ShieldCheck size={16} className="al-deal-assured-icon" />
              <span>Al-Umaima Assured</span>
            </div>

            {/* Product Title */}
            <h3 className="al-deal-item-title">AuraSync Pro Wireless Headphones</h3>

            {/* Product Description */}
            <p className="al-deal-item-desc">
              Active noise cancellation, 40-hour battery life, and studio-grade sound in a sleek, ergonomic titanium frame.
            </p>

            {/* Pricing */}
            <div className="al-deal-pricing-row">
              <span className="al-deal-current-price">$249.00</span>
              <span className="al-deal-original-price">$349.00</span>
            </div>

            {/* Add to Cart Action */}
            <button
              type="button"
              className={`al-deal-cart-btn ${isAdded ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {isAdded ? (
                <>
                  <Check size={18} />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
