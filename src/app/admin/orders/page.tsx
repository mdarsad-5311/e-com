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
import { mockOrders } from "@/data/orders";
import "@/styles/admin.css";

export default function AdminOrdersPage() {
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrdersList(data.data);
        } else {
          setOrdersList(mockOrders);
        }
        setLoading(false);
      })
      .catch(() => {
        setOrdersList(mockOrders);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrdersList((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const filteredOrders = ordersList.filter((ord) => {
    const matchesStatus =
      statusFilter === "ALL" ? true : ord.status.toUpperCase().replace(/\s+/g, "_") === statusFilter;
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.shippingAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.items.some((it: any) => it.title.toLowerCase().includes(searchQuery.toLowerCase()));
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
                <option value="PROCESSING">Processing</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
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
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="font-bold">{ord.id}</td>
                      <td>{ord.date}</td>
                      <td>
                        <div className="order-items-preview">
                          <span className="font-bold">{ord.items.length} Item(s)</span>
                          <span className="text-muted text-xs truncate-text">
                            {ord.items[0]?.title}
                          </span>
                        </div>
                      </td>
                      <td className="font-bold">${ord.totalAmount.toFixed(2)}</td>
                      <td>
                        <select
                          className={`status-select ${ord.status.toLowerCase().replace(/\s+/g, "-")}`}
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div className="action-row">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setSelectedOrder(ord)}
                          >
                            <Eye size={14} /> View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Order Details ({selectedOrder.id})</h3>
              <button onClick={() => setSelectedOrder(null)} className="close-btn">
                ×
              </button>
            </div>

            <div className="order-modal-body">
              <div className="order-info-grid">
                <div>
                  <label className="text-muted text-xs font-bold">DATE PLACED</label>
                  <p className="font-bold">{selectedOrder.date}</p>
                </div>
                <div>
                  <label className="text-muted text-xs font-bold">TOTAL AMOUNT</label>
                  <p className="font-bold">${selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-muted text-xs font-bold">TRACKING NUMBER</label>
                  <p className="font-bold text-blue">{selectedOrder.trackingNumber || "N/A"}</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-muted text-xs font-bold">SHIPPING ADDRESS</label>
                <p className="font-semibold">{selectedOrder.shippingAddress}</p>
              </div>

              <div className="mt-4">
                <label className="text-muted text-xs font-bold">ORDER ITEMS</label>
                <div className="modal-items-stack">
                  {selectedOrder.items.map((it: any) => (
                    <div key={it.id} className="modal-item-row">
                      <img src={it.image} alt={it.title} className="modal-item-img" />
                      <div className="flex-1">
                        <div className="font-bold">{it.title}</div>
                        <div className="text-muted text-xs">Qty: {it.quantity} × ${it.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions-row mt-6">
              <button className="btn btn-outline" onClick={() => alert(`Printing packing slip for ${selectedOrder.id}`)}>
                <Download size={14} /> Print Packing Slip
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
