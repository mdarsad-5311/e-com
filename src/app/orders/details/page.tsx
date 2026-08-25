"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";
import "@/styles/orders-page.css";
import "@/styles/order-detail.css";

const SAMPLE_ORDER = {
  id: "AU 9824 712",
  placed: "October 24, 2023",
  trackStatus: "out_for_delivery",
  trackNote: "Arriving Today",
  mapPlaceholder: true,
  timeline: [
    { id: "ordered",          label: "Order Placed",       detail: "Oct 12, 09:41 AM",        done: true,  active: false },
    { id: "shipped",          label: "Shipped",            detail: "Oct 13, 02:15 PM",        done: true,  active: false },
    { id: "out_for_delivery", label: "Out for Delivery",   detail: "Today, by 6:00 PM",       done: false, active: true,
      note: "Your package is with the courier and heading your way." },
    { id: "delivered",        label: "Delivered",          detail: "",                        done: false, active: false },
  ],
  summary: { subtotal: 348.00, shipping: 0.00, tax: 27.84 },
  items: [
    {
      id: "sony-wh-1000xm5",
      title: "Sony WH-1000XM5 Wireless Noise...",
      qty: 1,
      price: 348.00,
      image: "",
    },
  ],
  shippingAddress: {
    name: "Jane Doe",
    line1: "1234 Commerce Street",
    line2: "Apt 4B, Building C",
    cityStateZip: "Metropolis, NY 10001",
    country: "United States",
    phone: "+1 (555) 019 2837",
  },
  payment: { brand: "VISA", last4: "4242" },
};

