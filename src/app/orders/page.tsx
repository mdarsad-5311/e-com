"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Check,
  ChevronRight,
  Package,
  PackageCheck,
  Filter,
  LayoutDashboard,
  MapPin,
  CreditCard,
  Lock,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "@/styles/orders-page.css";

type OrderTab = "orders" | "buy_again" | "not_shipped" | "cancelled";
type TimeFilter = "3months" | "2023" | "2022";

const SAMPLE_ORDERS = [
  {
    id: "114 8902 332",
    placed: "October 24, 2023",
    total: 249.99,
    shipTo: "John Doe",
    status: "arriving",
    statusLabel: "Arriving Tomorrow",
    statusDate: "",
    product: {
      title: "Noise Cancelling Wireless Headphones - Pro Series Black",
      image: "",
      qty: 1,
    },
    actions: ["track", "view_details"],
  },
  {
    id: "112 5534 111",
    placed: "October 12, 2023",
    total: 89.98,
    shipTo: "John Doe",
    status: "delivered",
    statusLabel: "Delivered Oct 12",
    statusDate: "Oct 12",
    product: {
      title: "Smart Home Security Camera - 1080p HD Indoor",
      image: "",
      qty: 2,
    },
    actions: ["buy_again", "return"],
  },
  {
    id: "111 9923 005",
    placed: "September 28, 2023",
    total: 142.50,
    shipTo: "John Doe",
    status: "delivered",
    statusLabel: "Delivered Sep 28",
    statusDate: "Sep 28",
    product: null, // multi-item order
    itemCount: 3,
    actions: ["view_details", "leave_review"],
  },
];

