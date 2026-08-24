"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType, useCart } from "@/context/CartContext";
import "@/styles/cart-item.css";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const itemSubtotal = product.price * quantity;

  return (
    <div className="cart-item-card glass-card">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="cart-item-image-link">
        <img src={product.image} alt={product.title} className="cart-item-image" />
      </Link>

      {/* Product Info */}
      <div className="cart-item-details">
        <span className="cart-item-category">{product.categoryName}</span>
        <Link href={`/products/${product.id}`} className="cart-item-title-link">
          <h3 className="cart-item-title">{product.title}</h3>
        </Link>
        <div className="cart-item-unit-price">${product.price.toFixed(2)} / unit</div>
      </div>

      {/* Quantity Controller */}
      <div className="cart-item-qty-col">
        <div className="qty-control-box">
          <button
            className="qty-action-btn"
            onClick={() => updateQuantity(product.id, quantity - 1)}
            title="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="qty-count-text">{quantity}</span>
          <button
            className="qty-action-btn"
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={quantity >= (product.stock || 20)}
            title="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Line Item Total & Remove Button */}
      <div className="cart-item-price-col">
        <div className="cart-item-total-price">${itemSubtotal.toFixed(2)}</div>
        <button
          className="remove-item-btn"
          onClick={() => removeFromCart(product.id)}
          title="Remove from cart"
        >
          <Trash2 size={16} /> Remove
        </button>
      </div>
    </div>
  );
}
