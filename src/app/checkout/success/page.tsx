"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Truck, ArrowRight } from "lucide-react";
import "@/styles/order-success.css";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read order details passed as query params from checkout
  const orderId = searchParams.get("orderId") || "AU-98241";
  const subtotal = parseFloat(searchParams.get("subtotal") || "145.00");
  const tax = subtotal * 0.085; // 8.5% tax
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;

  // Delivery window: today + 2 to today + 4 days
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 2);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 4);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="al-order-success-wrapper">
      {/* Animated Check Circle */}
      <div className="al-success-icon-circle">
        <CheckCircle2 size={40} className="al-success-check-icon" />
      </div>

      {/* Heading */}
      <h1 className="al-success-heading">Order Confirmed!</h1>
      <p className="al-success-subtext">
        Thank you for your purchase. Your order{" "}
        <span className="al-success-order-number">#{orderId}</span> has been placed successfully.
      </p>

      {/* Estimated Delivery Card */}
      <div className="al-success-delivery-card">
        <Truck size={26} className="al-success-truck-icon" />
        <div className="al-success-delivery-info">
          <span className="al-success-delivery-label">Estimated Delivery</span>
          <span className="al-success-delivery-date">
            {formatDate(deliveryStart)} – {formatDate(deliveryEnd)}
          </span>
        </div>
      </div>

      {/* Order Details */}
      <div className="al-success-order-details">
        <div className="al-success-order-details-title">ORDER DETAILS</div>
        <div className="al-success-detail-rows">
          <div className="al-success-detail-row">
            <span className="al-success-detail-label">Subtotal</span>
            <span className="al-success-detail-value">${subtotal.toFixed(2)}</span>
          </div>
          <div className="al-success-detail-row">
            <span className="al-success-detail-label">Shipping</span>
            <span className="al-success-detail-value free">Free</span>
          </div>
          <div className="al-success-detail-row">
            <span className="al-success-detail-label">Tax</span>
            <span className="al-success-detail-value">${tax.toFixed(2)}</span>
          </div>
          <div className="al-success-detail-row total-row">
            <span className="al-success-detail-label">Total</span>
            <span className="al-success-detail-value">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="al-success-actions">
        <Link href={`/track-order?orderId=${orderId}`} className="al-success-btn-track">
          Track Order <ArrowRight size={18} />
        </Link>
        <Link href="/" className="al-success-btn-continue">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="al-order-success-wrapper" style={{ textAlign: "center" }}>Loading confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

