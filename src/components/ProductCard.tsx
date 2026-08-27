"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Check, ShieldCheck } from "lucide-react";
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

  return (
    <div className="al-card-item">
      {/* Product Image Link & Overlay Badges */}
      <div className="al-card-img-wrap-outer">
        {product.isAssured && (
          <div className="al-assured-pill-gold">
            <ShieldCheck size={11} />
            <span>Assured</span>
          </div>
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
            fill={isFavorited ? "#e11d48" : "none"} 
            color={isFavorited ? "#e11d48" : "#64748B"} 
          />
        </button>

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
      </div>

      {/* Product Information Body */}
      <div className="al-card-body">
        {/* Title */}
        <Link href={`/products/${product.id}`} className="al-card-title-link">
          <h3 className="al-card-title">{product.title}</h3>
        </Link>

        {/* Description Snippet (Attachment 2) */}
        {product.description && (
          <p className="al-card-desc-snippet">{product.description}</p>
        )}

        {/* Star Rating Row (Attachment 2: ★ 4.8 (124)) */}
        <div className="al-card-rating-row">
          <Star size={13} fill="#f59e0b" color="#f59e0b" className="al-star-single" />
          <span className="al-rating-num">{product.rating || 4.8}</span>
          <span className="al-reviews-count">({product.reviewsCount || 124})</span>
        </div>

        {/* Bottom Row: Price on Left, Circular Orange Cart Button on Right (Attachment 2) */}
        <div className="al-card-bottom-row">
          <span className="al-card-price">${product.price.toFixed(2)}</span>

          <button
            type="button"
            className={`al-cart-orange-btn ${isAddedToCart ? "added" : ""}`}
            onClick={handleAddToCart}
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            {isAddedToCart ? (
              <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
              <ShoppingCart size={16} color="#FFFFFF" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
