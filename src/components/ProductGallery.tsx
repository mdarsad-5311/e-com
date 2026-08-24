"use client";

import { useState } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/product-gallery.css";

interface ProductGalleryProps {
  images: string[];
  title: string;
  badge?: string;
}

export default function ProductGallery({ images, title, badge }: ProductGalleryProps) {
  const galleryList = images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="product-gallery-root">
      {/* Main Image Stage */}
      <div className="main-image-stage glass-card">
        {badge && (
          <span className="gallery-badge badge badge-primary">{badge}</span>
        )}

        <img
          src={galleryList[activeImageIndex]}
          alt={`${title} view ${activeImageIndex + 1}`}
          className="main-gallery-image"
        />

        <button
          className="lightbox-trigger-btn"
          onClick={() => setIsLightboxOpen(true)}
          title="Fullscreen view"
        >
          <Maximize2 size={15} /> Expand
        </button>

        {galleryList.length > 1 && (
          <>
            <button className="gallery-nav-btn prev-btn" onClick={handlePrev}>
              <ChevronLeft size={20} />
            </button>
            <button className="gallery-nav-btn next-btn" onClick={handleNext}>
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {galleryList.length > 1 && (
        <div className="thumbnails-strip">
          {galleryList.map((img, idx) => (
            <button
              key={idx}
              className={`thumbnail-btn ${activeImageIndex === idx ? "active" : ""}`}
              onClick={() => setActiveImageIndex(idx)}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="thumbnail-img" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-lightbox-btn" onClick={() => setIsLightboxOpen(false)}>
              <X size={24} />
            </button>
            <img
              src={galleryList[activeImageIndex]}
              alt={title}
              className="lightbox-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}
