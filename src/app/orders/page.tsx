"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Download, 
  ArrowLeft, 
  ShoppingBag,
  Star,
  XCircle,
  FileText,
  HelpCircle
} from "lucide-react";
import { useAuth, UserOrder } from "@/context/AuthContext";
import "@/styles/orders-page.css";

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useAuth();

  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<UserOrder | null>(null);
  const [reviewModalItem, setReviewModalItem] = useState<{ id: string; title: string } | null>(null);
  const [reviewStars, setReviewStars] = useState<number>(5);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = 
      activeStatusFilter === "ALL" 
        ? true 
        : order.status.toUpperCase().replace(/\s+/g, "_") === activeStatusFilter;

    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const handleCancelOrder = (orderId: string) => {
    if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
      updateOrderStatus(orderId, "Cancelled");
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalItem(null);
    }, 2000);
  };

  return (
    <div className="orders-page-root">
      <div style={{ backgroundColor: "#F1F3F6", minHeight: "85vh", paddingBottom: "3rem" }}>
        <div className="container py-8">
          {/* Header row */}
          <div className="orders-header-row">
            <div>
              <Link href="/profile" className="back-link">
                <ArrowLeft size={16} /> Back to Flipkart Account
              </Link>
              <h1 className="page-title">My Orders</h1>
              <p className="page-subtitle">Track shipment, download tax invoice, rate items or request return</p>
            </div>

            <Link href="/products" className="flipkart-btn-orange" style={{ height: 40, width: "auto", padding: "0 1.25rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <ShoppingBag size={16} /> CONTINUE SHOPPING
            </Link>
          </div>

          {/* Flipkart Search Bar & Status Filter Strip */}
          <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem", borderRadius: 2 }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              {/* Search Box */}
              <div style={{ flex: 1, minWidth: 280, position: "relative", display: "flex" }}>
                <input
                  type="text"
                  placeholder="Search your orders by product title or Order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "2px 0 0 2px" }}
                />
                <button 
                  className="flipkart-btn-orange" 
                  style={{ width: "auto", padding: "0 1.25rem", height: 42, borderRadius: "0 2px 2px 0" }}
                >
                  <Search size={18} />
                </button>
              </div>

              {/* Status Filters */}
              <div className="tab-filters">
                {[
                  { id: "ALL", label: "All Orders" },
                  { id: "ON_THE_WAY", label: "On The Way" },
                  { id: "DELIVERED", label: "Delivered" },
                  { id: "CANCELLED", label: "Cancelled" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-filter-btn ${activeStatusFilter === tab.id ? "active" : ""}`}
                    onClick={() => setActiveStatusFilter(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders Stack */}
          {filteredOrders.length === 0 ? (
            <div className="empty-orders-card card" style={{ borderRadius: 2 }}>
              <Package size={56} className="empty-icon" />
              <h2>No Matching Orders Found</h2>
              <p>We couldn&apos;t find any orders matching your search or filters.</p>
              <Link href="/products" className="flipkart-btn-orange" style={{ width: "auto", display: "inline-flex", margin: "1.5rem auto 0 auto" }}>
                Explore Flipkart Catalog
              </Link>
            </div>
          ) : (
            <div className="orders-stack">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card card" style={{ borderRadius: 2 }}>
                  {/* Order Top Meta Strip */}
                  <div className="order-card-header">
                    <div className="order-meta">
                      <div className="meta-block">
                        <span className="label">ORDER ID</span>
                        <span className="value" style={{ color: "#2874F0" }}>{order.id}</span>
                      </div>
                      <div className="meta-block">
                        <span className="label">DATE PLACED</span>
                        <span className="value">{order.date}</span>
                      </div>
                      <div className="meta-block">
                        <span className="label">TOTAL AMOUNT</span>
                        <span className="value" style={{ color: "#212121", fontWeight: 800 }}>${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="meta-block">
                        <span className="label">DELIVER TO</span>
                        <span className="value truncate-address">{order.shippingAddress}</span>
                      </div>
                    </div>

                    <div className="order-id-group">
                      <Link href={`/track-order?id=${order.id}`} className="track-link">
                        <Truck size={15} style={{ marginRight: 4 }} /> Track Package <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* Order Items & Live Delivery Status */}
                  <div className="order-items-list">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item-row" style={{ padding: "0.75rem 0", borderBottom: "1px dashed #E0E0E0" }}>
                        <img src={item.image} alt={item.title} className="item-thumb" />
                        
                        <div className="item-details">
                          <h4 className="item-title">{item.title}</h4>
                          <div className="item-qty-price">
                            <span>Seller: SuperComNet</span>
                            <span className="bullet">•</span>
                            <span>Qty: {item.quantity}</span>
                            <span className="bullet">•</span>
                            <span className="item-price">${item.price.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Flipkart Status Dot Column */}
                        <div style={{ textAlign: "right", minWidth: 200 }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, fontSize: "0.9rem" }}>
                            {order.status === "Delivered" && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />}
                            {order.status === "In Transit" && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2874F0" }} />}
                            {order.status === "Processing" && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />}
                            {order.status === "Cancelled" && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />}
                            <span style={{ color: order.status === "Delivered" ? "#10B981" : order.status === "Cancelled" ? "#EF4444" : "#212121" }}>
                              {order.status === "Delivered" ? `Delivered on ${order.estimatedDelivery}` : order.status}
                            </span>
                          </div>
                          
                          <div style={{ fontSize: "0.75rem", color: "#878787", marginTop: "0.25rem" }}>
                            {order.status === "Delivered" ? "Your item has been delivered" : `Est. delivery: ${order.estimatedDelivery}`}
                          </div>

                          {/* Rate & Review Button */}
                          {order.status === "Delivered" && (
                            <button
                              onClick={() => setReviewModalItem({ id: item.id, title: item.title })}
                              style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#2874F0", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                            >
                              <Star size={14} fill="#2874F0" /> Rate & Review Product
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="order-card-footer">
                    <div className="payment-info">
                      Paid via <strong>{order.paymentMethod}</strong>
                    </div>

                    <div className="footer-btns">
                      <button 
                        className="action-text-btn" 
                        onClick={() => setSelectedOrderForInvoice(order)}
                      >
                        <Download size={14} /> Download Flipkart Invoice
                      </button>

                      {order.status !== "Delivered" && order.status !== "Cancelled" && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)} 
                          className="action-text-btn" 
                          style={{ color: "#EF4444" }}
                        >
                          <XCircle size={14} /> Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Download Modal */}
      {selectedOrderForInvoice && (
        <div className="modal-backdrop" onClick={() => setSelectedOrderForInvoice(null)}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, margin: "auto", padding: "2rem", borderRadius: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#2874F0" }}>FLIPKART TAX INVOICE</h3>
              <button onClick={() => setSelectedOrderForInvoice(null)} style={{ fontWeight: 700, fontSize: "1.2rem" }}>✕</button>
            </div>
            
            <div style={{ background: "#F8FAFC", border: "1px solid #E0E0E0", padding: "1rem", borderRadius: 4, fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              <div><strong>Invoice No:</strong> INV-{selectedOrderForInvoice.id}</div>
              <div><strong>Order Date:</strong> {selectedOrderForInvoice.date}</div>
              <div><strong>Buyer:</strong> Flipkart Customer</div>
              <div><strong>Shipping Address:</strong> {selectedOrderForInvoice.shippingAddress}</div>
              <div><strong>Total Paid:</strong> ${selectedOrderForInvoice.totalAmount.toFixed(2)}</div>
            </div>

            <button 
              onClick={() => {
                alert(`Downloading Tax Invoice PDF for ${selectedOrderForInvoice.id}`);
                setSelectedOrderForInvoice(null);
              }}
              className="flipkart-btn-orange"
            >
              DOWNLOAD INVOICE PDF
            </button>
          </div>
        </div>
      )}

      {/* Rate & Review Modal */}
      {reviewModalItem && (
        <div className="modal-backdrop" onClick={() => setReviewModalItem(null)}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, margin: "auto", padding: "2rem", borderRadius: 4 }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Rate & Review Product</h3>
            <p style={{ fontSize: "0.85rem", color: "#878787", marginBottom: "1rem" }}>{reviewModalItem.title}</p>

            {reviewSubmitted ? (
              <div style={{ textAlign: "center", color: "#10B981", fontWeight: 700, padding: "1rem" }}>
                ✓ Thank you for your review! It will help other Flipkart shoppers.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1.25rem" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewStars(star)}
                      style={{ background: "none", border: "none" }}
                    >
                      <Star size={32} fill={star <= reviewStars ? "#F59E0B" : "none"} color="#F59E0B" />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  className="fk-field-input"
                  style={{ height: "auto", padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
                  placeholder="Write your review here... (What did you like or dislike?)"
                  required
                />

                <button type="submit" className="flipkart-btn-orange">
                  SUBMIT REVIEW
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
