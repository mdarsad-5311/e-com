"use client";

import { useRouter } from "next/navigation";
import { Shield, RotateCcw, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import "@/styles/order-summary.css";

export default function OrderSummary() {
  const router = useRouter();
  const { totalItemsCount, subtotal, totalOriginalPrice, totalSavings } = useCart();

  const handlePlaceOrder = () => {
    router.push("/checkout");
  };

  return (
    <aside className="al-price-details-card">
      <h2 className="al-price-title">PRICE DETAILS</h2>

      {/* Breakdown Rows */}
      <div className="al-price-breakdown">
        <div className="al-price-row">
          <span className="al-row-label">Price ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
          <span className="al-row-val">AED {totalOriginalPrice.toLocaleString()}</span>
        </div>

        <div className="al-price-row">
          <span className="al-row-label">Discount</span>
          <span className="al-row-val al-val-green">-AED {totalSavings.toLocaleString()}</span>
        </div>

        <div className="al-price-row">
          <span className="al-row-label">Delivery Charges</span>
          <span className="al-row-val al-val-green">Free</span>
        </div>
      </div>

      {/* Dotted Divider & Total Amount */}
      <div className="al-total-row">
        <span className="al-total-label">Total Amount</span>
        <span className="al-total-val">AED {subtotal.toLocaleString()}</span>
      </div>

      {/* Savings Highlight Banner */}
      {totalSavings > 0 && (
        <div className="al-savings-banner">
          You will save AED {totalSavings.toLocaleString()} on this order
        </div>
      )}

      {/* Place Order CTA Button */}
      <button
        type="button"
        className="al-place-order-btn"
        onClick={handlePlaceOrder}
        disabled={totalItemsCount === 0}
      >
        Place Order <ArrowRight size={18} />
      </button>

      {/* Security & Return Trust Perks */}
      <div className="al-trust-perks-section">
        <div className="al-trust-item">
          <Shield size={20} className="al-trust-icon" />
          <div className="al-trust-texts">
            <span className="al-trust-heading">Safe and Secure Payments</span>
            <span className="al-trust-sub">256-Bit SSL Encryption applied to all transactions.</span>
          </div>
        </div>

        <div className="al-trust-item">
          <RotateCcw size={20} className="al-trust-icon" />
          <div className="al-trust-texts">
            <span className="al-trust-heading">Easy Returns</span>
            <span className="al-trust-sub">30-Day Hassle-free return policy.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
