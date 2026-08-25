"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, ShoppingCart, Heart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useUI } from "@/context/UIContext";
import { Product } from "@/data/products";
import "@/styles/product-gallery.css";

interface ProductGalleryProps {
  images: string[];
  title: string;
  product?: Product;
}

export default function ProductGallery({ images, title, product }: ProductGalleryProps) {
  const router = useRouter();
  const galleryList = images && images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
  ];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { totalItemsCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openCart } = useUI();
  const { showToast } = useToast();

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setIsCopied(true);
      showToast("Product link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product);
      showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    }
  };

  return (
    <div className="al-product-gallery-layout">
      {/* Mobile Top Navigation Bar (Back, Share, Cart) */}
      <div className="al-mobile-detail-topbar">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="al-topbar-btn"
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="al-topbar-right">
          <button 
            type="button" 
            onClick={handleShare} 
            className="al-topbar-btn"
            aria-label="Share"
            title="Share product"
          >
            {isCopied ? <Check size={20} className="text-success" /> : <Share2 size={20} />}
          </button>

          <button 
            type="button" 
            onClick={openCart} 
            className="al-topbar-btn al-cart-icon-btn"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={22} />
            <span className="al-topbar-badge">{totalItemsCount > 0 ? totalItemsCount : 2}</span>
          </button>
        </div>
      </div>

      {/* Desktop Vertical Thumbnails */}
      <div className="al-thumbnails-vertical">
        {galleryList.map((img, idx) => (
          <button
            key={idx}
            type="button"
            className={`al-thumb-btn ${activeImageIndex === idx ? "active" : ""}`}
            onMouseEnter={() => setActiveImageIndex(idx)}
            onClick={() => setActiveImageIndex(idx)}
            aria-label={`View image ${idx + 1}`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="al-thumb-img" />
          </button>
        ))}
      </div>

      {/* Main Image Box */}
      <div className="al-main-image-container">
        {/* Floating Wishlist Button on Top Right */}
        <button
          type="button"
          className={`al-floating-wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
          onClick={handleToggleWishlist}
          title="Add to Wishlist"
          aria-label="Wishlist"
        >
          <Heart 
            size={19} 
            fill={isWishlisted ? "#dc2626" : "none"} 
            color={isWishlisted ? "#dc2626" : "#475569"} 
          />
        </button>

        <div className="al-main-img-frame">
          <img
            src={galleryList[activeImageIndex]}
            alt={title}
            className="al-main-img"
          />
        </div>

        {/* Mobile Pagination Dots Indicator */}
        <div className="al-gallery-dots">
          {galleryList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`al-dot ${activeImageIndex === idx ? "active" : ""}`}
              onClick={() => setActiveImageIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
