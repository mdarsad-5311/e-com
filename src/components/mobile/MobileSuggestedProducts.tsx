"use client";

import { useMemo, MouseEvent, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Heart, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  Star,
  Sparkles
} from "lucide-react";
import { products, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

interface MobileSuggestedProductsProps {
  selectedCategoryId?: string;
}

export default function MobileSuggestedProducts({
  selectedCategoryId = "for-you",
}: MobileSuggestedProductsProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Filter products by selected category or show curated recommendation
  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === "for-you") {
      // Pick best diverse mix of products for "For You"
      return products.slice(0, 10);
    }
    const matching = products.filter(
      (p) => p.category.toLowerCase() === selectedCategoryId.toLowerCase()
    );
    return matching.length > 0 ? matching : products.slice(0, 10);
  }, [selectedCategoryId]);

  const handleAddToCart = (e: MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    showToast(`${product.title} added to cart!`);
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleWishlistToggle = (e: MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <section className="al-mobile-suggested-section" aria-label="Suggested products">
      {/* Header with Title and Arrow Link matching Flipkart reference */}
      <div className="al-mobile-suggested-header">
        <div className="al-mobile-suggested-title-wrap">
          <h2 className="al-mobile-suggested-title">Suggested For You</h2>
          <span className="al-mobile-suggested-subtitle">
            Handpicked recommendations based on trending items
          </span>
        </div>

        <Link
          href="/products"
          className="al-mobile-suggested-arrow-btn"
          aria-label="View all suggested products"
        >
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* 2-Column Responsive Mobile Grid */}
      <div className="al-mobile-products-grid">
        {filteredProducts.map((product) => {
          const isFavorited = isInWishlist(product.id);
          const isAdded = !!addedIds[product.id];
          const originalPrice =
            product.originalPrice ||
            (product.price > 75 ? Math.round(product.price * 1.25) : undefined);
          const discountPct =
            product.discountPercentage ||
            (originalPrice
              ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
              : 0);

          return (
            <div key={product.id} className="al-mobile-product-card">
              {/* Card Image Area */}
              <div className="al-mobile-card-img-wrap">
                <Link
                  href={`/products/${product.slug || product.id}`}
                  className="al-mobile-card-img-link"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="al-mobile-card-img"
                    loading="lazy"
                  />
                </Link>

                {/* Badges: Assured & Discount */}
                <div className="al-mobile-card-badges">
                  {product.isAssured !== false && (
                    <span className="al-mobile-badge-assured">
                      <ShieldCheck size={11} /> Assured
                    </span>
                  )}
                  {discountPct > 0 && (
                    <span className="al-mobile-badge-discount">
                      {discountPct}% OFF
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  className={`al-mobile-card-wishlist-btn ${isFavorited ? "active" : ""}`}
                  onClick={(e) => handleWishlistToggle(e, product)}
                  aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    size={16}
                    fill={isFavorited ? "#e11d48" : "none"}
                    color={isFavorited ? "#e11d48" : "#475569"}
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Card Details */}
              <div className="al-mobile-card-body">
                {/* Category & Rating */}
                <div className="al-mobile-card-meta">
                  <span className="al-mobile-card-cat-name">
                    {product.subCategory || product.categoryName || product.category}
                  </span>
                  <div className="al-mobile-card-rating">
                    <Star size={11} fill="#FF7A00" color="#FF7A00" />
                    <span>{(product.rating || 4.7).toFixed(1)}</span>
                  </div>
                </div>

                {/* Product Title */}
                <Link
                  href={`/products/${product.slug || product.id}`}
                  className="al-mobile-card-title-link"
                >
                  <h3 className="al-mobile-card-title" title={product.title}>
                    {product.title}
                  </h3>
                </Link>

                {/* Price & Add to Cart Bottom Row */}
                <div className="al-mobile-card-bottom-row">
                  <div className="al-mobile-card-price-group">
                    <span className="al-mobile-card-price">
                      ${product.price.toFixed(2)}
                    </span>
                    {originalPrice && originalPrice > product.price && (
                      <span className="al-mobile-card-orig-price">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`al-mobile-card-cart-btn ${isAdded ? "added" : ""}`}
                    onClick={(e) => handleAddToCart(e, product)}
                    aria-label="Add to cart"
                  >
                    {isAdded ? (
                      <Check size={16} strokeWidth={2.5} />
                    ) : (
                      <ShoppingCart size={15} strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
