"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  Tag, 
  CreditCard, 
  ShoppingCart,
  Droplets,
  Wind,
  Leaf,
  Zap,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import "@/styles/product-info.css";
import "@/styles/product-detail-extra.css";

interface ProductInfoProps {
  product: Product;
}

const SIZES = ["S", "M", "L", "XL"];

const TECH_SPECS = [
  {
    icon: <Droplets size={18} />,
    name: "Water Resistant",
    desc: "Treated with a highly durable DWR finish that repels light rain and spills without compromising breathability.",
  },
  {
    icon: <Wind size={18} />,
    name: "Breathable Core",
    desc: "Micro-perforated inner lining ensures optimal airflow, keeping you comfortable during active city commuting.",
  },
  {
    icon: <Leaf size={18} />,
    name: "Sustainable Materials",
    desc: "Constructed from 85% recycled nylon, reducing environmental impact while maintaining premium performance standards.",
  },
];

const MATERIAL_OPTIONS = [
  { id: "mesh", name: "Breathable Mesh", sub: "Optimal cooling" },
  { id: "leather", name: "Premium Leather", sub: "+$50 Executive feel" },
];

// Categories that show the fashion-style tech specs (single orange CTA)
const FASHION_CATEGORIES = ["fashion", "clothing", "apparel", "outerwear"];
// Categories that show material options (home goods / office chairs)
const HOME_OFFICE_CATEGORIES = ["home-goods", "office", "furniture", "chairs"];

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string>("Charcoal Gray");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("mesh");
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isOffersOpen, setIsOffersOpen] = useState<boolean>(false);
  const [isDescOpen, setIsDescOpen] = useState<boolean>(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    showToast(`${product.title} added to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push("/checkout");
  };

  const colorOptions = [
    { name: "Charcoal Gray", hex: "#4B5563" },
    { name: "Midnight Black", hex: "#111827" },
    { name: "Slate Navy", hex: "#1E3A5F" },
  ];

  const currentPrice = product.price || 295.00;
  const originalPrice = product.originalPrice || (currentPrice * 1.18);
  const savingsPct = product.discountPercentage || Math.round(((originalPrice - currentPrice) / originalPrice) * 100) || 14;

  const isFashion = FASHION_CATEGORIES.includes(product.category?.toLowerCase() || "");
  const isHomeOffice = HOME_OFFICE_CATEGORIES.some(c => (product.category?.toLowerCase() || "").includes(c));
  const showMaterialOptions = isHomeOffice || product.subCategory?.toLowerCase().includes("chair");

  // Determine if we're showing "home-style" (big $499 price with strikethrough) 
  const showBigPriceWithStrike = currentPrice >= 200;

  return (
    <div className="al-detail-info-wrapper">
      {/* Product Title */}
      <h1 className="al-detail-product-title">{product.title || "The Essential Minimalist Jacket"}</h1>

      {/* 5-Star Rating Row */}
      <div className="al-detail-rating-row">
        <div className="al-detail-stars">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={15}
              fill={index < Math.round(product.rating || 4.8) ? "#FF7A00" : "none"}
              color={index < Math.round(product.rating || 4.8) ? "#FF7A00" : "#CBD5E1"}
              className="al-detail-star"
            />
          ))}
        </div>
        <span className="al-detail-rating-text">
          {product.rating || 4.8} ({product.reviewsCount || 312} Reviews)
        </span>
      </div>

      {/* Description (below title on mobile – matching attachment 1) */}
      {product.description && (
        <p className="al-detail-inline-desc">{product.description}</p>
      )}

      {/* Pricing Row */}
      <div className="al-detail-price-main-row">
        <span className="al-detail-curr-price">${currentPrice.toFixed(2)}</span>
        {showBigPriceWithStrike && originalPrice > currentPrice && (
          <span className="al-detail-orig-price">${originalPrice.toFixed(2)}</span>
        )}
        {savingsPct > 0 && !showMaterialOptions && (
          <span className="al-detail-save-badge">{savingsPct}% OFF</span>
        )}
      </div>

      {/* Free Delivery Row */}
      <div className="al-detail-delivery-banner">
        <Truck size={16} className="al-delivery-truck-icon" />
        <span>
          {showMaterialOptions ? "Free White Glove Delivery included" : "Free delivery by Tomorrow, 9 AM"}
        </span>
      </div>

      {/* Color Swatches */}
      <div className="al-color-selector-block" role="radiogroup" aria-label="Select Color">
        <div className="al-color-label">
          <span>Color:</span>
          <strong>{selectedColor}</strong>
        </div>
        <div className="al-color-swatches">
          {colorOptions.map((c) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={selectedColor === c.name}
              onClick={() => setSelectedColor(c.name)}
              className={`al-swatch-circle ${selectedColor === c.name ? "active" : ""}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
              aria-label={`Color ${c.name}`}
            />
          ))}
        </div>
      </div>

      {/* Size Selector (for fashion / clothing) */}
      {(isFashion || !showMaterialOptions) && (
        <div className="al-detail-size-section" role="radiogroup" aria-label="Select Size">
          <div className="al-size-header-row">
            <span className="al-size-label">Size</span>
            <span className="al-size-guide-link">All Size Guide</span>
          </div>
          <div className="al-size-buttons">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={selectedSize === s}
                className={`al-size-btn ${selectedSize === s ? "active" : ""}`}
                onClick={() => setSelectedSize(s)}
                aria-label={`Size ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Material Options (for home/office products) */}
      {showMaterialOptions && (
        <div className="al-material-options-section" role="radiogroup" aria-label="Select Material">
          <div className="al-material-options-title">Material Options</div>
          <div className="al-material-options-grid">
            {MATERIAL_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={selectedMaterial === opt.id}
                className={`al-material-option-card ${selectedMaterial === opt.id ? "active" : ""}`}
                onClick={() => setSelectedMaterial(opt.id)}
              >
                <div className="al-material-radio-indicator" />
                <div className="al-material-info">
                  <div className="al-material-name">{opt.name}</div>
                  <div className="al-material-sub">{opt.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Technical Specifications (for fashion products) */}
      {!showMaterialOptions && (
        <div className="al-tech-specs-section">
          <div className="al-tech-specs-title">Technical Specifications</div>
          <div className="al-tech-specs-list">
            {TECH_SPECS.map(spec => (
              <div key={spec.name} className="al-tech-spec-card">
                <div className="al-tech-spec-icon-box">{spec.icon}</div>
                <div className="al-tech-spec-text">
                  <span className="al-tech-spec-name">{spec.name}</span>
                  <span className="al-tech-spec-desc">{spec.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accordion Sections */}
      <div className="al-detail-accordions">
        {/* Available Offers */}
        <div className="al-detail-accordion-item">
          <button 
            type="button" 
            className="al-accordion-toggle"
            onClick={() => setIsOffersOpen(!isOffersOpen)}
          >
            <div className="al-accordion-title-left">
              <Tag size={18} className="al-tag-icon-orange" />
              <span>Available Offers</span>
            </div>
            {isOffersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {isOffersOpen && (
            <div className="al-accordion-content">
              <div className="al-offer-row">
                <Tag size={15} className="al-offer-icon" />
                <span>Get 5% Instant Discount on Al-Umaima Platinum Card</span>
              </div>
              <div className="al-offer-row">
                <CreditCard size={15} className="al-offer-icon" />
                <span>No Cost EMI starts at ${(currentPrice / 6).toFixed(2)}/month</span>
              </div>
            </div>
          )}
        </div>

        {/* Description & Features */}
        <div className="al-detail-accordion-item">
          <button 
            type="button" 
            className="al-accordion-toggle"
            onClick={() => setIsDescOpen(!isDescOpen)}
          >
            <div className="al-accordion-title-left">
              <span>Description & Features</span>
            </div>
            {isDescOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {isDescOpen && (
            <div className="al-accordion-content">
              <p className="al-desc-paragraph">
                {product.description || "Engineered for the modern urban landscape. This jacket combines a sleek, understated silhouette with high-performance, weather-resistant technical fabric. Lightweight yet incredibly insulating."}
              </p>
              {product.specifications && product.specifications.length > 0 && (
                <ul className="al-features-bullet-list">
                  {product.specifications.map((spec, i) => (
                    <li key={i}>{spec}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Customer Reviews */}
        <div className="al-detail-accordion-item">
          <button 
            type="button" 
            className="al-accordion-toggle"
            onClick={() => setIsReviewsOpen(!isReviewsOpen)}
          >
            <div className="al-accordion-title-left">
              <span>Customer Reviews ({product.reviewsCount || 312})</span>
            </div>
            {isReviewsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {isReviewsOpen && (
            <div className="al-accordion-content">
              <div className="al-review-sample">
                <div className="al-sample-stars">★★★★★</div>
                <p>&ldquo;Exceptional quality and a perfect fit. The material is exactly as described — premium and long-lasting.&rdquo;</p>
                <span>— Verified Buyer</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Action CTA Buttons */}
      <div className="al-detail-desktop-cta">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`al-detail-btn-cart ${isAdded ? "added" : ""}`}
        >
          <ShoppingCart size={18} />
          <span>{isAdded ? "Added to Cart" : "Add to Cart"}</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="al-detail-btn-buy"
        >
          <Zap size={18} />
          <span>Buy Now</span>
        </button>
      </div>

      {/* Mobile: Single Full-Width Orange "Add to Cart" button */}
      <div className="al-mobile-sticky-action-bar--single">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`al-mobile-btn-add-full ${isAdded ? "added" : ""}`}
        >
          <ShoppingCart size={18} />
          <span>{isAdded ? "Added to Cart!" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}
