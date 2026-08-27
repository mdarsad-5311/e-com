"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Check, ShieldCheck, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import "@/styles/product-card.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(product.image);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAddedToCart(true);
    showToast(`${product.title} added to cart`);
    setTimeout(() => setIsAddedToCart(false), 1500);
  };

  const handleToggleWishlist = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const categoryLabel = (product.subCategory || product.categoryName || product.category || "PRODUCT").toUpperCase();
  const currentPrice = product.price;
  const originalPrice = product.originalPrice || (currentPrice > 100 ? currentPrice * 1.2 : undefined);
  const discountPct = product.discountPercentage || (originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);
  const ratingVal = product.rating || 4.8;
  const reviewsCount = product.reviewsCount || 128;

  return (
    <div className="al-card-item">
      {/* Product Image Wrap & Overlay Actions */}
      <div className="al-card-img-wrap-outer">
        {/* Assured Badge (White Pill with Blue Shield Check) */}
        {product.isAssured !== false && (
          <div className="al-assured-pill">
            <ShieldCheck size={14} className="al-assured-icon" />
            <span>Assured</span>
          </div>
        )}

        {/* Sale Discount Badge */}
        {discountPct > 0 && (
          <div className="al-card-discount-pill">
            <span>{discountPct}% OFF</span>
          </div>
        )}

        {/* Circular Wishlist Button */}
        <button
          type="button"
          className={`al-wishlist-circle-btn ${isFavorited ? "active" : ""}`}
          onClick={handleToggleWishlist}
          title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={17}
            fill={isFavorited ? "#e11d48" : "none"}
            color={isFavorited ? "#e11d48" : "#475569"}
            strokeWidth={1.8}
          />
        </button>

        {/* Product Image Link */}
        <Link href={`/products/${product.slug || product.id}`} className="al-card-img-link">
          <div className="al-card-img-frame">
            <Image
              src={imgSrc}
              alt={product.title}
              width={380}
              height={380}
              className="al-card-img"
              loading="lazy"
              onError={() => setImgSrc("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80")}
            />
          </div>
        </Link>
      </div>

      {/* Product Information Body */}
      <div className="al-card-body">
        {/* Top Meta: Category Kicker & Rating Summary */}
        <div className="al-card-meta-top">
          <span className="al-card-category">{categoryLabel}</span>
          <div className="al-card-rating-badge" title={`${ratingVal} out of 5 stars based on ${reviewsCount} reviews`}>
            <Star size={12} fill="#FF7A00" color="#FF7A00" />
            <span className="al-card-rating-num">{ratingVal.toFixed(1)}</span>
            <span className="al-card-rating-count">({reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug || product.id}`} className="al-card-title-link">
          <h3 className="al-card-title" title={product.title}>
            {product.title}
          </h3>
        </Link>

        {/* Bottom Row: Price & Strikethrough on Left, Rectangular Cart Button on Right */}
        <div className="al-card-bottom-row">
          <div className="al-card-price-group">
            <span className="al-card-price">${currentPrice.toFixed(2)}</span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="al-card-orig-price">${originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            type="button"
            className={`al-cart-btn-rect ${isAddedToCart ? "added" : ""}`}
            onClick={handleAddToCart}
            title={isAddedToCart ? "Added to Cart" : "Add to Cart"}
            aria-label="Add to Cart"
          >
            {isAddedToCart ? (
              <Check size={18} strokeWidth={2.5} />
            ) : (
              <ShoppingCart size={17} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
