"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter, SlidersHorizontal, Search, RotateCcw, X, Star, Check } from "lucide-react";
import { products, categories, Product, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialFeatured = searchParams.get("featured") === "true";
  const initialSort = searchParams.get("sort") || "featured";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [maxPrice, setMaxPrice] = useState<number>(400);
  const [minRating, setMinRating] = useState<number>(0);
  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] = useState<boolean>(false);

  const filteredProducts = useMemo<Product[]>(() => {
    return products
      .filter((p: Product) => {
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchCat = p.categoryName.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchTitle && !matchCat && !matchDesc) return false;
        }
        if (p.price > maxPrice) {
          return false;
        }
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }
        if (initialFeatured && !p.isFeatured) {
          return false;
        }
        return true;
      })
      .sort((a: Product, b: Product) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [selectedCategory, searchQuery, maxPrice, minRating, sortBy, initialFeatured]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    setMaxPrice(400);
    setMinRating(0);
  };

  const FilterPanelContent = () => (
    <>
      <div className="sidebar-title-row">
        <div className="sidebar-title">
          <Filter size={18} /> Filter Products
        </div>
        <button onClick={handleResetFilters} className="reset-btn" title="Reset Filters">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div className="filter-group">
        <label className="filter-label">Search Keywords</label>
        <div className="filter-search-input">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Title, brand, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-label">Categories</label>
        <div className="category-filter-list">
          <button
            className={`cat-filter-btn ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            <span>All Categories</span>
            <span className="count-pill">{products.length}</span>
          </button>
          {categories.map((cat: Category) => (
            <button
              key={cat.id}
              className={`cat-filter-btn ${selectedCategory === cat.slug ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              <span>{cat.name}</span>
              <span className="count-pill">{products.filter((p) => p.category === cat.slug).length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="filter-group">
        <div className="filter-label-row">
          <label className="filter-label">Max Price</label>
          <span className="price-val">${maxPrice}</span>
        </div>
        <input
          type="range"
          min="40"
          max="400"
          step="10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="price-slider"
        />
      </div>

      {/* Star Rating Filter */}
      <div className="filter-group">
        <label className="filter-label">Minimum Rating</label>
        <div className="rating-filter-list">
          {[0, 4.5, 4.7, 4.8].map((rating) => (
            <button
              key={rating}
              className={`rating-filter-btn ${minRating === rating ? "active" : ""}`}
              onClick={() => setMinRating(rating)}
            >
              {rating === 0 ? (
                "All Ratings"
              ) : (
                <span className="flex-align">
                  <Star size={13} fill="#F59E0B" color="#F59E0B" /> {rating}★ & Above
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="container section">
      <div className="products-page-header">
        <div>
          <h1 className="section-title">Shop All Products</h1>
          <p className="section-subtitle">
            Showing {filteredProducts.length} results matching your search criteria
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button 
          className="mobile-filter-trigger-btn"
          onClick={() => setIsMobileFilterDrawerOpen(true)}
        >
          <SlidersHorizontal size={18} /> Filters & Refine
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="catalog-layout">
        {/* Desktop Sidebar Filters */}
        <aside className="filters-sidebar">
          <FilterPanelContent />
        </aside>

        {/* Mobile Filter Drawer Overlay */}
        {isMobileFilterDrawerOpen && (
          <div className="mobile-drawer-overlay">
            <div className="mobile-drawer-box">
              <div className="drawer-header">
                <h3>Filter Products</h3>
                <button onClick={() => setIsMobileFilterDrawerOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <div className="drawer-body">
                <FilterPanelContent />
              </div>
              <div className="drawer-footer">
                <button 
                  className="btn btn-primary w-full"
                  onClick={() => setIsMobileFilterDrawerOpen(false)}
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Catalog Main Grid */}
        <main className="catalog-main">
          {/* Sorting Header Bar */}
          <div className="sort-bar-card">
            <div className="sort-label">
              <SlidersHorizontal size={16} /> Sort By:
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select-input"
            >
              <option value="featured">Featured & Best Selling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Grid of Products */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid-catalog">
              {filteredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-results-card">
              <h3>No products found</h3>
              <p>Try resetting your filters or adjusting your price slider.</p>
              <button onClick={handleResetFilters} className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .products-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }

        .mobile-filter-trigger-btn {
          display: none;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.1rem;
          border-radius: var(--radius-pill);
          background: var(--primary);
          color: #FFFFFF;
          font-size: 0.875rem;
          font-weight: 700;
        }

        .catalog-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          align-items: start;
        }

        .filters-sidebar {
          background: #FFFFFF;
          border: 1px solid var(--borders);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          position: sticky;
          top: 100px;
        }

        .sidebar-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--borders);
        }

        .sidebar-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 800;
          color: var(--text);
        }

        .reset-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .reset-btn:hover {
          color: var(--danger);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .filter-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .filter-search-input {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--background);
          border: 1px solid var(--borders);
          border-radius: 12px;
          padding: 0.6rem 0.85rem;
        }

        .filter-search-input input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: var(--text);
        }

        .category-filter-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .cat-filter-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 0.85rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
          background: transparent;
          transition: all 0.2s ease;
        }

        .cat-filter-btn:hover {
          background: var(--background);
          color: var(--primary);
        }

        .cat-filter-btn.active {
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 800;
        }

        .count-pill {
          font-size: 0.725rem;
          background: #F1F5F9;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          color: var(--text-muted);
        }

        .filter-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-val {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--primary);
        }

        .price-slider {
          width: 100%;
          accent-color: var(--primary);
          cursor: pointer;
        }

        .rating-filter-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .rating-filter-btn {
          text-align: left;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
        }

        .rating-filter-btn.active {
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 800;
        }

        .flex-align { display: flex; align-items: center; gap: 0.3rem; }

        .sort-bar-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid var(--borders);
          border-radius: 16px;
          padding: 0.85rem 1.25rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }

        .sort-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text);
        }

        .sort-select-input {
          background: var(--background);
          border: 1px solid var(--borders);
          border-radius: 10px;
          padding: 0.45rem 0.85rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
          outline: none;
        }

        .products-grid-catalog {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        .empty-results-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid var(--borders);
          padding: 4rem 2rem;
          text-align: center;
        }

        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17, 24, 39, 0.6);
          backdrop-filter: blur(8px);
          z-index: 150;
          display: flex;
          justify-content: flex-end;
        }

        .mobile-drawer-box {
          width: 320px;
          height: 100%;
          background: #FFFFFF;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .w-full { width: 100%; }

        @media (max-width: 1024px) {
          .products-grid-catalog { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 868px) {
          .catalog-layout { grid-template-columns: 1fr; }
          .filters-sidebar { display: none; }
          .mobile-filter-trigger-btn { display: inline-flex; }
        }

        @media (max-width: 580px) {
          .products-grid-catalog { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container section">Loading products catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
