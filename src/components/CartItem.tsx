"use client";

import Link from "next/link";
import { Minus, Plus, CheckCircle2 } from "lucide-react";
import { CartItem as CartItemType, useCart } from "@/context/CartContext";
import SafeImage from "@/components/SafeImage";
import "@/styles/cart-item.css";

interface CartItemProps {
  item: CartItemType;
  isSavedItem?: boolean;
}

export default function CartItem({ item, isSavedItem = false }: CartItemProps) {
  const { updateQuantity, removeFromCart, saveForLater, moveToCart, removeFromSaved } = useCart();
  const { product, quantity } = item;

  return (
    <div className="al-cart-item-card">
      {/* Product Image Frame */}
      <Link href={`/products/${product.id}`} className="al-cart-img-wrap">
        <SafeImage
          src={product.image}
          alt={product.title}
          className="al-cart-img"
        />
      </Link>

      {/* Product Details & Actions */}
      <div className="al-cart-info-col">
        <div className="al-cart-title-price-row">
          <Link href={`/products/${product.id}`} className="al-cart-title-link">
            <h3 className="al-cart-item-title">{product.title}</h3>
          </Link>
          <div className="al-cart-price-block">
            <span className="al-cart-curr-price">AED {product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <s className="al-cart-orig-price">AED {product.originalPrice.toLocaleString()}</s>
            )}
          </div>
        </div>

        {/* Stock & Shipping Badges */}
        <div className="al-cart-badges-row">
          <span className="al-stock-status">
            <CheckCircle2 size={14} className="al-check-icon" /> In Stock
          </span>
          <span className="al-shipping-eligibility">Eligible for FREE Shipping</span>
        </div>

        {/* Bottom Actions: Stepper + Save for Later / Remove */}
        <div className="al-cart-actions-row">
          {!isSavedItem ? (
            <div className="al-cart-stepper">
              <button
                type="button"
                className="al-stepper-btn"
                onClick={() => updateQuantity(product.id, quantity - 1)}
                title="Decrease quantity"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="al-stepper-value">{quantity}</span>
              <button
                type="button"
                className="al-stepper-btn"
                onClick={() => updateQuantity(product.id, quantity + 1)}
                disabled={quantity >= (product.stock || 20)}
                title="Increase quantity"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : null}

          <div className="al-cart-links-group">
            {!isSavedItem ? (
              <>
                <button
                  type="button"
                  onClick={() => saveForLater(product.id)}
                  className="al-cart-action-link save-link"
                >
                  Save for later
                </button>
                <span className="al-action-divider">|</span>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  className="al-cart-action-link remove-link"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => moveToCart(product.id)}
                  className="al-cart-action-link move-link"
                >
                  Move to cart
                </button>
                <span className="al-action-divider">|</span>
                <button
                  type="button"
                  onClick={() => removeFromSaved(product.id)}
                  className="al-cart-action-link remove-link"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
