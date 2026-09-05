"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Clock,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { OrderResponse } from "@/types/api";
import "@/styles/orders-page.css";

type OrderTab = "orders" | "buy_again" | "not_shipped" | "cancelled";
type TimeFilter = "3months" | "2023" | "2022";

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<OrderTab>("orders");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("3months");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Protected Route Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=" + encodeURIComponent("/orders"));
    }
  }, [authLoading, user, router]);

  // Fetch live orders from Django backend
  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await api.get<OrderResponse[]>("/api/orders/");
        if (isMounted) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setOrders([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchOrders();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

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

  if (authLoading) {
    return (
      <div className="op-page" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading your orders...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter((order) => {
    const statusLower = (order.status || "").toLowerCase();

    // Tab filter
    if (activeTab === "not_shipped" && !["pending", "processing", "confirmed"].includes(statusLower)) {
      return false;
    }
    if (activeTab === "cancelled" && statusLower !== "cancelled") {
      return false;
    }
    if (activeTab === "buy_again" && statusLower !== "delivered") {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = String(order.id).toLowerCase().includes(q) || (order.order_number || "").toLowerCase().includes(q);
      const matchItem = order.items?.some((it) => (it.title || it.product_name || "").toLowerCase().includes(q));
      const matchAddress = (order.shippingAddress || "").toLowerCase().includes(q);
      return matchId || matchItem || matchAddress;
    }

    return true;
  });

  return (
    <div className="op-page">
      <div className="container op-layout">
        {/* Left Sidebar */}
        <aside className="op-sidebar" aria-label="Account Navigation">
          <div className="op-user-snippet">
            <div className="op-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="op-user-info">
              <strong className="op-user-name">{user?.name || "Customer"}</strong>
              <span className="op-user-email">{user?.email || ""}</span>
            </div>
          </div>

          <nav className="op-nav-list">
            {sidebarLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`op-nav-item ${link.active ? "op-nav-active" : ""}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="op-main-content">
          <div className="op-header">
            <h1 className="op-title">Your Orders</h1>

            <div className="op-search-bar">
              <Search size={16} className="op-search-icon" />
              <input
                type="text"
                placeholder="Search all orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="op-search-input"
                aria-label="Search all orders"
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="op-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`op-tab-btn ${activeTab === tab.id ? "op-tab-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Time Filter Row */}
          <div className="op-filter-row">
            <span className="op-filter-label">Filter orders by:</span>
            {timeFilters.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeFilter(tf.id)}
                className={`op-time-pill ${timeFilter === tf.id ? "op-time-active" : ""}`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "3rem 0", textAlign: "center", color: "var(--text-muted)" }}>
              <p>Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="op-tab-empty">
              <PackageCheck size={40} className="op-empty-icon" />
              <div className="op-empty-title">
                {activeTab === "buy_again" && "No items to buy again"}
                {activeTab === "not_shipped" && "No orders waiting to ship"}
                {activeTab === "cancelled" && "No cancelled orders"}
                {activeTab === "orders" && (searchQuery ? "No orders matched your search" : "You haven't placed any orders yet")}
              </div>
              {activeTab === "orders" && !searchQuery && (
                <Link href="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                  Start Shopping
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="op-orders-count">
                <strong>{filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}</strong> found
              </div>

              <div className="op-orders-list">
                {filteredOrders.map((order) => {
                  const orderIdDisplay = order.order_number || String(order.id);
                  const orderTotalNum = Number(order.total_amount || order.totalAmount) || 0;
                  const placedDate = order.placed || order.date || (order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Recent");
                  const recipient = order.shipping_address?.name || user?.name || "Recipient";
                  const statusLower = (order.status || "").toLowerCase();

                  return (
                    <div key={order.id} className="op-order-card">
                      <div className="op-order-card-header">
                        <div className="op-order-meta-left">
                          <div className="op-meta-block">
                            <div className="op-meta-label">ORDER PLACED</div>
                            <div className="op-meta-value">{placedDate}</div>
                          </div>
                          <div className="op-meta-block">
                            <div className="op-meta-label">TOTAL</div>
                            <div className="op-meta-value">${orderTotalNum.toFixed(2)}</div>
                          </div>
                          <div className="op-meta-block">
                            <div className="op-meta-label">SHIP TO</div>
                            <button type="button" className="op-ship-to-btn">
                              {recipient} <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>

                        <div className="op-order-meta-right">
                          <div className="op-order-number">Order # {orderIdDisplay}</div>
                          <div className="op-order-links">
                            <Link href={`/orders/details?id=${order.id}`} className="op-order-link">
                              View order details
                            </Link>
                            <span className="op-link-sep">|</span>
                            <Link href={`/track-order?id=${order.id}`} className="op-order-link">
                              Track package
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Items in order */}
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => (
                          <div key={item.id} className="op-order-item">
                            <div className="op-item-image-wrap">
                              {item.image || item.product_image_url ? (
                                <img
                                  src={item.image || item.product_image_url}
                                  alt={item.title || item.product_name}
                                  className="op-item-image"
                                />
                              ) : (
                                <div className="op-item-placeholder-img" />
                              )}
                            </div>
                            <div className="op-item-center">
                              <div className="op-item-title">
                                {item.title || item.product_name} {item.qty > 1 ? `(Qty: ${item.qty})` : ""}
                              </div>
                              {statusLower === "delivered" && (
                                <div className="op-status-pill op-status-delivered">
                                  <Check size={12} strokeWidth={3} /> Delivered
                                </div>
                              )}
                              {["shipped", "in transit"].includes(statusLower) && (
                                <div className="op-status-pill op-status-transit">
                                  In Transit
                                </div>
                              )}
                              {["pending", "processing", "confirmed"].includes(statusLower) && (
                                <div className="op-status-pill op-status-transit" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#2563eb" }}>
                                  <Clock size={12} /> {order.status_display || "Processing"}
                                </div>
                              )}
                              {statusLower === "cancelled" && (
                                <div className="op-status-pill op-status-transit" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#dc2626" }}>
                                  Cancelled
                                </div>
                              )}
                            </div>
                            <div className="op-item-right-actions">
                              <Link href={`/orders/details?id=${order.id}`} className="op-ghost-btn">
                                View Details
                              </Link>
                              <Link href={`/track-order?id=${order.id}`} className="op-track-orange-btn">
                                Track package
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="op-order-item">
                          <div className="op-item-image-wrap"><div className="op-item-placeholder-img" /></div>
                          <div className="op-item-center">
                            <div className="op-item-title">Order Total: ${orderTotalNum.toFixed(2)}</div>
                            <div className="op-status-pill op-status-transit">
                              {order.status_display || order.status}
                            </div>
                          </div>
                          <div className="op-item-right-actions">
                            <Link href={`/orders/details?id=${order.id}`} className="op-ghost-btn">
                              View Details
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
