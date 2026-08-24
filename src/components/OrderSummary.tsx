"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Tag, ShieldCheck, Check, AlertCircle, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import "@/styles/order-summary.css";

export default function OrderSummary() {
  const router = useRouter();
  const { subtotal, totalItemsCount } = useCart();
  const [promoCode, setPromoCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>(null);
  const [promoError, setPromoError] = useState<string>("");

  const shippingCost = subtotal >= 100 || subtotal === 0 ? 0 : 15;
  const estimatedTax = subtotal * 0.08;
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  const handleApplyPromo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPromoError("");

    const code = promoCode.trim().toUpperCase();
    if (code === "AURA2026" || code === "AURA15") {
      const discount = subtotal * 0.15;
      setAppliedPromo({ code, discountAmount: discount });
    } else if (code === "WELCOME10") {
      setAppliedPromo({ code, discountAmount: 10 });
    } else {
      setPromoError("Invalid promo code. Try AURA2026 or WELCOME10.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const handleProceedCheckout = () => {
    router.push("/checkout");
  };

  return (
    <aside className="order-summary-card">
      <h2 className="summary-title">Order Summary</h2>
      <div className="summary-items-count">{totalItemsCount} item{totalItemsCount === 1 ? "" : "s"} selected</div>

      {/* Breakdown Rows */}
      <div className="summary-breakdown">
        <div className="summary-row">
          <span className="row-label">Subtotal</span>
          <span className="row-val">${subtotal.toFixed(2)}</span>
        </div>

        {appliedPromo && (
          <div className="summary-row promo-row">
            <span className="row-label flex-align">
              <Tag size={14} /> Coupon ({appliedPromo.code})
            </span>
            <span className="row-val promo-val">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="summary-row">
          <span className="row-label">Estimated Shipping</span>
          <span className="row-val">
            {shippingCost === 0 ? (
              <span className="free-shipping-tag">FREE</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="summary-row">
          <span className="row-label">Estimated Tax (8%)</span>
          <span className="row-val">${estimatedTax.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon Code Section */}
      <div className="promo-box">
        {appliedPromo ? (
          <div className="promo-applied">
            <span>Code <strong>{appliedPromo.code}</strong> applied!</span>
            <button onClick={handleRemovePromo} className="remove-promo-btn">Remove</button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="promo-form">
            <div className="promo-input-group">
              <Tag size={16} className="promo-icon" />
              <input
                type="text"
                placeholder="Coupon Code (AURA2026)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button type="submit" className="apply-btn">Apply</button>
            </div>
            {promoError && (
              <div className="promo-error flex-align">
                <AlertCircle size={14} /> {promoError}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Total Row */}
      <div className="summary-total-row">
        <span>Total</span>
        <span className="total-val">${grandTotal.toFixed(2)}</span>
      </div>

      {/* Checkout Button */}
      <button
        className="btn btn-primary checkout-btn"
        onClick={handleProceedCheckout}
        disabled={totalItemsCount === 0}
      >
        <Lock size={16} /> Proceed to Checkout <ArrowRight size={18} />
      </button>

      {/* Trust Badges */}
      <div className="summary-trust-perks">
        <div className="trust-item">
          <ShieldCheck size={16} className="trust-icon" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
        <div className="trust-item">
          <Check size={16} className="trust-icon" />
          <span>Free Returns & 30-Day Money Back</span>
        </div>
      </div>
    </aside>
  );
}
