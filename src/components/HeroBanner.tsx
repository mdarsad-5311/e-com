"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import "@/styles/hero-banner.css";

export default function HeroBanner() {
  return (
    <section className="al-hero-section">
      {/* Desktop Hero Banner (Attachment 2) */}
      <div className="al-hero-banner al-hero-desktop-view">
        <img
          src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=2000&q=90"
          alt="Elevate Your Lifestyle with Premium Tech"
          className="al-hero-desktop-bg"
        />
        <div className="al-hero-overlay-desktop" />
        <div className="header-container al-hero-container">
          <div className="al-hero-text-block">
            <h1 className="al-hero-heading">
              Elevate Your Lifestyle with<br />Premium Tech
            </h1>
            <p className="al-hero-desc">
              Discover the latest innovations designed to seamlessly integrate into your modern life. Precision engineered for excellence.
            </p>
            <div className="al-hero-actions">
              <Link href="/category/electronics" className="al-hero-btn-shop">
                Shop the Collection
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Hero Banner (Attachment 3) */}
      <div className="al-hero-banner al-hero-mobile-view">
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90"
          alt="Next-Gen Wearables"
          className="al-hero-mobile-bg"
        />
        <div className="al-hero-overlay-mobile" />
        <div className="al-hero-mobile-content">
          <div className="al-hero-assured-badge">
            <ShieldCheck size={13} />
            <span>Assured</span>
          </div>
          <h2 className="al-hero-mobile-title">Next-Gen Wearables</h2>
          <p className="al-hero-mobile-sub">Experience seamless integration.</p>
          <Link href="/category/electronics" className="al-hero-btn-shop-mobile">
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}