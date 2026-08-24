"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Zap, 
  Check, 
  ShieldCheck, 
  Lock, 
  Truck, 
  Store, 
  RotateCcw, 
  Tag, 
  CreditCard, 
  RefreshCw,
  ChevronDown
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
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { openCart } = useUI();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    showToast("Added to cart");
    openCart();
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
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
          size={14}
          fill={isFilled ? "#F59E0B" : "none"}
          color={isFilled ? "#F59E0B" : "#D1D5DB"}
          className="star-icon"
        />
      );
    });
  };

  // Specific high quality bullet points
  const bulletPoints = product.specifications && product.specifications.length > 0 ? [
    { title: "Next-Gen Active Noise Canceling", text: "Block out unwanted background noise for an immersive listening experience." },
    { title: "40-Hour Battery Life", text: "Enjoy uninterrupted music playback all week on a single full charge." },
    { title: "Premium Studio Sound", text: "Custom-tuned 40mm drivers deliver deep bass and crystal-clear highs." },
    { title: "Ergonomic Comfort", text: "Memory foam ear cushions and an adjustable headband ensure all-day comfort." },
    { title: "Multi-Point Connection", text: "Seamlessly switch between your smartphone and laptop without missing a beat." }
  ] : [
    { title: "Premium Quality Construction", text: product.description },
    { title: "Engineered for Daily Performance", text: "Built to last with rigorous quality inspection and warranty." },
    { title: "Universal Compatibility", text: "Works seamlessly across iOS, Android, macOS, and Windows." }
  ];

  return (
    <div className="al-product-details-columns">
      {/* Center Column: Product Specs, Offers, Description */}
      <div className="al-center-product-info">
        {/* Category Tag */}
        <div className="al-brand-tag">
          AL-UMAIMA PREMIUM {product.categoryName?.toUpperCase() || "AUDIO"}
        </div>

        {/* Product Title */}
        <h1 className="al-product-title">{product.title}</h1>

        {/* Rating Line + Al-Umaima Assured Badge */}
        <div className="al-rating-assured-row">
          <div className="al-stars-container">
            {renderStars(product.rating)}
          </div>
          <span className="al-rating-val">{product.rating.toFixed(1)}</span>
          <span className="al-reviews-text">({product.reviewsCount || 128} reviews)</span>

          <div className="al-assured-pill">
            <ShieldCheck size={14} className="assured-shield" />
            <span>Al-Umaima Assured</span>
          </div>
        </div>

        {/* Price Block */}
        <div className="al-detail-price-block">
          <div className="al-price-row-main">
            <span className="al-current-price-red">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="al-original-price-gray">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="al-discount-tax-row">
            <span className="al-red-discount-pill">-{discountPercentage}% OFF</span>
            <span className="al-tax-note">Inclusive of all taxes</span>
          </div>
        </div>

        {/* Offers Card */}
        <div className="al-offers-card">
          <div className="al-offers-header">
            <Tag size={16} className="offers-tag-icon" />
            <span className="offers-title">Offers</span>
          </div>

          <div className="al-offers-list">
            <div className="al-offer-item">
              <CreditCard size={16} className="offer-icon" />
              <div>
                <strong className="offer-type">Bank Offer</strong>
                <p className="offer-desc">5% Instant Discount on Al-Umaima Axis Bank Credit Card</p>
              </div>
            </div>

            <div className="al-offer-item">
              <RefreshCw size={16} className="offer-icon" />
              <div>
                <strong className="offer-type">No Cost EMI</strong>
                <p className="offer-desc">
                  EMI starts at ${(product.price / 6).toFixed(2)}/month. No Cost EMI available.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About this item */}
        <div className="al-about-item-section">
          <h3 className="about-item-heading">About this item</h3>
          <ul className="about-item-bullets">
            {bulletPoints.map((item, idx) => (
              <li key={idx} className="about-bullet-li">
                <strong>{item.title}:</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column: Checkout / Buy Box */}
      <div className="al-right-buy-box">
        <div className="al-buy-box-card">
          {/* Price */}
          <div className="buy-box-price">${product.price.toFixed(2)}</div>

          {/* Delivery Details */}
          <div className="buy-box-delivery">
            <div className="delivery-free-line">
              <strong>FREE delivery</strong> Tomorrow, Oct 25.
            </div>
            <div className="delivery-timer-line">
              Order within <strong>4 hrs 38 mins.</strong>
            </div>
          </div>

          {/* In Stock */}
          <div className="buy-box-stock">
            <Check size={16} className="stock-check-icon" />
            <span className="stock-in-text">In Stock</span>
          </div>

          {/* Quantity Selector */}
          <div className="buy-box-qty-row">
            <label htmlFor="qty-select" className="qty-label">Quantity:</label>
            <div className="qty-select-wrapper">
              <select
                id="qty-select"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="qty-dropdown"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <ChevronDown size={14} className="qty-chevron" />
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            className={`buy-box-cart-btn ${isAdded ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {isAdded ? (
              <>
                <Check size={17} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={17} /> Add to Cart
              </>
            )}
          </button>

          {/* Buy Now Button */}
          <button
            type="button"
            className="buy-box-buy-now-btn"
            onClick={handleBuyNow}
          >
            <Zap size={17} /> Buy Now
          </button>

          {/* Trust Assurance List */}
          <div className="buy-box-trust-list">
            <div className="trust-list-item">
              <Lock size={15} className="trust-item-icon" />
              <span>Secure transaction</span>
            </div>
            <div className="trust-list-item">
              <Truck size={15} className="trust-item-icon" />
              <span>Ships from Al-Umaima Express</span>
            </div>
            <div className="trust-list-item">
              <Store size={15} className="trust-item-icon" />
              <span>Sold by Al-Umaima Retail</span>
            </div>
            <div className="trust-list-item">
              <RotateCcw size={15} className="trust-item-icon" />
              <span>30-day returns</span>
            </div>
          </div>

          {/* Add to Wishlist Button */}
          <button
            type="button"
            className={`buy-box-wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
            onClick={() => toggleWishlist(product)}
          >
            <Heart 
              size={16} 
              fill={isWishlisted ? "#dc2626" : "none"} 
              color={isWishlisted ? "#dc2626" : "#475569"} 
            />
            <span>{isWishlisted ? "In Wishlist" : "Add to Wishlist"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
