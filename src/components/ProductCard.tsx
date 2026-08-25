"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import { Star, CheckCircle2 } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import "@/styles/product-card.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAddedToCart(true);
    showToast(`${product.title} added to cart`);
    setTimeout(() => setIsAddedToCart(false), 1500);
  };

  // Render 5 stars matching reference attachment
  const renderStars = (rating: number) => {
    const starCount = 5;
    return Array.from({ length: starCount }).map((_, index) => {
      const isFilled = index < Math.floor(rating || 5);
      const isHalf = !isFilled && index < rating;
      return (
        <div key={index} className="star-wrapper">
          <Star
            size={12}
            fill={isFilled ? "#F59E0B" : isHalf ? "#F59E0B" : "none"}
            color={isFilled || isHalf ? "#F59E0B" : "#D1D5DB"}
            className="star-icon"
          />
        </div>
      );
    });
  };

  return (
    <div className="al-product-card">
      {/* Discount Badge */}
      {product.discountPercentage ? (
        <span className="al-discount-badge">-{product.discountPercentage}%</span>
      ) : null}

      {/* Product Image Frame */}
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

      {/* Product Body */}
      <div className="al-card-body">
        <Link href={`/products/${product.id}`} className="al-card-title-link">
          <h3 className="al-card-title">{product.title}</h3>
        </Link>

        {/* 5-Star Rating Row with Count in Brackets */}
        <div className="al-card-rating-row">
          <div className="al-stars-group">
            {renderStars(product.rating)}
          </div>
          <span className="al-reviews-count">({(product.reviewsCount || 128).toLocaleString()})</span>
        </div>

        {/* Price Block: Current price + Original price crossed out below */}
        <div className="al-card-price-block">
          <div className="al-card-price">${product.price.toFixed(2)}</div>
          {product.originalPrice && product.originalPrice > product.price ? (
            <div className="al-card-orig-price">${product.originalPrice.toFixed(2)}</div>
          ) : (
            <div className="al-card-orig-price-placeholder" />
          )}
        </div>

        {/* Assured Badge or Delivery Info */}
        <div className="al-meta-badge-row">
          {product.isAssured ? (
            <div className="al-assured-badge">
              <CheckCircle2 size={12} className="al-assured-icon" />
              <span className="al-assured-text">Al-Umaima Assured</span>
            </div>
          ) : product.deliveryInfo ? (
            <div className="al-delivery-info">
              <span className="al-delivery-text">{product.deliveryInfo}</span>
            </div>
          ) : (
            <div className="al-assured-placeholder" />
          )}
        </div>

        {/* Full-width Add to Cart Orange Button */}
        <button
          className={`al-add-to-cart-btn ${isAddedToCart ? "added" : ""}`}
          onClick={handleAddToCart}
          title="Add to Shopping Cart"
        >
          {isAddedToCart ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
