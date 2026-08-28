"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  Plus, 
  ArrowUpRight, 
  ChevronRight,
  Shield,
  Trash2
} from "lucide-react";
import { useAuth, UserOrder } from "@/context/AuthContext";
import { products as initialProducts, Product } from "@/data/products";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import "@/styles/admin.css";

export default function AdminDashboardPage() {
  const { isAdmin, loginAsAdmin, orders, updateOrderStatus } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "users">("overview");
  const [productList, setProductList] = useState<Product[]>(initialProducts);

  // Add product form modal state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("Wireless Noise Cancelling Earbuds");
  const [newCategory, setNewCategory] = useState<string>("Electronics");
  const [newPrice, setNewPrice] = useState<string>("99.99");
  const [newOriginalPrice, setNewOriginalPrice] = useState<string>("129.99");
  const [newStock, setNewStock] = useState<string>("50");
  const [newImage, setNewImage] = useState<string>("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80");
  const [newDesc, setNewDesc] = useState<string>("High-fidelity audio with active noise cancellation and 30-hour battery life.");

  const totalRevenue = orders.reduce((acc: number, curr: UserOrder) => acc + (curr.totalAmount || 0), 0);

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const priceNum = parseFloat(newPrice);
    const origNum = newOriginalPrice ? parseFloat(newOriginalPrice) : priceNum * 1.2;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      category: newCategory.toLowerCase().replace(/\s+/g, "-"),
      categoryName: newCategory,
      price: priceNum,
      originalPrice: origNum,
      discountPercentage: Math.round(((origNum - priceNum) / origNum) * 100),
      rating: 4.8,
      reviewsCount: 1,
      image: newImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      description: newDesc || "High quality product on Al-Umaima Store.",
      stock: parseInt(newStock) || 50,
      isFeatured: false,
      isBestSeller: true,
      specifications: ["Verified Al-Umaima Quality"]
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

  const handleDeleteProduct = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from Al-Umaima catalog?`)) {
      setProductList(productList.filter((p) => p.id !== id));
    }
  };

  const modalRef = useFocusTrap<HTMLDivElement>(isAddProductModalOpen, () => setIsAddProductModalOpen(false));

  if (!isAdmin) {
    return (
      <div className="admin-root-container">
        <div className="container py-8" style={{ textAlign: "center", minHeight: "60vh" }}>
          <div className="card" style={{ maxWidth: 500, margin: "3rem auto", padding: "3rem 2rem", borderRadius: "var(--radius-card)" }}>
            <Shield size={56} style={{ color: "var(--secondary)", margin: "0 auto 1rem auto" }} aria-hidden="true" />
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Al-Umaima Admin Control Panel</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              You are currently logged in as a standard user. Log in with an Admin account to manage store inventory, customer orders, and product catalog.
            </p>

            <button 
              type="button"
              onClick={loginAsAdmin}
              className="al-umaima-btn-orange"
              style={{ marginTop: "1.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <Shield size={18} aria-hidden="true" /> LOG IN AS AL-UMAIMA SUPERADMIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root-container">
      <div style={{ backgroundColor: "var(--background)", paddingBottom: "3.5rem" }}>
        <div className="container py-8">
          {/* Admin Header Strip */}
          <div className="admin-header-strip">
            <div>
              <div className="admin-pill-badge" style={{ backgroundColor: "var(--secondary-light)", color: "var(--secondary)" }}>
                AL-UMAIMA SELLER & ADMIN HUB
              </div>
              <h1 className="admin-title">Store Management Dashboard</h1>
              <p className="admin-subtitle">Live store sales metrics, customer orders workflow, and catalog controls</p>
            </div>

            {/* Navigation Tabs */}
            <div className="admin-nav-links" role="tablist" aria-label="Admin Sections">
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === "overview"}
                className={`admin-nav-link ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === "orders"}
                className={`admin-nav-link ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Orders ({orders.length})
              </button>
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === "products"}
                className={`admin-nav-link ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                Products ({productList.length})
              </button>
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === "users"}
                className={`admin-nav-link ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                Users (4)
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="stats-grid-4">
            <div className="stat-card card">
              <div className="stat-icon-wrapper blue">
                <TrendingUp size={24} aria-hidden="true" />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Revenue</span>
                <h3 className="stat-value">${totalRevenue.toFixed(2)}</h3>
                <span className="stat-change positive">
                  <ArrowUpRight size={14} aria-hidden="true" /> +14.2% this week
                </span>
              </div>
            </div>

            <div className="stat-card card">
              <div className="stat-icon-wrapper orange">
                <ShoppingBag size={24} aria-hidden="true" />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Customer Orders</span>
                <h3 className="stat-value">{orders.length}</h3>
                <span className="stat-change positive">
                  <ArrowUpRight size={14} aria-hidden="true" /> Live synced
                </span>
              </div>
            </div>

            <div className="stat-card card">
              <div className="stat-icon-wrapper green">
                <Package size={24} aria-hidden="true" />
              </div>
              <div className="stat-info">
                <span className="stat-label">Active Products</span>
                <h3 className="stat-value">{productList.length}</h3>
                <span className="stat-change">In catalog</span>
              </div>
            </div>

            <div className="stat-card card">
              <div className="stat-icon-wrapper purple">
                <Users size={24} aria-hidden="true" />
              </div>
              <div className="stat-info">
                <span className="stat-label">Registered Customers</span>
                <h3 className="stat-value">1,482</h3>
                <span className="stat-change positive">
                  <ArrowUpRight size={14} aria-hidden="true" /> +32 today
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              {/* Quick Actions Bar */}
              <div className="admin-actions-bar card" style={{ marginBottom: "1.5rem" }}>
                <h3 className="bar-title">Catalog Quick Controls</h3>
                <div className="action-buttons-row">
                  <button 
                    type="button" 
                    onClick={() => setIsAddProductModalOpen(true)} 
                    className="al-umaima-btn-orange" 
                    style={{ width: "auto", height: 42, padding: "0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    <Plus size={16} aria-hidden="true" /> Add New Product
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab("orders")} 
                    className="al-umaima-btn-blue-outline" 
                    style={{ width: "auto", height: 42, padding: "0 1.25rem" }}
                  >
                    Process Orders ({orders.length})
                  </button>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="admin-grid-2">
                {/* Recent Orders Overview */}
                <div className="card dashboard-table-card">
                  <div className="card-header-row">
                    <h3 className="card-title">Recent Orders Queue</h3>
                    <button 
                      type="button" 
                      onClick={() => setActiveTab("orders")} 
                      className="view-all-link"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      View All Orders <ChevronRight size={14} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th scope="col">ORDER ID</th>
                          <th scope="col">DATE</th>
                          <th scope="col">AMOUNT</th>
                          <th scope="col">STATUS</th>
                          <th scope="col">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((ord: UserOrder) => (
                          <tr key={ord.id}>
                            <td className="font-bold" style={{ color: "var(--primary)" }}>{ord.id}</td>
                            <td>{ord.date}</td>
                            <td className="font-bold">${ord.totalAmount.toFixed(2)}</td>
                            <td>
                              <label htmlFor={`status-select-${ord.id}`} className="sr-only" style={{ display: "none" }}>Order Status for {ord.id}</label>
                              <select
                                id={`status-select-${ord.id}`}
                                aria-label={`Order status for ${ord.id}`}
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
                <div className="card dashboard-table-card">
                  <div className="card-header-row">
                    <h3 className="card-title">Catalog Highlights</h3>
                    <button 
                      type="button" 
                      onClick={() => setActiveTab("products")} 
                      className="view-all-link"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      Manage Products <ChevronRight size={14} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="catalog-preview-list">
                    {productList.slice(0, 5).map((p) => (
                      <div key={p.id} className="preview-item">
                        <Image 
                          src={p.image} 
                          alt={p.title} 
                          width={48} 
                          height={48} 
                          className="item-thumb" 
                        />
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
            <div className="card dashboard-table-card">
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
                      <th scope="col">ORDER ID</th>
                      <th scope="col">DATE PLACED</th>
                      <th scope="col">SHIPPING ADDRESS</th>
                      <th scope="col">ITEMS</th>
                      <th scope="col">TOTAL</th>
                      <th scope="col">STATUS WORKFLOW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord: UserOrder) => (
                      <tr key={ord.id}>
                        <td className="font-bold" style={{ color: "var(--primary)" }}>{ord.id}</td>
                        <td>{ord.date}</td>
                        <td style={{ maxWidth: 220 }}>{ord.shippingAddress}</td>
                        <td>
                          {ord.items.map((i: any) => i.title).join(", ")}
                        </td>
                        <td className="font-bold">${ord.totalAmount.toFixed(2)}</td>
                        <td>
                          <label htmlFor={`order-workflow-${ord.id}`} className="sr-only" style={{ display: "none" }}>Update Workflow for {ord.id}</label>
                          <select
                            id={`order-workflow-${ord.id}`}
                            aria-label={`Workflow status for ${ord.id}`}
                            className="status-select"
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                            style={{ 
                              borderColor: ord.status === "Delivered" ? "#10B981" : ord.status === "Cancelled" ? "#EF4444" : "var(--primary)",
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
              <div className="admin-actions-bar card" style={{ marginBottom: "1.5rem" }}>
                <h3 className="bar-title">Product Catalog Inventory</h3>
                <button 
                  type="button" 
                  onClick={() => setIsAddProductModalOpen(true)} 
                  className="al-umaima-btn-orange" 
                  style={{ width: "auto", height: 42, padding: "0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Plus size={16} aria-hidden="true" /> Add New Product
                </button>
              </div>

              <div className="card dashboard-table-card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th scope="col">PRODUCT ITEM</th>
                        <th scope="col">CATEGORY</th>
                        <th scope="col">PRICE</th>
                        <th scope="col">STOCK</th>
                        <th scope="col">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="product-table-item">
                              <Image 
                                src={p.image} 
                                alt={p.title} 
                                width={42} 
                                height={42} 
                                className="table-item-img" 
                              />
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
                              <button 
                                type="button"
                                onClick={() => handleDeleteProduct(p.id, p.title)} 
                                className="icon-btn delete" 
                                title={`Delete ${p.title}`}
                                aria-label={`Delete ${p.title} from catalog`}
                              >
                                <Trash2 size={16} aria-hidden="true" />
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
            <div className="card dashboard-table-card">
              <h3 className="card-title" style={{ marginBottom: "1rem" }}>Registered Users Directory</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col">USER NAME</th>
                      <th scope="col">EMAIL ADDRESS</th>
                      <th scope="col">PHONE</th>
                      <th scope="col">ROLE</th>
                      <th scope="col">JOIN DATE</th>
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
                      <td className="font-bold">Al-Umaima SuperAdmin</td>
                      <td>admin@al-umaima.com</td>
                      <td>9999988888</td>
                      <td><span className="cat-badge" style={{ background: "var(--secondary-light)", color: "var(--secondary)" }}>SuperAdmin</span></td>
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

        {/* Add Product Modal with Focus Trap & Semantic Labels */}
        {isAddProductModalOpen && (
          <div className="modal-backdrop" onClick={() => setIsAddProductModalOpen(false)}>
            <div 
              ref={modalRef}
              tabIndex={-1}
              className="admin-modal-card" 
              onClick={(e) => e.stopPropagation()} 
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-modal-title"
            >
              <div className="modal-header-row">
                <h3 id="admin-modal-title">Add New Al-Umaima Product</h3>
                <button 
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)} 
                  className="close-btn"
                  aria-label="Close add product dialog"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="admin-form">
                <div className="form-group">
                  <label htmlFor="admin-prod-title">Product Title *</label>
                  <input
                    id="admin-prod-title"
                    name="title"
                    type="text"
                    placeholder="e.g. Wireless Noise Cancelling Earbuds"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="admin-prod-category">Category *</label>
                    <select 
                      id="admin-prod-category" 
                      name="category"
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Appliances">Appliances</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="admin-prod-price">Price ($) *</label>
                    <input
                      id="admin-prod-price"
                      name="price"
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
                    <label htmlFor="admin-prod-original-price">Original MRP ($)</label>
                    <input
                      id="admin-prod-original-price"
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      placeholder="129.99"
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="admin-prod-stock">Initial Stock Qty</label>
                    <input
                      id="admin-prod-stock"
                      name="stock"
                      type="number"
                      placeholder="50"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="admin-prod-image">Product Image URL</label>
                  <input
                    id="admin-prod-image"
                    name="image"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-prod-desc">Description</label>
                  <textarea
                    id="admin-prod-desc"
                    name="description"
                    rows={3}
                    placeholder="Detailed product features..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>

                <div className="modal-actions-row">
                  <button 
                    type="button" 
                    onClick={() => setIsAddProductModalOpen(false)} 
                    style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="al-umaima-btn-orange" style={{ width: "auto", padding: "0 1.5rem" }}>
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
