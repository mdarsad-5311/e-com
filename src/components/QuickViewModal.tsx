"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useUI } from "@/context/UIContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import "@/styles/quick-view-modal.css";

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, openCart } = useUI();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const modalRef = useFocusTrap<HTMLDivElement>(!!quickViewProduct, closeQuickView);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="qv-backdrop" onClick={closeQuickView}>
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="qv-modal" 
        onClick={(e) => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="qv-product-title"
      >
        <button 
          type="button"
          className="qv-close" 
          onClick={closeQuickView} 
          aria-label="Close product quick view"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <Image 
          src={product.image} 
          alt={product.title} 
          width={300} 
          height={300} 
          style={{ objectFit: "cover" }}
        />
        <div className="qv-body">
          <span className="qv-cat">{product.categoryName}</span>
          <h3 id="qv-product-title">{product.title}</h3>
          <div className="qv-rating" aria-label={`Rated ${product.rating.toFixed(1)} out of 5 stars based on ${product.reviewsCount} reviews`}>
            <Star size={14} fill="#F59E0B" color="#F59E0B" aria-hidden="true" />
            {product.rating.toFixed(1)} · {product.reviewsCount} reviews
          </div>
          <div className="qv-price">
            ${product.price.toFixed(2)}
            {product.originalPrice && <s>${product.originalPrice.toFixed(2)}</s>}
          </div>
          <p>{product.description}</p>
          <div className="qv-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                addToCart(product, 1);
                showToast(`${product.title} added to bag`);
                closeQuickView();
                openCart();
              }}
              aria-label={`Add ${product.title} to shopping bag`}
            >
              <ShoppingBag size={16} aria-hidden="true" /> Add to bag
            </button>
            <button 
              type="button"
              className="btn btn-outline" 
              onClick={() => toggleWishlist(product)}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={16} fill={wishlisted ? "#EF4444" : "none"} aria-hidden="true" />
              {wishlisted ? "Saved" : "Wishlist"}
            </button>
          </div>
          <Link href={`/products/${product.slug || product.id}`} onClick={closeQuickView} className="full-link">
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
}