export default function OrdersPage() {
  const { orders: contextOrders, updateOrderStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<OrderTab>("orders");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("3months");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const displayOrders = contextOrders.length > 0 ? contextOrders : [];

  const sidebarLinks = [
    { href: "/profile", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { href: "/orders", icon: <PackageCheck size={18} />, label: "Your Orders", active: true },
    { href: "/profile", icon: <MapPin size={18} />, label: "Saved Addresses" },
    { href: "/profile", icon: <Lock size={18} />, label: "Security" },
    { href: "/profile", icon: <CreditCard size={18} />, label: "Payment Methods" },
  ];

  const tabs: { id: OrderTab; label: string }[] = [
    { id: "orders",      label: "Orders" },
    { id: "buy_again",   label: "Buy Again" },
    { id: "not_shipped", label: "Not Yet Shipped" },
    { id: "cancelled",   label: "Cancelled Orders" },
  ];

  const timeFilters: { id: TimeFilter; label: string }[] = [
    { id: "3months", label: "Past 3 months" },
    { id: "2023",    label: "2023" },
    { id: "2022",    label: "2022" },
  ];

  return (
    <div className="op-page">

      {/* ══════════════ MOBILE LAYOUT ══════════════ */}
      <div className="op-mobile-layout">
        <div className="op-mob-header">
          <h1 className="op-mob-title">Your Orders</h1>
          <div className="op-mob-header-actions">
            <button type="button" className="op-mob-icon-btn" aria-label="Search"><Search size={20} /></button>
            <button type="button" className="op-mob-icon-btn" aria-label="Filter"><SlidersHorizontal size={20} /></button>
          </div>
        </div>

        {/* Time filter pills */}
        <div className="op-mob-time-filters">
          {timeFilters.map((tf) => (
            <button
              key={tf.id}
              type="button"
              className={`op-mob-time-pill ${timeFilter === tf.id ? "op-mob-time-pill-active" : ""}`}
              onClick={() => setTimeFilter(tf.id)}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Order cards */}
        <div className="op-mob-orders-list">
          {SAMPLE_ORDERS.map((order, idx) => (
            <div key={order.id} className="op-mob-order-card">
              {/* Status badge */}
              {order.status === "arriving" && (
                <div className="op-mob-status-row">
                  <span className="op-mob-status-arriving">{order.statusLabel}</span>
                  <span className="op-mob-order-num">Order #{order.id}</span>
                </div>
              )}
              {order.status === "delivered" && (
                <div className="op-mob-status-row">
                  <span className="op-mob-status-delivered">
                    <Check size={13} strokeWidth={3} /> {order.statusLabel}
                  </span>
                  <span className="op-mob-order-num">Order #{order.id}</span>
                </div>
              )}

              {/* Product row */}
              {order.product ? (
                <div className="op-mob-product-row">
                  <div className="op-mob-product-img">
                    <div className="op-mob-product-placeholder" />
                  </div>
                  <div className="op-mob-product-info">
                    <div className="op-mob-product-title">{order.product.title}</div>
                    <div className="op-mob-product-qty">Qty: {order.product.qty}</div>
                    <div className="op-mob-product-price">${order.total.toFixed(2)}</div>
                  </div>
                </div>
              ) : (
                <div className="op-mob-multi-items-row">
                  <div className="op-mob-multi-thumbs">
                    {[0,1,2].map((i) => <div key={i} className="op-mob-product-placeholder op-mob-product-placeholder-sm" />)}
                  </div>
                  <div>
                    <div className="op-mob-multi-count">{order.itemCount} items</div>
                    <div className="op-mob-product-price">${order.total.toFixed(2)}</div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="op-mob-action-btns">
                {order.actions.includes("track") && (
                  <Link href={`/track-order?id=${order.id}`} className="op-mob-btn-primary">Track Package</Link>
                )}
                {order.actions.includes("view_details") && (
                  <Link href={`/orders/details?id=${order.id}`} className="op-mob-btn-secondary">View Details</Link>
                )}
                {order.actions.includes("buy_again") && (
                  <button type="button" className="op-mob-btn-primary">Buy it again</button>
                )}
                {order.actions.includes("return") && (
                  <button type="button" className="op-mob-btn-secondary">Return Item</button>
                )}
                {order.actions.includes("leave_review") && (
                  <button type="button" className="op-mob-btn-secondary">Leave Review</button>
                )}
              </div>
            </div>
          ))}

          {displayOrders.map((order) => (
            <div key={order.id} className="op-mob-order-card">
              <div className="op-mob-status-row">
                {order.status === "Delivered"
                  ? <span className="op-mob-status-delivered"><Check size={13} strokeWidth={3} /> Delivered</span>
                  : <span className="op-mob-status-arriving">{order.status}</span>
                }
                <span className="op-mob-order-num">Order #{order.id}</span>
              </div>

              {order.items.map((item) => (
                <div key={item.id} className="op-mob-product-row">
                  <div className="op-mob-product-img">
                    {item.image
                      ? <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      : <div className="op-mob-product-placeholder" />
                    }
                  </div>
                  <div className="op-mob-product-info">
                    <div className="op-mob-product-title">{item.title}</div>
                    <div className="op-mob-product-qty">Qty: {item.quantity}</div>
                    <div className="op-mob-product-price">${order.totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              ))}

              <div className="op-mob-action-btns">
                {order.status === "Delivered" && <button type="button" className="op-mob-btn-primary">Buy it again</button>}
                <Link href={`/orders/details?id=${order.id}`} className="op-mob-btn-secondary">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ DESKTOP LAYOUT ══════════════ */}
      <div className="op-layout op-desktop-layout">
        {/* Sidebar */}
        <aside className="op-sidebar">
          <div className="op-sidebar-user">
            <div className="op-avatar"><span>U</span></div>
            <div>
              <div className="op-sidebar-name">Welcome, User</div>
              <div className="op-sidebar-prime"><Star size={11} className="op-prime-star" />Al-Umaima Prime Member</div>
            </div>
          </div>
          <nav className="op-sidebar-nav">
            {sidebarLinks.map((link) => (
              <Link key={link.label} href={link.href} className={`op-nav-item ${link.active ? "op-nav-active" : ""}`}>
                <span className="op-nav-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="op-main">
          <div className="op-breadcrumb">
            <Link href="/profile" className="op-breadcrumb-link">Account</Link>
            <span className="op-breadcrumb-sep">&rsaquo;</span>
            <span className="op-breadcrumb-current">Your Orders</span>
          </div>

          <div className="op-page-header">
            <h1 className="op-page-title">Your Orders</h1>
            <div className="op-header-actions">
              <div className="op-search-wrap">
                <Search size={15} className="op-search-icon" />
                <input type="text" placeholder="Search all orders" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="op-search-input" />
              </div>
              <button type="button" className="op-filter-btn"><Filter size={15} />Filter Orders</button>
            </div>
          </div>

          <div className="op-tabs-bar">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" className={`op-tab-btn ${activeTab === tab.id ? "op-tab-active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>

          {activeTab === "orders" && (
            <>
              <div className="op-orders-count">
                <strong>{displayOrders.length > 0 ? displayOrders.length : SAMPLE_ORDERS.length} orders</strong> placed in <strong>past 3 months</strong>
              </div>

              <div className="op-orders-list">
                {/* Static sample */}
                {displayOrders.length === 0 && SAMPLE_ORDERS.map((order) => (
                  <div key={order.id} className="op-order-card">
                    <div className="op-order-card-header">
                      <div className="op-order-meta-left">
                        <div className="op-meta-block"><div className="op-meta-label">ORDER PLACED</div><div className="op-meta-value">{order.placed}</div></div>
                        <div className="op-meta-block"><div className="op-meta-label">TOTAL</div><div className="op-meta-value">${order.total.toFixed(2)}</div></div>
                        <div className="op-meta-block"><div className="op-meta-label">SHIP TO</div><button type="button" className="op-ship-to-btn">{order.shipTo} <ChevronRight size={12} /></button></div>
                      </div>
                      <div className="op-order-meta-right">
                        <div className="op-order-number">Order # {order.id}</div>
                        <div className="op-order-links">
                          <button type="button" className="op-order-link">View order details</button>
                          <span className="op-link-sep">|</span>
                          <button type="button" className="op-order-link">Invoice</button>
                        </div>
                      </div>
                    </div>

                    {order.product && (
                      <div className="op-order-item">
                        <div className="op-item-image-wrap"><div className="op-item-placeholder-img" /></div>
                        <div className="op-item-center">
                          <div className="op-item-title">{order.product.title}</div>
                          {order.status === "arriving" && <div className="op-status-pill op-status-transit">{order.statusLabel}</div>}
                          {order.status === "delivered" && <div className="op-status-pill op-status-delivered"><Check size={12} strokeWidth={3} /> {order.statusLabel}</div>}
                        </div>
                        <div className="op-item-right-actions">
                          {order.actions.includes("buy_again") && <button type="button" className="op-buy-again-btn">Buy it again</button>}
                          {order.actions.includes("track") && <Link href={`/track-order?id=${order.id}`} className="op-track-orange-btn">Track package</Link>}
                          {order.actions.includes("view_details") && <Link href={`/orders/details?id=${order.id}`} className="op-ghost-btn">View Details</Link>}
                          {order.actions.includes("return") && <button type="button" className="op-ghost-btn">Return items</button>}
                          {order.actions.includes("leave_review") && <button type="button" className="op-ghost-btn">Leave Review</button>}
                        </div>
                      </div>
                    )}

                    {!order.product && (
                      <div className="op-order-item">
                        <div className="op-item-image-wrap"><div className="op-item-placeholder-img" /></div>
                        <div className="op-item-center">
                          <div className="op-item-title">{order.itemCount} items · ${order.total.toFixed(2)}</div>
                          {order.status === "delivered" && <div className="op-status-pill op-status-delivered"><Check size={12} strokeWidth={3} /> {order.statusLabel}</div>}
                        </div>
                        <div className="op-item-right-actions">
                          <Link href={`/orders/details?id=${order.id}`} className="op-ghost-btn">View Details</Link>
                          <button type="button" className="op-ghost-btn">Leave Review</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {displayOrders.map((order) => (
                  <div key={order.id} className="op-order-card">
                    <div className="op-order-card-header">
                      <div className="op-order-meta-left">
                        <div className="op-meta-block"><div className="op-meta-label">ORDER PLACED</div><div className="op-meta-value">{order.date}</div></div>
                        <div className="op-meta-block"><div className="op-meta-label">TOTAL</div><div className="op-meta-value">${order.totalAmount.toFixed(2)}</div></div>
                        <div className="op-meta-block"><div className="op-meta-label">SHIP TO</div><button type="button" className="op-ship-to-btn">John Doe <ChevronRight size={12} /></button></div>
                      </div>
                      <div className="op-order-meta-right">
                        <div className="op-order-number">Order # {order.id}</div>
                        <div className="op-order-links"><Link href={`/track-order?id=${order.id}`} className="op-order-link">View order details</Link><span className="op-link-sep">|</span><button type="button" className="op-order-link">Invoice</button></div>
                      </div>
                    </div>
                    {order.items.map((item) => (
                      <div key={item.id} className="op-order-item">
                        <div className="op-item-image-wrap">{item.image ? <img src={item.image} alt={item.title} className="op-item-image" /> : <div className="op-item-placeholder-img" />}</div>
                        <div className="op-item-center">
                          <div className="op-item-title">{item.title}</div>
                          {order.status === "Delivered" && <div className="op-status-pill op-status-delivered"><Check size={12} strokeWidth={3} /> Delivered {order.estimatedDelivery}</div>}
                          {order.status === "In Transit" && <div className="op-status-pill op-status-transit">Arriving Tomorrow</div>}
                        </div>
                        <div className="op-item-right-actions">
                          <button type="button" className="op-buy-again-btn">Buy it again</button>
                          <Link href={`/orders/details?id=${order.id}`} className="op-ghost-btn">View Details</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="op-pagination">
                <button type="button" className="op-page-btn op-page-arrow" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>‹</button>
                {[1,2,3].map((pg) => <button key={pg} type="button" className={`op-page-btn ${currentPage === pg ? "op-page-active" : ""}`} onClick={() => setCurrentPage(pg)}>{pg}</button>)}
                <span className="op-page-ellipsis">…</span>
                <button type="button" className="op-page-btn op-page-arrow" onClick={() => setCurrentPage(p => p+1)}>›</button>
              </div>
            </>
          )}

          {activeTab !== "orders" && (
            <div className="op-tab-empty">
              <PackageCheck size={40} className="op-empty-icon" />
              <div className="op-empty-title">
                {activeTab === "buy_again" && "No items to buy again"}
                {activeTab === "not_shipped" && "No orders waiting to ship"}
                {activeTab === "cancelled" && "No cancelled orders"}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
