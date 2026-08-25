"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/hero-banner.css";

export default function HeroBanner() {
  return (
    <section className="al-hero-section">
      <div className="header-container al-hero-container-outer">
        <div 
          className="al-hero-image-bg"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.45) 45%, rgba(15, 23, 42, 0.1) 100%), url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=85')`
          }}
        >
          <div className="al-hero-content-wrap">
            <motion.div 
              className="al-hero-content"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* BIG SAVINGS Tag Badge */}
              <div className="al-hero-badge">
                BIG SAVINGS
              </div>

              {/* Main Headline */}
              <h1 className="al-hero-title">
                Upgrade Your Life
              </h1>

              {/* Subheading */}
              <p className="al-hero-subtitle">
                Top tech & fashion at unbeatable prices.
              </p>

              {/* CTA Button */}
              <div className="al-hero-cta-group">
                <Link href="/products" className="al-hero-btn-primary">
                  <span>Shop Now</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}