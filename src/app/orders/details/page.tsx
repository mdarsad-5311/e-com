"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Check,
  Package,
  Truck,
  MapPin,
  CreditCard,
  FileText,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  ArrowLeft,
  HelpCircle,
  Circle,
  XCircle,
  Clock
} from "lucide-react";
import { api } from "@/lib/api";
import { OrderResponse } from "@/types/api";
import "@/styles/orders-page.css";
import "@/styles/order-detail.css";

function OrderDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || searchParams.get("orderId") || "1";

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  // Accordion state for mobile view
  const [openSection, setOpenSection] = useState<string | null>("summary");
  const toggleSection = (id: string) => setOpenSection(prev => prev === id ? null : id);

  // Fetch actual order details from backend
  useEffect(() => {
    let isMounted = true;

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get<OrderResponse>(`/api/orders/${orderId}/`);
        if (isMounted) {
          setOrder(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Unable to load order details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setIsCancelling(true);
      const res = await api.post(`/api/orders/${order.id}/cancel/`);
      if (res?.order) {
        setOrder(res.order);
      } else {
        setOrder((prev) => prev ? { ...prev, status: "cancelled", status_display: "Cancelled" } : null);
      }
      setCancelMessage("Order was cancelled successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 0", textAlign: "center", color: "var(--text-muted)" }}>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <XCircle size={44} style={{ color: "var(--error, #ef4444)", margin: "0 auto 1rem" }} />
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Order Not Found</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            {error || "We couldn't retrieve the details for this order."}
          </p>
          <Link href="/orders" className="btn btn-primary">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  // Calculated values
  const subtotalVal = Number(order.subtotal) || 0;
  const shippingVal = Number(order.shipping_cost) || 0;
  const taxVal = Number(order.tax_amount) || 0;
  const grandTotal = Number(order.total_amount || order.totalAmount) || (subtotalVal + shippingVal + taxVal);

  const orderNum = order.order_number || String(order.id);
  const placedDate = order.placed || order.date || (order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Recent");

  const statusLower = (order.status || "").toLowerCase();
  const trackNote = statusLower === "delivered" ? "Delivered" : statusLower === "shipped" ? "In Transit" : statusLower === "cancelled" ? "Cancelled" : "Processing";

  const timelineSteps = order.timeline || [
    { id: "ordered", label: "Order Placed", detail: placedDate, done: true, active: statusLower === "pending" },
    { id: "confirmed", label: "Order Confirmed", detail: "", done: ["confirmed", "processing", "shipped", "delivered"].includes(statusLower), active: statusLower === "confirmed" },
    { id: "processing", label: "Processing", detail: "", done: ["processing", "shipped", "delivered"].includes(statusLower), active: statusLower === "processing" },
    { id: "shipped", label: "Shipped", detail: "", done: ["shipped", "delivered"].includes(statusLower), active: statusLower === "shipped" },
    { id: "delivered", label: "Delivered", detail: "", done: statusLower === "delivered", active: statusLower === "delivered" },
  ];

  const address = order.shipping_address || {
    name: "Recipient",
    line1: order.shippingAddress || "Delivery Address",
    line2: "",
    cityStateZip: "",
    country: "United States",
    phone: "",
  };

  const paymentBrand = order.payment_method || "Credit Card";
  const canCancel = ["pending", "processing", "confirmed"].includes(statusLower);

  return (
    <div className="od-mobile-page">
      {/* MOBILE LAYOUT */}
      <div className="od-mob-layout">
        <div className="od-mob-top-bar">
          <Link href="/orders" className="od-mob-back-btn" aria-label="Back">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="od-mob-title">Order Details</h1>
        </div>

        <div className="od-mob-order-meta">
          <span className="od-mob-order-id">Order #{orderNum}</span>
          <span className="od-mob-eta-badge">{trackNote}</span>
        </div>

        {cancelMessage && (
          <div style={{ margin: "0.5rem 1rem", padding: "0.75rem", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "8px", fontSize: "0.85rem" }}>
            {cancelMessage}
          </div>
        )}

        {/* Track Package card */}
        <div className="od-mob-card">
          <div className="od-mob-map-header">Track Package</div>
          <div className="od-mob-map-placeholder">
            <div className="od-mob-map-bg">
              <div className="od-mob-map-route-line" />
              <div className="od-mob-map-dot od-mob-map-dot-start" />
              <div className="od-mob-map-dot od-mob-map-dot-truck">
                <Truck size={16} className="od-mob-truck-icon" />
              </div>
              <div className="od-mob-map-dot od-mob-map-dot-end" />
            </div>
          </div>
        </div>

        {/* Mobile Summary */}
        <div className="od-mob-card">
          <div className="od-mob-summary-row">
            <span>Items ({order.items?.length || 0}):</span>
            <span>${subtotalVal.toFixed(2)}</span>
          </div>
          <div className="od-mob-summary-row">
            <span>Shipping:</span>
            <span>{shippingVal > 0 ? `$${shippingVal.toFixed(2)}` : "Free"}</span>
          </div>
          <div className="od-mob-summary-row">
            <span>Tax:</span>
            <span>${taxVal.toFixed(2)}</span>
          </div>
          <div className="od-mob-summary-total-row">
            <span>Order Total:</span>
            <span className="od-mob-total-val">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {canCancel && (
          <div style={{ padding: "0 1rem" }}>
            <button
              type="button"
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="btn btn-outline"
              style={{ width: "100%", borderColor: "var(--error)", color: "var(--error)" }}
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="od-page od-desktop-layout">
        <div className="od-layout">
          <div className="od-breadcrumb">
            <Link href="/profile" className="od-bc-link">Your Account</Link>
            <ChevronRight size={13} className="od-bc-sep" />
            <Link href="/orders" className="od-bc-link">Your Orders</Link>
            <ChevronRight size={13} className="od-bc-sep" />
            <span className="od-bc-current">Order Details</span>
          </div>

          <div className="od-page-header">
            <div>
              <h1 className="od-page-title">Order Details</h1>
              <div className="od-page-meta">Order #{orderNum} &bull; Placed on {placedDate}</div>
            </div>
            {canCancel && (
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="od-invoice-btn"
                style={{ borderColor: "var(--error, #ef4444)", color: "var(--error, #ef4444)" }}
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>

          {cancelMessage && (
            <div style={{ marginBottom: "1.5rem", padding: "0.85rem 1.25rem", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "8px", border: "1px solid #10b981" }}>
              {cancelMessage}
            </div>
          )}

          <div className="od-main-grid">
            <div className="od-left-col">
              {/* Track Package Stepper */}
              <div className="od-card od-track-card">
                <div className="od-track-header">
                  <h2 className="od-track-title">Track Package</h2>
                  <span className="od-track-eta">{trackNote}</span>
                </div>
                <div className="od-stepper">
                  {timelineSteps.map((step, idx) => {
                    const isLast = idx === timelineSteps.length - 1;
                    return (
                      <div key={step.id} className="od-step-wrap">
                        <div className="od-step">
                          <div className={`od-step-node ${step.done ? "od-step-done" : ""} ${step.active ? "od-step-active" : ""}`}>
                            {step.done ? <Check size={14} strokeWidth={3} /> : <Package size={14} />}
                          </div>
                          <div className="od-step-label">{step.label}</div>
                          {step.detail && <div className="od-step-date">{step.detail}</div>}
                        </div>
                        {!isLast && <div className={`od-step-connector ${step.done ? "od-connector-done" : ""}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Card */}
              <div className="od-card od-items-card">
                <div className="od-items-header">
                  <h2 className="od-items-title">Items in this order</h2>
                  <span className="od-items-count">{order.items?.length || 0} items</span>
                </div>
                <div className="od-items-list">
                  {order.items && order.items.map((item, idx) => {
                    const itemUnitPrice = Number(item.price || item.unit_price) || 0;
                    const itemSubtotal = Number(item.subtotal) || (itemUnitPrice * item.qty);

                    return (
                      <div key={item.id} className={`od-item-row ${idx < order.items.length - 1 ? "od-item-divider" : ""}`}>
                        <div className="od-item-img-wrap">
                          {item.image || item.product_image_url ? (
                            <img src={item.image || item.product_image_url} alt={item.title || item.product_name} className="od-item-img" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }} />
                          ) : (
                            <div className="od-item-img-placeholder" />
                          )}
                        </div>
                        <div className="od-item-details">
                          <div className="od-item-title">{item.title || item.product_name}</div>
                          <div className="od-item-qty">Qty: {item.qty || item.quantity}</div>
                        </div>
                        <div className="od-item-right">
                          <div className="od-item-price">${itemSubtotal.toFixed(2)}</div>
                          <button type="button" className="od-buy-again-btn">Buy it again</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="od-right-col">
              <div className="od-card od-summary-card">
                <h2 className="od-summary-title">Order Summary</h2>
                <div className="od-summary-rows">
                  <div className="od-summary-row">
                    <span className="od-summary-label">Item(s) Subtotal:</span>
                    <span className="od-summary-val">${subtotalVal.toFixed(2)}</span>
                  </div>
                  <div className="od-summary-row">
                    <span className="od-summary-label">Shipping &amp; Handling:</span>
                    <span className="od-summary-val">{shippingVal > 0 ? `$${shippingVal.toFixed(2)}` : "$0.00"}</span>
                  </div>
                  <div className="od-summary-row od-summary-promo">
                    <span className="od-summary-label">Free Prime Shipping</span>
                  </div>
                  <div className="od-summary-row">
                    <span className="od-summary-label">Estimated tax:</span>
                    <span className="od-summary-val">${taxVal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="od-grand-total-row">
                  <span className="od-grand-label">Grand Total:</span>
                  <span className="od-grand-val">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="od-card od-addr-card">
                <div className="od-right-card-heading">
                  <MapPin size={15} className="od-right-card-icon" />Shipping Address
                </div>
                <div className="od-addr-block">
                  <div className="od-addr-name">{address.name}</div>
                  <div className="od-addr-line">{address.line1}</div>
                  {address.line2 && <div className="od-addr-line">{address.line2}</div>}
                  {address.cityStateZip && <div className="od-addr-line">{address.cityStateZip}</div>}
                  <div className="od-addr-line">{address.country}</div>
                  {address.phone && <div className="od-addr-line od-addr-phone">Phone: {address.phone}</div>}
                </div>
              </div>

              <div className="od-card od-payment-card">
                <div className="od-right-card-heading">
                  <CreditCard size={15} className="od-right-card-icon" />Payment Method
                </div>
                <div className="od-payment-row">
                  <span className="od-visa-pill">{paymentBrand.toUpperCase()}</span>
                  <span className="od-payment-desc">{paymentBrand}</span>
                </div>
                <div className="od-billing-note">Billing address matches shipping address.</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>Loading order details...</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}
