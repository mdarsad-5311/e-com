"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Truck, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { OrderResponse } from "@/types/api";
import "@/styles/order-success.css";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read order details passed as query params from checkout
  const rawOrderId = searchParams.get("orderId") || "";
  const numericId = searchParams.get("id") || "";
  const initialSubtotal = parseFloat(searchParams.get("subtotal") || "0");
  const initialTotal = parseFloat(searchParams.get("total") || "0");

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [orderNumber, setOrderNumber] = useState(rawOrderId || "AU-98241");
  const [subtotal, setSubtotal] = useState(initialSubtotal > 0 ? initialSubtotal : 145.00);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(initialTotal > 0 ? initialTotal : (initialSubtotal > 0 ? initialSubtotal : 145.00));
  const [deliveryRange, setDeliveryRange] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    // Default delivery window calculation
    const today = new Date();
    const deliveryStart = new Date(today);
    deliveryStart.setDate(today.getDate() + 2);
    const deliveryEnd = new Date(today);
    deliveryEnd.setDate(today.getDate() + 4);

    const formatDate = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    setDeliveryRange(`${formatDate(deliveryStart)} — ${formatDate(deliveryEnd)}`);

    // Fetch actual backend order if id / orderId is provided
    const lookupId = numericId || (rawOrderId && !rawOrderId.startsWith("AU-") ? rawOrderId : "");
    if (lookupId) {
      api.get<OrderResponse>(`/api/orders/${lookupId}/`)
        .then((res) => {
          if (isMounted && res) {
            setOrder(res);
            setOrderNumber(res.order_number || String(res.id));
            const sub = Number(res.subtotal) || 0;
            const ship = Number(res.shipping_cost) || 0;
            const tx = Number(res.tax_amount) || 0;
            const tot = Number(res.total_amount) || (sub + ship + tx);

            setSubtotal(sub);
            setShipping(ship);
            setTax(tx);
            setTotal(tot);

            if (res.estimated_delivery) {
              try {
                const estDate = new Date(res.estimated_delivery);
                setDeliveryRange(formatDate(estDate));
              } catch {
                // ignore
              }
            }
          }
        })
        .catch(() => {
          // Keep query param values on network fallback
        });
    }

    return () => {
      isMounted = false;
    };
  }, [numericId, rawOrderId]);

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
        <span className="al-success-order-number">#{orderNumber}</span> has been placed successfully.
      </p>

      {/* Estimated Delivery Card */}
      <div className="al-success-delivery-card">
        <Truck size={26} className="al-success-truck-icon" />
        <div className="al-success-delivery-info">
          <span className="al-success-delivery-label">Estimated Delivery</span>
          <span className="al-success-delivery-date">
            {deliveryRange}
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
            <span className="al-success-detail-value free">{shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}</span>
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
        <Link href={`/track-order?orderId=${encodeURIComponent(orderNumber)}`} className="al-success-btn-track">
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
