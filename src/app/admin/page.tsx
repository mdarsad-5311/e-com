"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Layers,
  Settings,
  ChevronRight,
  Shield,
  Edit2,
  Trash2,
  Search,
  Filter,
  RefreshCcw,
  XCircle
} from "lucide-react";
import { useAuth, UserOrder } from "@/context/AuthContext";
import { products as initialProducts } from "@/data/products";
import "@/styles/admin.css";

export default function AdminDashboardPage() {
  const { user, isAdmin, loginAsAdmin, orders, updateOrderStatus } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "users">("overview");
  const [productList, setProductList] = useState<any[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Add product form modal state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("Electronics");
  const [newPrice, setNewPrice] = useState<string>("");
  const [newOriginalPrice, setNewOriginalPrice] = useState<string>("");
  const [newStock, setNewStock] = useState<string>("50");
  const [newImage, setNewImage] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");

  // Edit product modal state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const totalRevenue = orders.reduce((acc: number, curr: UserOrder) => acc + (curr.totalAmount || 0), 0);

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const priceNum = parseFloat(newPrice);
    const origNum = newOriginalPrice ? parseFloat(newOriginalPrice) : priceNum * 1.2;

    const newProd = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      categoryName: newCategory,
      categoryId: newCategory.toLowerCase().replace(/\s+/g, "-"),
      price: priceNum,
      originalPrice: origNum,
      discountPercentage: Math.round(((origNum - priceNum) / origNum) * 100),
      rating: 4.8,
      reviewCount: 1,
      image: newImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
      description: newDesc || "High quality product on Flipkart Store.",
      inStock: true,
      stock: parseInt(newStock) || 50,
      isBestSeller: true,
      features: ["Verified Flipkart Quality"]
    };

    setProductList([newProd, ...productList]);
    setIsAddProductModalOpen(false);

    // Reset Form
    setNewTitle("");
    setNewPrice("");
    setNewOriginalPrice("");
    setNewImage("");
    setNewDesc("");
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to remove this product from Flipkart catalog?")) {
      setProductList(productList.filter((p) => p.id !== id));
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin-root-container">
        <div className="container py-8" style={{ textAlign: "center", minHeight: "60vh" }}>
            <div className="card" style={{ maxWidth: 500, margin: "3rem auto", padding: "3rem 2rem", borderRadius: 4 }}>
              <Shield size={56} style={{ color: "#E5530B", margin: "0 auto 1rem auto" }} />
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Flipkart Admin Control Panel</h2>
              <p style={{ color: "#878787", marginTop: "0.5rem" }}>
                You are currently logged in as a standard user. Log in with an Admin account to manage store inventory, customer orders, and product catalog.
              </p>

              <button 
                onClick={loginAsAdmin}
                className="flipkart-btn-orange"
                style={{ marginTop: "1.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                <Shield size={18} /> LOG IN AS FLIPKART SUPERADMIN
              </button>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="admin-root-container">
      <div style={{ backgroundColor: "#F1F3F6", paddingBottom: "3.5rem" }}>
        <div className="container py-8">
          {/* Admin Header Strip */}
          <div className="admin-header-strip">
            <div>
              <div className="admin-pill-badge" style={{ backgroundColor: "#FFF7ED", color: "#E5530B" }}>
                FLIPKART SELLER & ADMIN HUB
              </div>
              <h1 className="admin-title">Store Management Dashboard</h1>
              <p className="admin-subtitle">Live store sales metrics, customer orders workflow, and catalog controls</p>
            </div>

            {/* Navigation Tabs */}
            <div className="admin-nav-links">
              <button 
                className={`admin-nav-link ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button 
                className={`admin-nav-link ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Orders ({orders.length})
              </button>
              <button 
                className={`admin-nav-link ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                Products ({productList.length})
              </button>
              <button 
                className={`admin-nav-link ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                Users (4)
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="stats-grid-4">
            <div className="stat-card card" style={{ borderRadius: 2 }}>
              <div className="stat-icon-wrapper blue">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Revenue</span>
                <h3 className="stat-value">${totalRevenue.toFixed(2)}</h3>
                <span className="stat-change positive">
                  <ArrowUpRight size={14} /> +14.2% this week
                </span>
              </div>
            </div>

            <div className="stat-card card" style={{ borderRadius: 2 }}>
              <div className="stat-icon-wrapper orange">
                <ShoppingBag size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Customer Orders</span>
                <h3 className="stat-value">{orders.length}</h3>
                <span className="stat-change positive">
                  <ArrowUpRight size={14} /> Live synced
                </span>
              </div>
            </div>

            <div className="stat-card card" style={{ borderRadius: 2 }}>
              <div className="stat-icon-wrapper green">
                <Package size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Active Products</span>
                <h3 className="stat-value">{productList.length}</h3>
                <span className="stat-change">In catalog</span>
              </div>
            </div>

            <div className="stat-card card" style={{ borderRadius: 2 }}>
              <div className="stat-icon-wrapper purple">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Registered Customers</span>
                <h3 className="stat-value">1,482</h3>
                <span className="stat-change positive">
                  <ArrowUpRight size={14} /> +32 today
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              {/* Quick Actions Bar */}
              <div className="admin-actions-bar card" style={{ borderRadius: 2, marginBottom: "1.5rem" }}>
                <h3 className="bar-title">Catalog Quick Controls</h3>
                <div className="action-buttons-row">
                  <button onClick={() => setIsAddProductModalOpen(true)} className="flipkart-btn-orange" style={{ width: "auto", height: 42, padding: "0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Plus size={16} /> Add New Product
                  </button>
                  <button onClick={() => setActiveTab("orders")} className="flipkart-btn-blue-outline" style={{ width: "auto", height: 42, padding: "0 1.25rem" }}>
                    Process Orders ({orders.length})
                  </button>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="admin-grid-2">
                {/* Recent Orders Overview */}
                <div className="card dashboard-table-card" style={{ borderRadius: 2 }}>
                  <div className="card-header-row">
                    <h3 className="card-title">Recent Orders Queue</h3>
                    <button onClick={() => setActiveTab("orders")} className="view-all-link">
                      View All Orders <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ORDER ID</th>
                          <th>DATE</th>
                          <th>AMOUNT</th>
                          <th>STATUS</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((ord: UserOrder) => (
                          <tr key={ord.id}>
                            <td className="font-bold" style={{ color: "#2874F0" }}>{ord.id}</td>
                            <td>{ord.date}</td>
                            <td className="font-bold">${ord.totalAmount.toFixed(2)}</td>
                            <td>
                              <select
                                className="status-select"
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                              >
                                <option value="Processing">Processing</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <span className="text-xs text-muted">{ord.itemsCount} items</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Catalog Preview Highlights */}
                <div className="card dashboard-table-card" style={{ borderRadius: 2 }}>
                  <div className="card-header-row">
                    <h3 className="card-title">Catalog Highlights</h3>
                    <button onClick={() => setActiveTab("products")} className="view-all-link">
                      Manage Products <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="catalog-preview-list">
                    {productList.slice(0, 5).map((p) => (
                      <div key={p.id} className="preview-item">
                        <img src={p.image} alt={p.title} className="item-thumb" />
                        <div className="item-info">
                          <h4 className="item-title">{p.title}</h4>
                          <span className="item-meta">{p.categoryName} • ${p.price.toFixed(2)}</span>
                        </div>
                        <span className="stock-pill">In Stock ({p.stock || 50})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="card dashboard-table-card" style={{ borderRadius: 2 }}>
              <div className="card-header-row">
                <div>
                  <h3 className="card-title">Customer Order Management</h3>
                  <p className="text-muted text-xs">Update order delivery status in real-time for customer view</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>DATE PLACED</th>
                      <th>SHIPPING ADDRESS</th>
                      <th>ITEMS</th>
                      <th>TOTAL</th>
                      <th>STATUS WORKFLOW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord: UserOrder) => (
                      <tr key={ord.id}>
                        <td className="font-bold" style={{ color: "#2874F0" }}>{ord.id}</td>
                        <td>{ord.date}</td>
                        <td style={{ maxWidth: 220 }}>{ord.shippingAddress}</td>
                        <td>
                          {ord.items.map((i: any) => i.title).join(", ")}
                        </td>
                        <td className="font-bold">${ord.totalAmount.toFixed(2)}</td>
                        <td>
                          <select
                            className="status-select"
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                            style={{ 
                              borderColor: ord.status === "Delivered" ? "#10B981" : ord.status === "Cancelled" ? "#EF4444" : "#2874F0",
                              fontWeight: 700 
                            }}
                          >
                            <option value="Processing">🟡 Processing</option>
                            <option value="In Transit">🔵 In Transit</option>
                            <option value="Delivered">🟢 Delivered</option>
                            <option value="Cancelled">🔴 Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === "products" && (
            <div>
              <div className="admin-actions-bar card" style={{ borderRadius: 2, marginBottom: "1.5rem" }}>
                <h3 className="bar-title">Product Catalog Inventory</h3>
                <button onClick={() => setIsAddProductModalOpen(true)} className="flipkart-btn-orange" style={{ width: "auto", height: 42, padding: "0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              <div className="card dashboard-table-card" style={{ borderRadius: 2 }}>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>PRODUCT ITEM</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="product-table-item">
                              <img src={p.image} alt={p.title} className="table-item-img" />
                              <div>
                                <div className="font-bold">{p.title}</div>
                                <div className="text-xs text-muted">ID: {p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="cat-badge">{p.categoryName}</span>
                          </td>
                          <td>
                            <div className="price-stack">
                              <span className="font-bold">${p.price.toFixed(2)}</span>
                              {p.originalPrice && <span className="orig-price">${p.originalPrice.toFixed(2)}</span>}
                            </div>
                          </td>
                          <td>
                            <span className="stock-badge">In Stock ({p.stock || 50})</span>
                          </td>
                          <td>
                            <div className="action-row">
                              <button onClick={() => handleDeleteProduct(p.id)} className="icon-btn delete" title="Delete Product">
                                <Trash2 size={16} />
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
          )}

          {/* TAB 4: USERS DIRECTORY */}
          {activeTab === "users" && (
            <div className="card dashboard-table-card" style={{ borderRadius: 2 }}>
              <h3 className="card-title" style={{ marginBottom: "1rem" }}>Registered Users Directory</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>USER NAME</th>
                      <th>EMAIL ADDRESS</th>
                      <th>PHONE</th>
                      <th>ROLE</th>
                      <th>JOIN DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold">Alexander Vance</td>
                      <td>alexander.vance@example.com</td>
                      <td>9876543210</td>
                      <td><span className="cat-badge">Customer</span></td>
                      <td>August 2026</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Flipkart SuperAdmin</td>
                      <td>admin@flipkart.com</td>
                      <td>9999988888</td>
                      <td><span className="cat-badge" style={{ background: "#FFF7ED", color: "#E5530B" }}>SuperAdmin</span></td>
                      <td>January 2024</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Rohan Sharma</td>
                      <td>rohan.sharma@example.com</td>
                      <td>9811223344</td>
                      <td><span className="cat-badge">Customer</span></td>
                      <td>July 2026</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Priya Patel</td>
                      <td>priya.p@example.com</td>
                      <td>9766554433</td>
                      <td><span className="cat-badge">Customer</span></td>
                      <td>June 2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddProductModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ borderRadius: 4 }}>
            <div className="modal-header-row">
              <h3>Add New Flipkart Product</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="admin-form">
              <div className="form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Noise Cancelling Earbuds"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Appliances">Appliances</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Original MRP ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="129.99"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Initial Stock Qty</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed product features..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" onClick={() => setIsAddProductModalOpen(false)} style={{ color: "#878787" }}>
                  Cancel
                </button>
                <button type="submit" className="flipkart-btn-orange" style={{ width: "auto", padding: "0 1.5rem" }}>
                  ADD PRODUCT TO STORE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
