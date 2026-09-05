"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  Layers, 
  X, 
  Check, 
  Headphones, 
  Shirt, 
  Home, 
  Watch, 
  Tv, 
  Smartphone 
} from "lucide-react";
import { categories as initialCategories, Category } from "@/data/products";
import "@/styles/admin.css";
import Image from "next/image";


export default function AdminCategoriesPage() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Category Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<any>("Headphones");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategoryList(data.data);
        } else {
          setCategoryList(initialCategories);
        }
        setLoading(false);
      })
      .catch(() => {
        setCategoryList(initialCategories);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategoryList((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setSaving(true);
    const newCat = {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      icon,
      description: description || "Product category collection.",
      itemCount: 0,
      image: image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    };

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
      const data = await res.json();
      if (data.success) {
        setCategoryList([...categoryList, data.data]);
      } else {
        setCategoryList([...categoryList, newCat as any]);
      }
    } catch {
      setCategoryList([...categoryList, newCat as any]);
    }

    setSaving(false);
    setIsAddModalOpen(false);
    setName("");
    setDescription("");
    setImage("");
  };

  const filteredCategories = categoryList.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-root-container">
      <div className="container py-8">
          {/* Admin Header Strip */}
          <div className="admin-header-strip">
            <div>
              <Link href="/admin" className="back-link">
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
              <h1 className="admin-title">Category Management</h1>
              <p className="admin-subtitle">Organize and manage store categories and product departments</p>
            </div>

            <div className="admin-nav-links">
              <Link href="/admin" className="admin-nav-link">Overview</Link>
              <Link href="/admin/products" className="admin-nav-link">Products</Link>
              <Link href="/admin/categories" className="admin-nav-link active">Categories ({categoryList.length})</Link>
              <Link href="/admin/orders" className="admin-nav-link">Orders</Link>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="admin-actions-bar card">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} /> Add Category
            </button>
          </div>

          {/* Category Cards Grid */}
          <div className="admin-cat-grid mt-6">
            {filteredCategories.map((cat) => (
              <div key={cat.id} className="card admin-cat-card">
                <div className="cat-card-img-wrap">
                  <Image width={500} height={500} src={cat.image || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={cat.name} className="cat-card-img" />
                  <span className="cat-item-count">{cat.itemCount} Items</span>
                </div>

                <div className="cat-card-body">
                  <div className="cat-header">
                    <h3 className="cat-title">{cat.name}</h3>
                    <span className="cat-slug">/{cat.slug}</span>
                  </div>

                  <p className="cat-desc">{cat.description}</p>

                  <div className="cat-footer-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => alert(`Editing category ${cat.name}`)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className="btn btn-outline btn-sm text-danger" onClick={() => handleDelete(cat.id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Add New Category</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="admin-form">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Smart Watches & Gear"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Icon Type</label>
                <select value={icon} onChange={(e) => setIcon(e.target.value)}>
                  <option value="Headphones">Headphones</option>
                  <option value="Shirt">Shirt</option>
                  <option value="Home">Home</option>
                  <option value="Watch">Watch</option>
                </select>
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
                  placeholder="Short description of products in this category..."
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
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
