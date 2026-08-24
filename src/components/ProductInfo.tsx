"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Minus, 
  Plus, 
  Sparkles,
  Zap
} from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useUI } from "@/context/UIContext";
import "@/styles/product-info.css";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { openCart } = useUI();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    showToast("Added to bag");
    openCart();
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQty = () => {
    if (quantity < (product.stock || 20)) setQuantity(quantity + 1);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-info-white-card">
      {/* Category & Rating Bar */}
      <div className="info-header-row">
        <span className="category-tag-pill">{product.categoryName}</span>
        <div className="rating-summary-pill">
          <Star size={15} fill="#F59E0B" color="#F59E0B" />
          <span className="rating-score">{product.rating.toFixed(1)}</span>
          <span className="reviews-count">({product.reviewsCount} verified reviews)</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="product-info-title">{product.title}</h1>
      {product.brand && <p className="brand-line">Brand: <strong>{product.brand}</strong></p>}

      {/* Price & Discount Bar */}
      <div className="price-container">
        <div className="price-main">${product.price.toFixed(2)}</div>
        {product.originalPrice && (
          <>
            <div className="price-original">${product.originalPrice.toFixed(2)}</div>
            <span className="discount-tag">Save {discountPercentage}%</span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="stock-indicator">
        <span className="stock-dot"></span>
        <span className="stock-text">
          In Stock ({product.stock || 15} units available — Express Shipping)
        </span>
      </div>

      {/* Description */}
      <p className="product-info-description">{product.description}</p>

      {product.colors && product.colors.length > 0 && (
        <div className="color-picker">
          <div className="qty-label">Color: {selectedColor}</div>
          <div className="color-row">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-chip ${selectedColor === color ? "active" : ""}`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="specs-box">
          <h4 className="specs-title">Key Specifications & Features:</h4>
          <ul className="specs-list">
            {product.specifications.map((spec, idx) => (
              <li key={idx} className="spec-item">
                <Sparkles size={14} className="spec-icon" />
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quantity & Action Controls */}
      <div className="action-rows-group">
        <div className="qty-row">
          <label className="qty-label">Quantity:</label>
          <div className="quantity-selector">
            <button className="qty-btn" onClick={handleDecreaseQty} disabled={quantity <= 1}>
              <Minus size={14} />
            </button>
            <span className="qty-value">{quantity}</span>
            <button className="qty-btn" onClick={handleIncreaseQty} disabled={quantity >= (product.stock || 20)}>
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="cta-buttons-row">
          <button
            className={`btn btn-primary cta-btn-spec ${isAdded ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {isAdded ? (
              <>
                <Check size={18} /> Added to Cart ({quantity})
              </>
            ) : (
              <>
                <ShoppingBag size={18} /> Add to Cart
              </>
            )}
          </button>

          <button className="btn btn-secondary cta-btn-spec buy-now-btn" onClick={handleBuyNow}>
            <Zap size={18} /> Buy Now
          </button>

          <button
            className={`wishlist-icon-btn ${isWishlisted ? "active" : ""}`}
            onClick={() => toggleWishlist(product)}
            title="Save to Wishlist"
          >
            <Heart size={20} fill={isWishlisted ? "#EF4444" : "none"} color={isWishlisted ? "#EF4444" : "#6B7280"} />
          </button>
        </div>
      </div>

      {/* Trust Guarantee Cards */}
      <div className="perks-grid">
        <div className="perk-card">
          <Truck size={18} className="perk-icon" />
          <div>
            <div className="perk-title">Free Express Shipping</div>
            <div className="perk-sub">Over $100 orders</div>
          </div>
        </div>

        <div className="perk-card">
          <RotateCcw size={18} className="perk-icon" />
          <div>
            <div className="perk-title">30-Day Money Back</div>
            <div className="perk-sub">100% full refund</div>
          </div>
        </div>

        <div className="perk-card">
          <ShieldCheck size={18} className="perk-icon" />
          <div>
            <div className="perk-title">2-Year Official Warranty</div>
            <div className="perk-sub">Full brand coverage</div>
          </div>
        </div>
      </div>
    </div>
  );
}
