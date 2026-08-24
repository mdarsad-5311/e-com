"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Sparkles, ShoppingBag, Award, Star } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/hero-banner.css";

export default function HeroBanner() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-card-1400">
          <div className="hero-grid-2">
            {/* Left Content Column */}
            <motion.div 
              className="hero-text-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="offer-tag-badge">
                <Sparkles size={14} /> <span>EXCLUSIVE AL-UMAIMA EXPRESS DEALS</span>
              </div>

              <h1 className="hero-main-title">
                Upgrade Your Life with <span className="blue-gradient-text">Premium Tech</span> & Fashion
              </h1>

              <p className="hero-description-text">
                Discover ANC headphones, smartwatch gadgets, minimalist jackets, and smart home lighting engineered for peak daily performance.
              </p>

              {/* CTA Buttons */}
              <div className="hero-cta-buttons">
                <Link href="/products" className="btn btn-primary hero-cta-btn">
                  <span>Shop Now</span>
                  <ShoppingBag size={18} />
                </Link>

                <Link href="/products?featured=true" className="btn btn-secondary hero-cta-btn">
                  <span>Explore Deals</span>
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div className="trust-features-grid">
                <div className="trust-feature-chip">
                  <Truck size={18} className="chip-icon" />
                  <div>
                    <div className="chip-title">Free Express Shipping</div>
                    <div className="chip-sub">Orders over $100</div>
                  </div>
                </div>

                <div className="trust-feature-chip">
                  <ShieldCheck size={18} className="chip-icon" />
                  <div>
                    <div className="trust-title">2-Year Warranty</div>
                    <div className="chip-sub">Official replacement</div>
                  </div>
                </div>

                <div className="trust-feature-chip">
                  <Award size={18} className="chip-icon" />
                  <div>
                    <div className="chip-title">Top Quality</div>
                    <div className="chip-sub">100% verified gear</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Spotlight Card */}
            <motion.div 
              className="hero-product-showcase"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="spotlight-card animate-float">
                <div className="spotlight-top-tags">
                  <span className="badge-chip blue">SPOTLIGHT ITEM</span>
                  <span className="badge-chip orange">-17% OFF</span>
                </div>

                <div className="spotlight-img-frame">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80" 
                    alt="Noise Canceling Headphones"
                    className="spotlight-img" 
                  />
                </div>

                <div className="spotlight-body">
                  <div className="spotlight-cat-row">
                    <span className="spotlight-cat">ELECTRONICS & AUDIO</span>
                    <div className="spotlight-rating">
                      <Star size={13} fill="#F59E0B" color="#F59E0B" />
                      <span>4.9 (128 reviews)</span>
                    </div>
                  </div>

                  <h3 className="spotlight-title">Wireless ANC Headphones</h3>

                  <div className="spotlight-price-row">
                    <div>
                      <span className="price-now">$249.99</span>
                      <span className="price-before">$299.99</span>
                    </div>

                    <Link href="/products/prod-1" className="btn btn-primary btn-sm">
                      View Deal
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}