"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType, useCart } from "@/context/CartContext";
import SafeImage from "@/components/SafeImage";
import "@/styles/cart-item.css";

interface CartItemProps {
  item: CartItemType;
  isSavedItem?: boolean;
}

export default function CartItem({ item, isSavedItem = false }: CartItemProps) {
  const { updateQuantity, removeFromCart, moveToCart } = useCart();
  const { product, quantity } = item;

  return (
    <div className="al-cart-card">
      {/* Product Image on Left (Attachment 3) */}
      <Link href={`/products/${product.slug || product.id}`} className="al-cart-img-box">
        <SafeImage
          src={product.image}
          alt={product.title}
          className="al-cart-product-img"
        />
      </Link>

      {/* Product Info & Controls */}
      <div className="al-cart-content-box">
        {/* Top Row: Title on Left, Trash Button on Top Right (Attachment 3) */}
        <div className="al-cart-top-row">
          <Link href={`/products/${product.slug || product.id}`} className="al-cart-title-link">
            <h3 className="al-cart-item-heading">{product.title}</h3>
          </Link>

          <button
            type="button"
            onClick={() => removeFromCart(product.id)}
            className="al-cart-trash-btn"
            title="Remove item"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Orange Price */}
        <span className="al-cart-item-price-orange">${product.price.toFixed(2)}</span>

        {/* Bottom Row: Stepper Control (Attachment 3) */}
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
        </div>
      </div>
    </div>
  );
}
