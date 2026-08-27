"use client";

import Link from "next/link";
import { ShieldCheck, Award, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import "@/styles/order-summary.css";

export default function OrderSummary() {
  const { totalItemsCount, subtotal } = useCart();

  const estimatedTax = subtotal * 0.08; // 8% tax
  const finalTotal = subtotal + estimatedTax;

  return (
    <aside className="al-order-summary-card">
      <h2 className="al-summary-title">Order Summary</h2>

      {/* Breakdown Rows */}
      <div className="al-summary-rows">
        <div className="al-summary-row">
          <span className="al-summary-label">Subtotal ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
          <span className="al-summary-value">${subtotal.toFixed(2)}</span>
        </div>

        <div className="al-summary-row">
          <span className="al-summary-label">Estimated Tax</span>
          <span className="al-summary-value">${estimatedTax.toFixed(2)}</span>
        </div>

        <div className="al-summary-row">
          <span className="al-summary-label">Shipping</span>
          <span className="al-summary-value al-val-orange">FREE</span>
        </div>
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
