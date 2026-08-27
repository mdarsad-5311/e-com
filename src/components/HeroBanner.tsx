"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import "@/styles/hero-banner.css";

export default function HeroBanner() {
  return (
    <section className="al-hero-section">
      {/* Desktop Hero Banner */}
      <div className="al-hero-banner al-hero-desktop-view">
        <Image
          src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=2000&q=90"
          alt="Elevate Your Lifestyle with Premium Tech"
          fill
          priority
          sizes="(max-width: 1400px) 100vw, 1400px"
          className="al-hero-desktop-bg"
        />
        <div className="al-hero-overlay-desktop" />
        <div className="header-container al-hero-container">
          <div className="al-hero-text-block">
            <div className="al-hero-top-tag">
              <Sparkles size={14} />
              <span>Flagship Spring 2026 Collection</span>
            </div>
            <h1 className="al-hero-heading">
              Elevate Your Lifestyle with<br />Premium Tech
            </h1>
            <p className="al-hero-desc">
              Discover cutting-edge innovations engineered to seamlessly integrate into your modern life. Precision audio, wearable tech, and minimalist fashion.
            </p>
            <div className="al-hero-actions">
              <Link href="/category/electronics" className="al-hero-btn-shop">
                <span>Shop the Collection</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Hero Banner */}
      <div className="al-hero-banner al-hero-mobile-view">
        <Image
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90"
          alt="Next-Gen Wearables"
          fill
          priority
          sizes="100vw"
          className="al-hero-mobile-bg"
        />
        <div className="al-hero-overlay-mobile" />
        <div className="al-hero-mobile-content">
          <div className="al-hero-assured-badge">
            <ShieldCheck size={13} />
            <span>Al-Umaima Assured</span>
          </div>
          <h2 className="al-hero-mobile-title">Next-Gen Wearables</h2>
          <p className="al-hero-mobile-sub">Experience seamless integration & precision engineering.</p>
          <Link href="/category/electronics" className="al-hero-btn-shop-mobile">
            <span>Shop Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}