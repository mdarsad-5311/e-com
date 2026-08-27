"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Award, ArrowRight, Tag, Check, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCoupon } from "@/context/CouponContext";
import "@/styles/order-summary.css";

export default function OrderSummary() {
  const { totalItemsCount, subtotal } = useCart();
  const { appliedCoupon, couponError, couponSuccess, applyCoupon, removeCoupon, calculateDiscount } = useCoupon();
  const [promoInput, setPromoInput] = useState("");

  const discountAmount = calculateDiscount(subtotal);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const estimatedTax = discountedSubtotal * 0.08; // 8% tax
  const finalTotal = discountedSubtotal + estimatedTax;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyCoupon(promoInput, subtotal);
      setPromoInput("");
    }
  };

  return (
    <aside className="al-order-summary-card">
      <h2 className="al-summary-title">Order Summary</h2>

      {/* Breakdown Rows */}
      <div className="al-summary-rows">
        <div className="al-summary-row">
          <span className="al-summary-label">Subtotal ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
          <span className="al-summary-value">${subtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && appliedCoupon && (
          <div className="al-summary-row al-discount-row">
            <span className="al-summary-label">
              Promo ({appliedCoupon.code})
            </span>
            <span className="al-summary-value al-val-green">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="al-summary-row">
          <span className="al-summary-label">Estimated Tax (8%)</span>
          <span className="al-summary-value">${estimatedTax.toFixed(2)}</span>
        </div>

        <div className="al-summary-row">
          <span className="al-summary-label">Shipping</span>
          <span className="al-summary-value al-val-orange">FREE</span>
        </div>
      </div>

      {/* Promo Code Input Block */}
      <div className="al-promo-section">
        {appliedCoupon ? (
          <div className="al-applied-coupon-pill">
            <div className="al-coupon-pill-left">
              <Tag size={14} className="al-coupon-tag-icon" />
              <div>
                <strong>{appliedCoupon.code}</strong>
                <p>{appliedCoupon.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeCoupon}
              className="al-coupon-remove-btn"
              title="Remove promo code"
              aria-label="Remove promo code"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="al-promo-form">
            <div className="al-promo-input-wrap">
              <Tag size={14} className="al-promo-icon" />
              <input
                type="text"
                placeholder="Promo code (SAVE10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="al-promo-input"
                aria-label="Enter coupon code"
              />
            </div>
            <button type="submit" className="al-promo-btn">
              Apply
            </button>
          </form>
        )}

        {couponError && <p className="al-coupon-msg-error">{couponError}</p>}
        {couponSuccess && <p className="al-coupon-msg-success">{couponSuccess}</p>}
      </div>

      <div className="al-summary-divider" />

      {/* Total Row */}
      <div className="al-summary-total-row">
        <span className="al-total-text">Total</span>
        <span className="al-total-price">${finalTotal.toFixed(2)}</span>
      </div>

      {/* Proceed to Checkout CTA */}
      {totalItemsCount > 0 ? (
        <Link href="/checkout" className="al-checkout-cta-btn">
          <span>Proceed to Checkout</span>
          <ArrowRight size={18} />
        </Link>
      ) : (
        <button type="button" disabled className="al-checkout-cta-btn">
          <span>Proceed to Checkout</span>
          <ArrowRight size={18} />
        </button>
      )}

      {/* Trust & Guarantee Badges Matching Attachment */}
      <div className="al-summary-trust-badges">
        {/* Secure Checkout */}
        <div className="al-trust-badge al-trust-secure">
          <ShieldCheck size={20} className="al-trust-icon-blue" />
          <div className="al-trust-text-group">
            <span className="al-trust-name">Secure Checkout</span>
            <span className="al-trust-desc">256-bit SSL encryption</span>
          </div>
        </div>

        {/* Al-Umaima Assured */}
        <div className="al-trust-badge al-trust-assured">
          <Award size={20} className="al-trust-icon-orange" />
          <div className="al-trust-text-group">
            <span className="al-trust-name">Al-Umaima Assured</span>
            <span className="al-trust-desc">Premium Quality Guarantee</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
