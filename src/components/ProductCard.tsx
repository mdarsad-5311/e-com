"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Check, Star, ShieldCheck } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useUI } from "@/context/UIContext";
import { motion } from "framer-motion";
import "@/styles/product-card.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { openCart, openQuickView } = useUI();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAddedToCart(true);
    showToast("Added to bag");
    openCart();
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card-wrapper">
      <div className="product-card-box">
        {/* Product Media Image Container */}
        <div className="media-container">
          {product.badge && (
            <span className="badge-pill-tag">
              {product.badge}
            </span>
          )}

          {discountPercentage > 0 && (
            <span className="discount-pill-tag">-{discountPercentage}% OFF</span>
          )}

          {/* Wishlist Heart Icon Toggle Button */}
          <button
            className={`heart-wishlist-toggle ${isWishlisted ? "active" : ""}`}
            onClick={handleWishlistToggle}
            title={isWishlisted ? "Saved in wishlist" : "Add to wishlist"}
          >
            <motion.div whileTap={{ scale: 1.3 }}>
              <Heart 
                size={17} 
                fill={isWishlisted ? "#EF4444" : "none"} 
                color={isWishlisted ? "#EF4444" : "#878787"} 
              />
            </motion.div>
          </button>

          <img
            src={product.image}
            alt={product.title}
            className="product-card-img"
            loading="lazy"
          />

          {/* Hover Quick View Overlay */}
          <div className="quick-view-overlay">
            <button type="button" className="quick-view-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(product); }}>
              <Eye size={15} /> Quick View
            </button>
          </div>
        </div>

        {/* Product Body Details */}
        <div className="card-body-block">
          <div className="meta-category-line">
            <span className="cat-label">{product.categoryName}</span>
            <div className="rating-pill">
              <Star size={11} fill="#FFFFFF" color="#FFFFFF" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <Link href={`/products/${product.id}`} className="title-link">
            <h3 className="product-title-text">{product.title}</h3>
          </Link>

          <div className="assured-line">
            <span className="assured-tag"><ShieldCheck size={12} /> Assured</span>
            {product.soldCount ? (
              <span className="stock-info">{product.soldCount.toLocaleString()}+ sold</span>
            ) : (
              <span className="stock-info">{product.stock <= 5 ? `Only ${product.stock} left` : "In Stock"}</span>
            )}
          </div>

          {/* Price & Add to Cart Button */}
          <div className="price-cart-footer">
            <div className="pricing-group">
              <span className="current-price-text">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original-price-text">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <button
              className={`add-cart-btn ${isAddedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
              title="Add to Shopping Cart"
            >
              {isAddedToCart ? (
                <>
                  <Check size={15} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={15} /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
