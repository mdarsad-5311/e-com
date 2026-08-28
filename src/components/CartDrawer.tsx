"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight, Truck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import "@/styles/cart-drawer.css";

const FREE_SHIPPING_THRESHOLD = 150;

export default function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, totalItemsCount, subtotal } = useCart();
  const { isCartOpen, closeCart } = useUI();
  const drawerRef = useFocusTrap<HTMLElement>(isCartOpen, closeCart);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const isFreeShippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="drawer-backdrop" onClick={closeCart}>
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag Drawer"
      >
        {/* Header */}
        <header className="drawer-header">
          <div>
            <h2>Your Shopping Bag</h2>
            <p>{totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}</p>
          </div>
          <button 
            type="button"
            onClick={closeCart} 
            aria-label="Close shopping bag drawer" 
            className="drawer-close-btn"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* Dynamic Free Shipping Progress Bar */}
        <div className={`shipping-progress-banner ${isFreeShippingUnlocked ? "unlocked" : ""}`}>
          <div className="shipping-progress-text">
            {isFreeShippingUnlocked ? (
              <span className="shipping-unlocked-msg">
                <CheckCircle2 size={16} className="shipping-icon-success" aria-hidden="true" />
                <strong>Free Express Shipping unlocked!</strong>
              </span>
            ) : (
              <span className="shipping-locked-msg">
                <Truck size={16} className="shipping-icon-truck" aria-hidden="true" />
                Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for <strong>Free Express Shipping</strong>
              </span>
            )}
          </div>
          <div className="progress-track" role="progressbar" aria-label="Free shipping progress" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={`progress-fill ${isFreeShippingUnlocked ? "unlocked" : ""}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Drawer Body / Cart Items */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-drawer">
              <div className="empty-icon-box">
                <ShoppingBag size={40} aria-hidden="true" />
              </div>
              <h3>Your bag is empty</h3>
              <p>Explore our curated collections and add your favorite pieces.</p>
              <Link href="/products" className="btn btn-primary" onClick={closeCart}>
                Start Shopping
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="drawer-item">
                <div className="drawer-item-img-box">
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    width={76}
                    height={76}
                    className="drawer-item-img"
                  />
                </div>
                <div className="item-meta">
                  <Link href={`/products/${item.product.slug || item.product.id}`} onClick={closeCart} className="item-title">
                    {item.product.title}
                  </Link>
                  <div className="item-price-row">
                    <strong className="item-price">${item.product.price.toFixed(2)}</strong>
                    {item.quantity > 1 && (
                      <span className="item-unit-total">(${ (item.product.price * item.quantity).toFixed(2) })</span>
                    )}
                  </div>
                  <div className="qty-row">
                    <div className="qty-pill" role="group" aria-label={`Quantity selector for ${item.product.title}`}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.product.title}`}
                        className="qty-btn"
                      >
                        <Minus size={12} aria-hidden="true" />
                      </button>
                      <span className="qty-val" aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.product.title}`}
                        className="qty-btn"
                      >
                        <Plus size={12} aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label={`Remove ${item.product.title} from bag`}
                      title="Remove from bag"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <footer className="drawer-footer">
            <div className="subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <strong className="subtotal-amount">${subtotal.toFixed(2)}</strong>
            </div>
            <p className="tax-note">Taxes and shipping calculated at checkout</p>
            <Link href="/checkout" className="btn btn-primary full btn-checkout-drawer" onClick={closeCart}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/cart" className="btn btn-outline full btn-view-cart-drawer" onClick={closeCart}>
              View Full Cart & Save Items
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
