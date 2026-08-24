"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useUI } from "@/context/UIContext";
import "@/styles/quick-view-modal.css";

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, openCart } = useUI();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="qv-backdrop" onClick={closeQuickView}>
      <div className="qv-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="qv-close" onClick={closeQuickView} aria-label="Close">
          <X size={18} />
        </button>
        <img src={product.image} alt={product.title} />
        <div className="qv-body">
          <span className="qv-cat">{product.categoryName}</span>
          <h3>{product.title}</h3>
          <div className="qv-rating">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            {product.rating.toFixed(1)} · {product.reviewsCount} reviews
          </div>
          <div className="qv-price">
            ${product.price.toFixed(2)}
            {product.originalPrice && <s>${product.originalPrice.toFixed(2)}</s>}
          </div>
          <p>{product.description}</p>
          <div className="qv-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                addToCart(product, 1);
                showToast(`${product.title} added to bag`);
                closeQuickView();
                openCart();
              }}
            >
              <ShoppingBag size={16} /> Add to bag
            </button>
            <button className="btn btn-outline" onClick={() => toggleWishlist(product)}>
              <Heart size={16} fill={wishlisted ? "#EF4444" : "none"} />
              {wishlisted ? "Saved" : "Wishlist"}
            </button>
          </div>
          <Link href={`/products/${product.id}`} onClick={closeQuickView} className="full-link">
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
}
