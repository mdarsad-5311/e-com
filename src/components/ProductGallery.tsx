"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import "@/styles/product-gallery.css";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const galleryList = images && images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  ];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { showToast } = useToast();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setIsCopied(true);
      showToast("Product link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="al-product-gallery-layout">
      {/* Vertical Thumbnails on the Left */}
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

      {/* Main Image Box with Share Node Icon in Top Right */}
      <div className="al-main-image-container">
        <button
          type="button"
          className="al-gallery-share-btn"
          onClick={handleShare}
          title="Share this product"
          aria-label="Share"
        >
          {isCopied ? <Check size={16} className="text-success" /> : <Share2 size={16} />}
        </button>

        <div className="al-main-img-frame">
          <img
            src={galleryList[activeImageIndex]}
            alt={title}
            className="al-main-img"
          />
        </div>
      </div>
    </div>
  );
}
