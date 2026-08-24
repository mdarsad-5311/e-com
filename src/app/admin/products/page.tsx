"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  Package, 
  Check, 
  X, 
  Image as ImageIcon,
  DollarSign
} from "lucide-react";
import { products, categories, Product } from "@/data/products";
import "@/styles/admin.css";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Product Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("electronics");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("50");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProductList(data.data);
        } else {
          setProductList(products);
        }
        setLoading(false);
      })
      .catch(() => {
        setProductList(products);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProductList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    setSaving(true);
    const catObj = categories.find((c) => c.id === category);

    const payload = {
      title,
      category,
      categoryName: catObj ? catObj.name : "General",
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price) * 1.25,
      stock: parseInt(stock) || 50,
      image: image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      description: description || "Premium e-commerce catalog product.",
      badge: "NEW",
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProductList([data.data, ...productList]);
      } else {
        const newLocal: Product = {
          id: `prod-${Date.now()}`,
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          category,
          categoryName: catObj ? catObj.name : "General",
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price) * 1.2,
          rating: 5.0,
          reviewsCount: 0,
          badge: "NEW",
          isFeatured: true,
          isBestSeller: false,
          image: image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
          description: description || "Product description.",
          specifications: ["Standard Warranty"],
          stock: parseInt(stock) || 50,
        };
        setProductList([newLocal, ...productList]);
      }
    } catch {
      const newLocal: Product = {
        id: `prod-${Date.now()}`,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category,
        categoryName: catObj ? catObj.name : "General",
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price) * 1.2,
        rating: 5.0,
        reviewsCount: 0,
        badge: "NEW",
        isFeatured: true,
        isBestSeller: false,
        image: image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        description: description || "Product description.",
        specifications: ["Standard Warranty"],
        stock: parseInt(stock) || 50,
      };
      setProductList([newLocal, ...productList]);
    }

    setSaving(false);
    setIsAddModalOpen(false);
    // Reset form
    setTitle("");
    setPrice("");
    setOriginalPrice("");
    setImage("");
    setDescription("");
  };

  const filteredProducts = productList.filter((p) => {
    const matchesCategory = selectedCategory === "ALL" ? true : p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
              <h1 className="admin-title">Product Management</h1>
              <p className="admin-subtitle">Add, update, or remove inventory items across store categories</p>
            </div>

            <div className="admin-nav-links">
              <Link href="/admin" className="admin-nav-link">Overview</Link>
              <Link href="/admin/products" className="admin-nav-link active">Products ({productList.length})</Link>
              <Link href="/admin/categories" className="admin-nav-link">Categories</Link>
              <Link href="/admin/orders" className="admin-nav-link">Orders</Link>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="admin-actions-bar card">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="toolbar-controls">
              <select
                className="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="card dashboard-table-card mt-6">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="product-table-item">
                          <img src={p.image} alt={p.title} className="table-item-img" />
                          <div>
                            <div className="item-title font-bold">{p.title}</div>
                            <div className="item-id text-muted">{p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="cat-badge">{p.categoryName}</span>
                      </td>
                      <td>
                        <div className="price-stack">
                          <span className="font-bold">${p.price.toFixed(2)}</span>
                          {p.originalPrice && (
                            <span className="orig-price">${p.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`stock-badge ${p.stock < 10 ? "low-stock" : ""}`}>
                          {p.stock || 50} units
                        </span>
                      </td>
                      <td>
                        <span className="rating-pill-sm">★ {p.rating}</span>
                      </td>
                      <td>
                        <div className="action-row">
                          <button
                            className="icon-btn edit"
                            onClick={() => alert(`Editing product: ${p.title}`)}
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="icon-btn delete"
                            onClick={() => handleDelete(p.id)}
                            title="Delete Product"
                          >
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

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Add New Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="admin-form">
              <div className="form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. UltraBass Wireless Headphones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="129.99"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Initial Stock</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed product features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
