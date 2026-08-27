"use client";

import Link from "next/link";
import { ChevronRight, ShoppingBag, ArrowLeft, Trash2, Truck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import "@/styles/cart-page.css";

const FREE_SHIPPING_THRESHOLD = 150;

export default function CartPage() {
  const { cart, savedForLater, clearCart, totalItemsCount, subtotal } = useCart();

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const isFreeShippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="al-cart-page-wrapper">
      <div className="al-cart-main-container">
        {/* Cart Page Title */}
        <div className="al-cart-header-title-row">
          <h1 className="al-cart-main-heading">
            {cart.length > 0 ? `Your Cart (${totalItemsCount})` : "Your Cart"}
          </h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="al-clear-all-btn"
              title="Clear all items in cart"
            >
              <Trash2 size={15} /> Clear All
            </button>
          )}
        </div>

        {/* Dynamic Free Shipping Progress Card */}
        {cart.length > 0 && (
          <div className={`al-cart-shipping-card ${isFreeShippingUnlocked ? "unlocked" : ""}`}>
            <div className="al-cart-shipping-info">
              {isFreeShippingUnlocked ? (
                <div className="al-cart-shipping-badge-unlocked">
                  <CheckCircle2 size={18} />
                  <span>Congratulations! You qualify for <strong>FREE Express Delivery</strong>.</span>
                </div>
              ) : (
                <div className="al-cart-shipping-badge-locked">
                  <Truck size={18} />
                  <span>Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more to unlock <strong>FREE Express Delivery</strong>!</span>
                </div>
              )}
            </div>
            <div className="al-cart-progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`al-cart-progress-bar ${isFreeShippingUnlocked ? "unlocked" : ""}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Main Content Grid */}
        {cart.length > 0 || savedForLater.length > 0 ? (
          <div className="al-cart-grid">
            {/* Left Column: Cart Items & Saved For Later */}
            <div className="al-cart-items-section">
              {cart.length > 0 ? (
                <div className="al-cart-items-list">
                  {cart.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="al-cart-empty-banner">
                  <p>Your active shopping cart has no items.</p>
                </div>
              )}

              {/* Saved For Later Section */}
              {savedForLater.length > 0 && (
                <div className="al-saved-later-section">
                  <h2 className="al-saved-heading">
                    Saved for Later ({savedForLater.length} {savedForLater.length === 1 ? "item" : "items"})
                  </h2>
                  <div className="al-cart-items-list">
                    {savedForLater.map((item) => (
                      <CartItem key={`saved-${item.product.id}`} item={item} isSavedItem={true} />
                    ))}
                  </div>
                </div>
              )}

              <div className="al-continue-shopping-row">
                <Link href="/products" className="al-continue-link">
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar (Desktop) */}
            <div className="al-cart-summary-section al-cart-desktop-summary">
              <OrderSummary />
            </div>

            {/* Mobile Sticky Subtotal & Proceed to Checkout (Attachment 5) */}
            {cart.length > 0 && (
              <div className="al-mobile-cart-sticky-bar">
                <div className="al-mobile-cart-subtotal-row">
                  <span className="al-mobile-subtotal-label">Subtotal</span>
                  <span className="al-mobile-subtotal-val">${subtotal.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="al-mobile-btn-checkout">
                  Proceed to Checkout &rarr;
                </Link>
              </div>
            )}
          </div>
        ) : (

          /* Empty Cart State */
          <div className="al-empty-cart-view">
            <div className="al-empty-icon-circle">
              <ShoppingBag size={44} />
            </div>
            <h2 className="al-empty-title">Your Cart is Empty</h2>
            <p className="al-empty-desc">
              Looks like you haven&apos;t added any products to your shopping cart yet.
            </p>
            <Link href="/products" className="al-start-shopping-btn">
              Discover Popular Products <ChevronRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
