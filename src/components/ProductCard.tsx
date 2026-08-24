"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import { ShoppingCart, Check, Star, ShieldCheck } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useUI } from "@/context/UIContext";
import "@/styles/product-card.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { openCart } = useUI();

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAddedToCart(true);
    showToast("Added to cart");
    openCart();
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 17;

  // Render 5 stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => {
      const isFilled = index < Math.floor(rating);
      return (
        <Star
          key={index}
          size={13}
          fill={isFilled ? "#F59E0B" : "none"}
          color={isFilled ? "#F59E0B" : "#D1D5DB"}
          className="star-icon"
        />
      );
    });
  };

  return (
    <div className="al-product-card">
      {/* Top Left Red Discount Badge */}
      <div className="al-card-discount-badge">
        -{discountPercentage}% OFF
      </div>

      {/* Media Image Frame */}
      <Link href={`/products/${product.id}`} className="al-card-img-link">
        <div className="al-card-img-frame">
          <img
            src={product.image}
            alt={product.title}
            className="al-card-img"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Body Details */}
      <div className="al-card-body">
        <Link href={`/products/${product.id}`} className="al-card-title-link">
          <h3 className="al-card-title">{product.title}</h3>
        </Link>

        {/* 5-Star Rating Row */}
        <div className="al-card-rating-row">
          <div className="al-stars-group">
            {renderStars(product.rating)}
          </div>
          <span className="al-rating-num">{product.rating.toFixed(1)}</span>
          <span className="al-reviews-count">({(product.soldCount || product.reviewsCount || 128).toLocaleString()})</span>
        </div>

        {/* Price Row */}
        <div className="al-card-price-row">
          <span className="al-card-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="al-card-original-price">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Assured Badge */}
        <div className="al-assured-badge-row">
          <ShieldCheck size={14} className="al-assured-icon" />
          <span className="al-assured-text">Al-Umaima Assured</span>
        </div>

        {/* Delivery Info */}
        <div className="al-card-delivery-text">
          FREE Delivery by <strong>Tomorrow</strong>
        </div>

        {/* Full-width Add to Cart Orange Button */}
        <button
          className={`al-add-to-cart-btn ${isAddedToCart ? "added" : ""}`}
          onClick={handleAddToCart}
          title="Add to Shopping Cart"
        >
          {isAddedToCart ? (
            <>
              <Check size={16} /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
