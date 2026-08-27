"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingCart, ShieldCheck } from "lucide-react";
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

  // Render 5 stars matching reference attachment
  const renderStars = (rating: number) => {
    const starCount = 5;
    return Array.from({ length: starCount }).map((_, index) => {
      const isFilled = index < Math.floor(rating || 5);
      return (
        <Star
          key={index}
          size={13}
          fill={isFilled ? "#FF7A00" : "none"}
          color={isFilled ? "#FF7A00" : "#CBD5E1"}
          className="al-star-icon"
        />
      );
    });
  };

  return (
    <div className="al-card-item">
      {/* Top Row: Assured Tag on Left, Wishlist Heart on Right */}
      <div className="al-card-top-bar">
        {product.isAssured ? (
          <div className="al-assured-tag">
            <ShieldCheck size={13} className="al-assured-tag-icon" />
            <span>AL-UMAIMA ASSURED</span>
          </div>
        ) : (
          <div className="al-assured-placeholder" />
        )}

        <button
          type="button"
          className={`al-wishlist-circle-btn ${isFavorited ? "active" : ""}`}
          onClick={handleToggleWishlist}
          title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <Heart 
            size={16} 
            fill={isFavorited ? "#FF7A00" : "none"} 
            color={isFavorited ? "#FF7A00" : "#64748B"} 
          />
        </button>
      </div>

      {/* Product Image Link */}
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

      {/* Product Information Body */}
      <div className="al-card-body">
        {/* 5-Star Rating Row with Count in Brackets */}
        <div className="al-card-rating-row">
          <div className="al-stars-group">
            {renderStars(product.rating)}
          </div>
          <span className="al-reviews-count">({(product.reviewsCount || 128).toLocaleString()})</span>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.id}`} className="al-card-title-link">
          <h3 className="al-card-title">{product.title}</h3>
        </Link>

        {/* Bottom Row: Price on Left, Dark Navy Cart Icon Button on Right */}
        <div className="al-card-bottom-row">
          <div className="al-card-price-group">
            <span className="al-card-price">${product.price.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className={`al-cart-round-btn ${isAddedToCart ? "added" : ""}`}
            onClick={handleAddToCart}
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            <ShoppingCart size={17} color="#FFFFFF" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}
