"use client";

import Link from "next/link";
import { Minus, Plus, Heart, Trash2 } from "lucide-react";
import { CartItem as CartItemType, useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import SafeImage from "@/components/SafeImage";
import "@/styles/cart-item.css";

interface CartItemProps {
  item: CartItemType;
  isSavedItem?: boolean;
}

export default function CartItem({ item, isSavedItem = false }: CartItemProps) {
  const { updateQuantity, removeFromCart, saveForLater, moveToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { product, quantity } = item;

  const isFavorited = isInWishlist(product.id);

  const handleSaveForLater = () => {
    toggleWishlist(product);
    showToast(isFavorited ? "Removed from Wishlist" : "Saved to Wishlist");
  };

  const getSubtitle = () => {
    if (product.id.includes("headphone") || product.title.toLowerCase().includes("headphone")) {
      return "Matte Black • Wireless • Over-ear";
    }
    if (product.id.includes("hub") || product.title.toLowerCase().includes("hub") || product.title.toLowerCase().includes("home")) {
      return "Silver • Smart Display";
    }
    return product.description?.slice(0, 45) || "Premium Wireless Device";
  };

  return (
    <div className="al-cart-card">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="al-cart-img-box">
        <SafeImage
          src={product.image}
          alt={product.title}
          className="al-cart-product-img"
        />
      </Link>

      {/* Product Information */}
      <div className="al-cart-content-box">
        {/* Top Info & Price */}
        <div className="al-cart-top-row">
          <div className="al-cart-info-main">
            <Link href={`/products/${product.id}`} className="al-cart-title-link">
              <h3 className="al-cart-item-heading">{product.title}</h3>
            </Link>
            <p className="al-cart-item-specs">{getSubtitle()}</p>
          </div>

          <span className="al-cart-item-price">${product.price.toFixed(2)}</span>
        </div>

        {/* Bottom Row: Stepper on Left, Save & Remove on Right */}
        <div className="al-cart-bottom-row">
          {!isSavedItem ? (
            <div className="al-cart-stepper-box">
              <button
                type="button"
                className="al-stepper-control"
                onClick={() => updateQuantity(product.id, quantity - 1)}
                title="Decrease quantity"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="al-stepper-count">{quantity}</span>
              <button
                type="button"
                className="al-stepper-control"
                onClick={() => updateQuantity(product.id, quantity + 1)}
                title="Increase quantity"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => moveToCart(product.id)}
              className="al-cart-link-btn"
            >
              Move to cart
            </button>
          )}

          <div className="al-cart-item-actions">
            <button
              type="button"
              onClick={handleSaveForLater}
              className={`al-cart-action-pill ${isFavorited ? "saved" : ""}`}
            >
              <Heart size={14} fill={isFavorited ? "#FF7A00" : "none"} color={isFavorited ? "#FF7A00" : "#64748b"} />
              <span>Save</span>
            </button>

            <button
              type="button"
              onClick={() => removeFromCart(product.id)}
              className="al-cart-action-pill remove-pill"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