export default function OrderDetailPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || SAMPLE_ORDER.id;
  const order = SAMPLE_ORDER;
  const grandTotal = order.summary.subtotal + order.summary.shipping + order.summary.tax;

  // Accordion state
  const [openSection, setOpenSection] = useState<string | null>("summary");
  const toggleSection = (id: string) => setOpenSection(prev => prev === id ? null : id);

  return (
    <div className="od-mobile-page">

      {/* ══════════════ MOBILE LAYOUT ══════════════ */}
      <div className="od-mob-layout">
        {/* Top bar */}
        <div className="od-mob-top-bar">
          <Link href="/orders" className="od-mob-back-btn" aria-label="Back">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="od-mob-title">Order Details</h1>
        </div>

        {/* Order ID + status */}
        <div className="od-mob-order-meta">
          <span className="od-mob-order-id">Order #{order.id}</span>
          <span className="od-mob-eta-badge">{order.trackNote}</span>
        </div>

        {/* Track Package map card */}
        <div className="od-mob-card">
          <div className="od-mob-map-header">Track Package</div>
          <div className="od-mob-map-placeholder">
            {/* Simulated map */}
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

        {/* Delivery Status — vertical timeline */}
        <div className="od-mob-card">
          <div className="od-mob-section-title">Delivery Status</div>
          <div className="od-mob-timeline">
            {order.timeline.map((step, idx) => (
              <div key={step.id} className="od-mob-timeline-item">
                {/* Connector + node */}
                <div className="od-mob-timeline-left">
                  {idx > 0 && (
                    <div className={`od-mob-timeline-connector ${step.done || step.active ? "od-mob-connector-done" : ""}`} />
                  )}
                  <div className={`od-mob-timeline-node ${step.done ? "od-mob-node-done" : ""} ${step.active ? "od-mob-node-active" : ""} ${!step.done && !step.active ? "od-mob-node-empty" : ""}`}>
                    {step.done && <Check size={13} strokeWidth={3} />}
                    {step.active && <div className="od-mob-node-spinner" />}
                  </div>
                </div>
                {/* Text */}
                <div className="od-mob-timeline-text">
                  <div className={`od-mob-timeline-label ${step.active ? "od-mob-timeline-label-active" : ""}`}>{step.label}</div>
                  {step.detail && <div className="od-mob-timeline-detail">{step.detail}</div>}
                  {step.note && <div className="od-mob-timeline-note">{step.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product row */}
        {order.items.map((item) => (
          <div key={item.id} className="od-mob-product-card">
            <div className="od-mob-product-img">
              <div className="od-item-img-placeholder" />
            </div>
            <div className="od-mob-product-info">
              <div className="od-mob-product-title">{item.title}</div>
              <div className="od-mob-product-qty">Qty: {item.qty}</div>
              <div className="od-mob-product-price">${item.price.toFixed(2)}</div>
            </div>
          </div>
        ))}

        {/* Accordion sections */}
        {/* Shipping Information */}
        <div className="od-mob-accordion">
          <button type="button" className="od-mob-accordion-trigger" onClick={() => toggleSection("shipping")}>
            <div className="od-mob-accordion-heading">
              <MapPin size={16} className="od-mob-accordion-icon" />
              Shipping Information
            </div>
            {openSection === "shipping" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSection === "shipping" && (
            <div className="od-mob-accordion-body">
              <div className="od-mob-addr-name">{order.shippingAddress.name}</div>
              <div className="od-mob-addr-line">{order.shippingAddress.line1}</div>
              <div className="od-mob-addr-line">{order.shippingAddress.line2}</div>
              <div className="od-mob-addr-line">{order.shippingAddress.cityStateZip}</div>
              <div className="od-mob-addr-line">{order.shippingAddress.country}</div>
              <div className="od-mob-addr-line">Phone: {order.shippingAddress.phone}</div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="od-mob-accordion">
          <button type="button" className="od-mob-accordion-trigger" onClick={() => toggleSection("payment")}>
            <div className="od-mob-accordion-heading">
              <CreditCard size={16} className="od-mob-accordion-icon" />
              Payment Method
            </div>
            {openSection === "payment" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSection === "payment" && (
            <div className="od-mob-accordion-body">
              <div className="od-mob-payment-row">
                <span className="od-visa-pill">{order.payment.brand}</span>
                <span>{order.payment.brand} ending in {order.payment.last4}</span>
              </div>
              <div className="od-mob-addr-line" style={{ marginTop: "0.35rem" }}>Billing address matches shipping address.</div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="od-mob-accordion">
          <button type="button" className="od-mob-accordion-trigger" onClick={() => toggleSection("summary")}>
            <div className="od-mob-accordion-heading">
              <FileText size={16} className="od-mob-accordion-icon" />
              Order Summary
            </div>
            {openSection === "summary" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSection === "summary" && (
            <div className="od-mob-accordion-body">
              <div className="od-mob-summary-row">
                <span>Items ({order.items.length}):</span>
                <span>${order.summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="od-mob-summary-row">
                <span>Shipping &amp; handling:</span>
                <span>${order.summary.shipping.toFixed(2)}</span>
              </div>
              <div className="od-mob-summary-row">
                <span>Tax:</span>
                <span>${order.summary.tax.toFixed(2)}</span>
              </div>
              <div className="od-mob-summary-total-row">
                <span>Order Total:</span>
                <span className="od-mob-total-val">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button type="button" className="od-mob-help-btn">
          <HelpCircle size={16} className="od-mob-help-icon" />
          Need Help with this Order?
        </button>
      </div>

      {/* ══════════════ DESKTOP LAYOUT ══════════════ */}
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
              <div className="od-page-meta">Order #{order.id} &bull; Placed on {order.placed}</div>
            </div>
            <button type="button" className="od-invoice-btn"><FileText size={15} />Invoice</button>
          </div>

          <div className="od-main-grid">
            <div className="od-left-col">
              {/* Track Package */}
              <div className="od-card od-track-card">
                <div className="od-track-header">
                  <h2 className="od-track-title">Track Package</h2>
                  <span className="od-track-eta">{order.trackNote}</span>
                </div>
                <div className="od-stepper">
                  {order.timeline.map((step, idx) => {
                    const isLast = idx === order.timeline.length - 1;
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
                {order.timeline.find(s => s.active)?.note && (
                  <div className="od-latest-update">
                    <Info size={15} className="od-info-icon" />
                    <div>
                      <div className="od-update-label">Latest Update</div>
                      <div className="od-update-text">{order.timeline.find(s => s.active)?.note}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="od-card od-items-card">
                <div className="od-items-header">
                  <h2 className="od-items-title">Items in this order</h2>
                  <span className="od-items-count">{order.items.length} items</span>
                </div>
                <div className="od-items-list">
                  {order.items.map((item, idx) => (
                    <div key={item.id} className={`od-item-row ${idx < order.items.length - 1 ? "od-item-divider" : ""}`}>
                      <div className="od-item-img-wrap"><div className="od-item-img-placeholder" /></div>
                      <div className="od-item-details">
                        <div className="od-item-title">{item.title}</div>
                        <div className="od-item-qty">Qty: {item.qty}</div>
                      </div>
                      <div className="od-item-right">
                        <div className="od-item-price">${item.price.toFixed(2)}</div>
                        <button type="button" className="od-buy-again-btn">Buy it again</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="od-right-col">
              <div className="od-card od-summary-card">
                <h2 className="od-summary-title">Order Summary</h2>
                <div className="od-summary-rows">
                  <div className="od-summary-row"><span className="od-summary-label">Item(s) Subtotal:</span><span className="od-summary-val">${order.summary.subtotal.toFixed(2)}</span></div>
                  <div className="od-summary-row"><span className="od-summary-label">Shipping &amp; Handling:</span><span className="od-summary-val">${order.summary.shipping.toFixed(2)}</span></div>
                  <div className="od-summary-row od-summary-promo"><span className="od-summary-label">Free Prime Shipping</span></div>
                  <div className="od-summary-row"><span className="od-summary-label">Estimated tax:</span><span className="od-summary-val">${order.summary.tax.toFixed(2)}</span></div>
                </div>
                <div className="od-grand-total-row">
                  <span className="od-grand-label">Grand Total:</span>
                  <span className="od-grand-val">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="od-card od-addr-card">
                <div className="od-right-card-heading"><MapPin size={15} className="od-right-card-icon" />Shipping Address</div>
                <div className="od-addr-block">
                  <div className="od-addr-name">{order.shippingAddress.name}</div>
                  <div className="od-addr-line">{order.shippingAddress.line1}</div>
                  <div className="od-addr-line">{order.shippingAddress.line2}</div>
                  <div className="od-addr-line">{order.shippingAddress.cityStateZip}</div>
                  <div className="od-addr-line">{order.shippingAddress.country}</div>
                  <div className="od-addr-line od-addr-phone">Phone: {order.shippingAddress.phone}</div>
                </div>
              </div>

              <div className="od-card od-payment-card">
                <div className="od-right-card-heading"><CreditCard size={15} className="od-right-card-icon" />Payment Method</div>
                <div className="od-payment-row">
                  <span className="od-visa-pill">{order.payment.brand}</span>
                  <span className="od-payment-desc">{order.payment.brand} ending in {order.payment.last4}</span>
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
