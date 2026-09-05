"use client";

import Link from "next/link";
import { ArrowRight, Zap, Flame } from "lucide-react";
import "@/styles/promo-banners.css";
import Image from "next/image";


export default function PromoBanners() {
  return (
    <section className="promo-banners-section section">
      <div className="container promo-grid">
        {/* Banner 1: Tech & Audio */}
        <div className="promo-card glass-card promo-card-tech">
          <div className="promo-card-content">
            <span className="promo-tag tag-cyan">
              <Zap size={13} /> EXCLUSIVE TECH DROP
            </span>
            <h3 className="promo-title">Next-Gen ANC Audio & Studio Sound</h3>
            <p className="promo-subtitle">
              Immerse yourself in active noise cancellation with 40-hour battery life.
            </p>
            <div className="promo-footer">
              <span className="promo-discount">SAVE UP TO 30% OFF</span>
              <Link href="/category/electronics" className="btn btn-primary promo-btn">
                Shop Audio <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="promo-image-box">
            <Image width={500} height={500}
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80"
              alt="Tech & Audio Drop"
              className="promo-img"
            />
          </div>
        </div>

        {/* Banner 2: Fashion & Apparel */}
        <div className="promo-card glass-card promo-card-fashion">
          <div className="promo-card-content">
            <span className="promo-tag tag-rose">
              <Flame size={13} /> TRENDING STYLE
            </span>
            <h3 className="promo-title">Minimalist Urban Apparel & Jackets</h3>
            <p className="promo-subtitle">
              Waterproof weather-shield fabric designed for modern urban utility.
            </p>
            <div className="promo-footer">
              <span className="promo-discount">NEW SEASON ARRIVALS</span>
              <Link href="/category/fashion" className="btn btn-accent promo-btn">
                Shop Wear <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="promo-image-box">
            <Image width={500} height={500}
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80"
              alt="Urban Fashion Drop"
              className="promo-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
