"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, Heart, ShieldCheck, Award } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { Product } from "@/data/products";
import "@/styles/product-gallery.css";
import "@/styles/product-detail-extra.css";

interface ProductGalleryProps {
  images: string[];
  title: string;
  product?: Product;
}

const MAX_THUMBS = 3; // show 3 thumbnails, then "+N" pill

export default function ProductGallery({ images, title, product }: ProductGalleryProps) {
  const router = useRouter();
  const galleryList = images && images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
  ];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const isWishlisted = product ? isInWishlist(product.id) : false;
  const isBestSeller = product?.isBestSeller;
  const isAssured = product?.isAssured;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Product link copied to clipboard!");
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product);
      showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    }
  };

  // Thumbnails: show MAX_THUMBS, then overflow pill
  const visibleThumbs = galleryList.slice(0, MAX_THUMBS);
  const extraCount = galleryList.length > MAX_THUMBS ? galleryList.length - MAX_THUMBS : 0;

  return (
    <div className="al-product-gallery-layout">
      {/* Mobile Top Actions (Back, Share, Heart) */}
      <div className="al-mobile-gallery-top-bar">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="al-gallery-nav-btn"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="al-gallery-top-right">
          <button 
            type="button" 
            onClick={handleShare} 
            className="al-gallery-nav-btn"
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>

          <button 
            type="button" 
            onClick={handleToggleWishlist} 
            className="al-gallery-nav-btn"
            aria-label="Wishlist"
          >
            <Heart size={18} fill={isWishlisted ? "#FF7A00" : "none"} color={isWishlisted ? "#FF7A00" : "#64748B"} />
          </button>
        </div>
      </div>

      {/* Main Showcase Frame */}
      <div className="al-main-image-container">
        {/* Stacked Badges: Bestseller + Assured */}
        {(isBestSeller || isAssured) && (
          <div className="al-gallery-badge-stack">
            {isBestSeller && (
              <div className="al-gallery-bestseller-badge">
                <Award size={12} />
                Bestseller
              </div>
            )}
            {isAssured && (
              <div className="al-gallery-assured-badge" style={{ position: "relative", top: "auto", left: "auto" }}>
                <ShieldCheck size={12} className="al-assured-badge-icon" />
                <span>Al-Umaima Assured</span>
              </div>
            )}
          </div>
        )}

        {/* When only assured (no bestseller) */}
        {!isBestSeller && !isAssured && (
          <div className="al-gallery-assured-badge">
            <ShieldCheck size={14} className="al-assured-badge-icon" />
            <span>Al-Umaima Assured</span>
          </div>
        )}

        {/* Product Image */}
        <div className="al-main-img-frame">
          <img
            src={galleryList[activeImageIndex]}
            alt={title}
            className="al-main-img"
          />
        </div>

        {/* Pagination Dots */}
        <div className="al-gallery-dots">
          {galleryList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`al-dot ${activeImageIndex === idx ? "active" : ""}`}
              onClick={() => setActiveImageIndex(idx)}
              aria-label={`Image slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="al-gallery-thumb-strip">
        {visibleThumbs.map((img, idx) => (
          <button
            key={idx}
            type="button"
            className={`al-gallery-thumb-btn ${activeImageIndex === idx ? "active" : ""}`}
            onClick={() => setActiveImageIndex(idx)}
            aria-label={`View image ${idx + 1}`}
          >
            <img src={img} alt={`${title} view ${idx + 1}`} />
          </button>
        ))}
        {extraCount > 0 && (
          <div className="al-gallery-thumb-more">+{extraCount}</div>
        )}
      </div>
    </div>
  );
}
