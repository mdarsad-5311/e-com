"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/hero-banner.css";

export default function HeroBanner() {
  return (
    <section className="al-hero-section">
      <div className="al-hero-bg-container">
        {/* Luxury Modern Living Room with City Skyline Night Background */}
        <div 
          className="al-hero-image-bg"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(8, 18, 38, 0.92) 0%, rgba(8, 18, 38, 0.75) 45%, rgba(8, 18, 38, 0.3) 100%), url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85')`
          }}
        >
          <div className="header-container al-hero-content-wrap">
            <motion.div 
              className="al-hero-content"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Exclusive Deals Badge */}
              <div className="al-hero-badge">
                EXCLUSIVE AL-UMAIMA EXPRESS DEALS
              </div>

              {/* Main Headline */}
              <h1 className="al-hero-title">
                Upgrade Your Life with<br />
                Premium Tech & Fashion
              </h1>

              {/* Subheading */}
              <p className="al-hero-subtitle">
                Discover ANC headphones, smartwatch gadgets, minimalist jackets, and smart home lighting engineered for peak daily performance.
              </p>

              {/* CTA Buttons */}
              <div className="al-hero-cta-group">
                <Link href="/products" className="al-hero-btn-primary">
                  <span>Shop Now</span>
                  <ArrowRight size={17} className="btn-arrow" />
                </Link>

                <Link href="/products?featured=true" className="al-hero-btn-secondary">
                  <span>Explore Deals</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}