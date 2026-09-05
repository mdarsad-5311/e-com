"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  ArrowLeft, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight,
  Eye,
  Filter,
  Download
} from "lucide-react";
import { api } from "@/lib/api";
import { OrderResponse } from "@/types/api";
import "@/styles/admin.css";

export default function AdminOrdersPage() {
  const [ordersList, setOrdersList] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.get<OrderResponse[]>("/api/orders/")
      .then((data) => {
        if (isMounted) {
          setOrdersList(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setOrdersList([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (orderId: string | number, newStatus: string) => {
    // Map UI status string to backend status
    let mapped = newStatus.toLowerCase().replace(/\s+/g, "_");
    if (mapped === "in_transit") mapped = "shipped";

    try {
      await api.patch(`/api/orders/${orderId}/status/`, { status: mapped });
      setOrdersList((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: mapped, status_display: newStatus } : ord))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update order status.");
    }
  };

  const filteredOrders = ordersList.filter((ord) => {
    const statusVal = (ord.status || "").toUpperCase().replace(/\s+/g, "_");
    const matchesStatus =
      statusFilter === "ALL" ? true : (statusVal === statusFilter || (statusFilter === "IN_TRANSIT" && statusVal === "SHIPPED"));

    const orderIdStr = String(ord.order_number || ord.id).toLowerCase();
    const addrStr = (ord.shippingAddress || ord.shipping_address?.line1 || "").toLowerCase();
    const matchItem = ord.items?.some((it: any) => (it.title || it.product_name || "").toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSearch =
      orderIdStr.includes(searchQuery.toLowerCase()) ||
      addrStr.includes(searchQuery.toLowerCase()) ||
      matchItem;

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-root-container">
      <div className="container py-8">
          {/* Admin Header Strip */}
          <div className="admin-header-strip">
            <div>
              <Link href="/admin" className="back-link">
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
              <h1 className="admin-title">Order Fulfillment</h1>
              <p className="admin-subtitle">Monitor customer purchases, update shipment status, and handle dispatch</p>
            </div>

            <div className="admin-nav-links">
              <Link href="/admin" className="admin-nav-link">Overview</Link>
              <Link href="/admin/products" className="admin-nav-link">Products</Link>
              <Link href="/admin/categories" className="admin-nav-link">Categories</Link>
              <Link href="/admin/orders" className="admin-nav-link active">Orders ({ordersList.length})</Link>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="admin-actions-bar card">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search orders by ID, address, or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="toolbar-controls">
              <select
                className="category-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped / In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="card dashboard-table-card mt-6">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Fulfillment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>Loading orders...</td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>No orders found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => {
                      const totalNum = Number(ord.total_amount || ord.totalAmount) || 0;
                      const dateStr = ord.placed || ord.date || (ord.created_at ? new Date(ord.created_at).toLocaleDateString() : "");
                      const statusKey = (ord.status || "").toLowerCase();

                      return (
                        <tr key={ord.id}>
                          <td>
                            <strong>{ord.order_number || ord.id}</strong>
                          </td>
                          <td>{dateStr}</td>
                          <td>
                            {ord.items?.length || 0} items
                          </td>
                          <td>${totalNum.toFixed(2)}</td>
                          <td>
                            <select
                              value={statusKey}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                              className={`status-select ${statusKey}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="btn-icon"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Detail Modal */}
          {selectedOrder && (
            <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
              <div className="admin-modal card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Order Details #{selectedOrder.order_number || selectedOrder.id}</h2>
                  <button onClick={() => setSelectedOrder(null)} className="btn-close">×</button>
                </div>
                <div className="modal-body">
                  <div className="detail-grid">
                    <div>
                      <p><strong>Status:</strong> {selectedOrder.status_display || selectedOrder.status}</p>
                      <p><strong>Date:</strong> {selectedOrder.placed || selectedOrder.date || selectedOrder.created_at}</p>
                      <p><strong>Payment:</strong> {selectedOrder.payment_method || "Credit Card"}</p>
                    </div>
                    <div>
                      <p><strong>Total:</strong> ${Number(selectedOrder.total_amount || selectedOrder.totalAmount || 0).toFixed(2)}</p>
                      <p><strong>Tracking:</strong> {selectedOrder.tracking_number || selectedOrder.trackingNumber || "N/A"}</p>
                      <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress || selectedOrder.shipping_address?.line1 || "N/A"}</p>
                    </div>
                  </div>

                  <h3 className="mt-4 mb-2">Purchased Items</h3>
                  <div className="order-items-list">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="order-item-row">
                        <span>{item.title || item.product_name} (x{item.qty || item.quantity})</span>
                        <span>${(Number(item.price || item.unit_price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
