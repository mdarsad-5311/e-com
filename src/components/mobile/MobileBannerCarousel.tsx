"use client";

import { useState, useEffect, useRef, TouchEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

interface BannerSlide {
  id: string;
  tag?: string;
  heading: string;
  subheading: string;
  offerBadge: string;
  imageUrl: string;
  linkUrl: string;
  ctaText: string;
  bgColor: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: "slide-1",
    tag: "Loved picks, almost gone!",
    heading: "Quantum ANC Audio",
    subheading: "40-Hour playtime with spatial sound",
    offerBadge: "Min. 30% Off",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",
    linkUrl: "/category/electronics",
    ctaText: "Shop Audio",
    bgColor: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
  {
    id: "slide-2",
    tag: "New Season 2026",
    heading: "Minimalist Apparel",
    subheading: "Weather-shield jackets & casual wear",
    offerBadge: "Min. 40% Off",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
    linkUrl: "/category/fashion",
    ctaText: "Shop Style",
    bgColor: "linear-gradient(135deg, #78350f 0%, #451a03 100%)",
  },
  {
    id: "slide-3",
    tag: "Next-Gen Wearables",
    heading: "AuraFit Smartwatch",
    subheading: "AMOLED display & comprehensive health tracking",
    offerBadge: "Special Deal",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
    linkUrl: "/category/electronics",
    ctaText: "Explore Now",
    bgColor: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
  },
  {
    id: "slide-4",
    tag: "Home Innovations",
    heading: "Smart Home & Living",
    subheading: "Ergonomic lighting & modern air care",
    offerBadge: "Up to 50% Off",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85",
    linkUrl: "/category/home-goods",
    ctaText: "Shop Home",
    bgColor: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
  },
];

export default function MobileBannerCarousel({
  slides = DEFAULT_SLIDES,
}: {
  slides?: BannerSlide[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  // Touch handlers for swipe
  const handleTouchStart = (e: TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="al-mobile-carousel-section"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional banner carousel"
    >
      <div className="al-mobile-carousel-viewport">
        <div
          className="al-mobile-carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={slide.id} className="al-mobile-carousel-slide">
              <Link href={slide.linkUrl} className="al-mobile-banner-card">
                <div 
                  className="al-mobile-banner-bg" 
                  style={{ background: slide.bgColor }}
                >
                  {/* Banner Image with smooth blend */}
                  <div className="al-mobile-banner-img-wrap">
                    <img
                      src={slide.imageUrl}
                      alt={slide.heading}
                      className="al-mobile-banner-img"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </div>

                  <div className="al-mobile-banner-gradient-overlay" />

                  {/* Banner Text Block */}
                  <div className="al-mobile-banner-content">
                    {slide.tag && (
                      <span className="al-mobile-banner-tag">
                        <Sparkles size={11} /> {slide.tag}
                      </span>
                    )}

                    <h2 className="al-mobile-banner-heading">{slide.heading}</h2>
                    <p className="al-mobile-banner-subheading">{slide.subheading}</p>

                    <div className="al-mobile-banner-cta-row">
                      <span className="al-mobile-banner-offer-pill">
                        {slide.offerBadge}
                      </span>
                      <span className="al-mobile-banner-btn">
                        {slide.ctaText} <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination indicators (Pill & Dots, matches Flipkart reference ---) */}
      <div className="al-mobile-carousel-pagination" aria-hidden="true">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`al-carousel-dot ${i === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
