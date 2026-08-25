"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Tag, 
  CreditCard, 
  Lock, 
  Store, 
  RotateCcw, 
  Heart, 
  ChevronDown,
  Check
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
  const [selectedColor, setSelectedColor] = useState<string>("Matte Black");
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
    showToast(`${product.title} added to cart`);
    openCart();
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  // Price formatting
  const priceParts = product.price.toFixed(2).split(".");
  const dollars = priceParts[0];
  const cents = priceParts[1] || "00";

  const originalPriceVal = product.originalPrice || (product.price + 50);
  const savingsVal = (originalPriceVal - product.price).toFixed(2);
  const discountPct = product.discountPercentage || Math.round(((originalPriceVal - product.price) / originalPriceVal) * 100);

  // Render 5 stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => {
      const isFilled = index < Math.floor(rating || 5);
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

  // Color options
  const colorOptions = [
    { name: "Matte Black", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80" },
    { name: "Silver White", img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=120&q=80" },
    { name: "Midnight Navy", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=120&q=80" }
  ];

  // Specific high quality bullet points matching attachment
  const bulletPoints = [
    { 
      title: "Industry-Leading ANC", 
      text: "Block out distractions with advanced active noise cancellation that adapts to your environment." 
    },
    { 
      title: "Immersive Audio", 
      text: "Custom 40mm drivers deliver high-fidelity sound with deep bass and crisp highs." 
    },
    { 
      title: "30-Hour Battery Life", 
      text: "Enjoy uninterrupted listening all day, with a quick 10-minute charge providing 5 hours of playback." 
    },
    { 
      title: "Multipoint Connectivity", 
      text: "Seamlessly switch between two Bluetooth devices without reconnecting." 
    },
    { 
      title: "All-Day Comfort", 
      text: "Memory foam earcups and a lightweight headband design ensure maximum comfort during extended wear." 
    }
  ];

  return (
    <div className="al-product-details-columns">
      {/* Center Column: Product Specs, Offers, Description */}
      <div className="al-center-product-info">
        {/* Brand Tag + Assured Badge */}
        <div className="al-brand-assured-row">
          <span className="al-brand-title-badge">
            {product.brand?.toUpperCase() || "AURA AUDIO"}
          </span>
          <div className="al-assured-pill">
            <ShieldCheck size={13} className="assured-shield" />
            <span>Al-Umaima Assured</span>
          </div>
        </div>

        {/* Product Title */}
        <h1 className="al-product-title">{product.title}</h1>

        {/* Rating Line */}
        <div className="al-rating-row">
          <div className="al-stars-container">
            {renderStars(product.rating)}
          </div>
          <button type="button" className="al-ratings-link">
            {(product.reviewsCount || 4821).toLocaleString()} ratings
          </button>
        </div>

        {/* Price Block */}
        <div className="al-detail-price-block">
          <div className="al-price-row-main">
            <span className="al-price-currency">$</span>
            <span className="al-current-price-red">{dollars}</span>
            <span className="al-price-cents">{cents}</span>
          </div>

          <div className="al-savings-row">
            <span className="al-original-price-gray">${originalPriceVal.toFixed(2)}</span>
            <span className="al-save-highlight">You save ${savingsVal} ({discountPct}%)</span>
          </div>
        </div>

        {/* Delivery Box */}
        <div className="al-delivery-card">
          <div className="al-del-row-main">
            <Truck size={17} className="al-del-icon" />
            <div className="al-del-content">
              <div>
                <strong>FREE Delivery</strong> Tomorrow, Oct 24
              </div>
              <div className="al-del-timer">
                Order within <strong>5 hrs 30 mins</strong>
              </div>
            </div>
          </div>

          <div className="al-del-location-row">
            <MapPin size={15} className="al-del-pin" />
            <span className="al-del-location-link">Deliver to New York 10001</span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="al-stock-status-line">
          In Stock
        </div>

        {/* Color Selector */}
        <div className="al-color-selector-section">
          <div className="al-color-label-row">
            <span className="al-color-label-title">Color:</span>
            <span className="al-color-label-val">{selectedColor}</span>
          </div>

          <div className="al-color-thumbnails-row">
            {colorOptions.map((opt) => (
              <button
                key={opt.name}
                type="button"
                className={`al-color-thumb-box ${selectedColor === opt.name ? "active" : ""}`}
                onClick={() => setSelectedColor(opt.name)}
                title={opt.name}
              >
                <img src={opt.img} alt={opt.name} className="al-color-thumb-img" />
              </button>
            ))}
          </div>
        </div>

        {/* Available Offers */}
        <div className="al-offers-card">
          <h2 className="al-offers-heading">Available Offers</h2>

          <div className="al-offers-list">
            <div className="al-offer-item">
              <Tag size={17} className="offer-tag-icon" />
              <div>
                <strong className="offer-type">Bank Offer</strong>
                <p className="offer-desc">
                  5% Unlimited Cashback on Al-Umaima Axis Bank Credit Card.
                </p>
              </div>
            </div>

            <div className="al-offer-item">
              <CreditCard size={17} className="offer-card-icon" />
              <div>
                <strong className="offer-type">No Cost EMI</strong>
                <p className="offer-desc">
                  Available on orders above $3,000.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About this item */}
        <div className="al-about-item-section">
          <h2 className="about-item-heading">About this item</h2>
          <ul className="about-item-bullets">
            {bulletPoints.map((item, idx) => (
              <li key={idx} className="about-bullet-li">
                <strong>{item.title}:</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column (Desktop Buy Box) */}
      <div className="al-right-buy-box">
        <div className="al-buy-box-card">
          <div className="buy-box-price">${product.price.toFixed(2)}</div>

          <div className="buy-box-delivery">
            <div className="delivery-free-line">
              <strong>FREE delivery</strong> Tomorrow, Oct 24.
            </div>
            <div className="delivery-timer-line">
              Order within <strong>5 hrs 30 mins.</strong>
            </div>
          </div>

          <div className="buy-box-stock">
            <Check size={16} className="stock-check-icon" />
            <span className="stock-in-text">In Stock</span>
          </div>

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

          <button
            type="button"
            className={`buy-box-cart-btn ${isAdded ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {isAdded ? "Added to Cart" : "Add to Cart"}
          </button>

          <button
            type="button"
            className="buy-box-buy-now-btn"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>

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

      {/* Mobile Fixed Sticky Bottom Action Bar */}
      <div className="al-mobile-bottom-actions">
        <button
          type="button"
          className="al-mobile-add-cart-btn"
          onClick={handleAddToCart}
        >
          {isAdded ? "Added" : "Add to Cart"}
        </button>

        <button
          type="button"
          className="al-mobile-buy-now-btn"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
