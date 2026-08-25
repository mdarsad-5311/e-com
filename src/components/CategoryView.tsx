"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { products, Product, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import "@/styles/category-page.css";

interface CategoryViewProps {
  category: Category;
  initialProducts: Product[];
}

export default function CategoryView({ category, initialProducts }: CategoryViewProps) {
  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter & Accordion States
  const [openSections, setOpenSections] = useState({
    brand: true,
    price: true,
    rating: true,
    discount: false,
  });

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");

  const toggleSection = (sectionKey: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const handleClearAll = () => {
    setSelectedBrands([]);
    setSelectedPriceRange("all");
    setSelectedRatings([]);
    setSortBy("featured");
  };

  const filteredProducts = useMemo<Product[]>(() => {
    return initialProducts
      .filter((p: Product) => {
        if (selectedBrands.length > 0) {
          const productBrand = p.brand || (p.title.includes("Aura") ? "Aura" : p.title.includes("Pulse") ? "Pulse" : p.title.includes("Vortex") ? "Vortex" : "Sony");
          if (!selectedBrands.includes(productBrand)) {
            return false;
          }
        }

        if (selectedPriceRange === "under-50" && p.price >= 50) return false;
        if (selectedPriceRange === "50-100" && (p.price < 50 || p.price > 100)) return false;
        if (selectedPriceRange === "100-250" && (p.price < 100 || p.price > 250)) return false;
        if (selectedPriceRange === "over-250" && p.price <= 250) return false;

        if (selectedRatings.length > 0) {
          const minRating = Math.min(...selectedRatings);
          if (p.rating < minRating) return false;
        }

        return true;
      })
      .sort((a: Product, b: Product) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [initialProducts, selectedBrands, selectedPriceRange, selectedRatings, sortBy]);

  const availableBrands = [
    { name: "Sony", count: 12 },
    { name: "JBL", count: 8 },
    { name: "Keychron", count: 6 },
    { name: "Apple", count: 14 },
    { name: "AURA AUDIO", count: 24 },
    { name: "Pulse", count: 18 },
  ];

  return (
    <div className="al-catalog-page">
      {/* Mobile Top Sub-Toolbar: Filter on Left, Sort on Right (Matching Reference Screenshot) */}
      <div className="al-mobile-filter-toolbar">
        <div className="container al-mobile-toolbar-flex">
          <button
            type="button"
            className="al-mobile-filter-trigger"
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Filter products"
          >
            <SlidersHorizontal size={15} className="filter-icon" />
            <span>Filter</span>
          </button>

          <div className="al-mobile-sort-wrap">
            <span className="al-sort-prefix">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="al-mobile-sort-select"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown size={14} className="al-sort-chevron" />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="al-catalog-layout">
          {/* Left Sidebar Filters (Desktop) */}
          <aside className="al-filter-sidebar desktop-filter-sidebar">
            <div className="al-filter-top-row">
              <span className="al-filter-heading">Filters</span>
              <button onClick={handleClearAll} className="al-clear-all-btn">
                Clear All
              </button>
            </div>

            {/* Brand Filter */}
            <div className="al-filter-section">
              <button
                type="button"
                className="al-section-toggle-btn"
                onClick={() => toggleSection("brand")}
              >
                <span>Brand</span>
                {openSections.brand ? <ChevronUp size={16} className="toggle-chevron" /> : <ChevronDown size={16} className="toggle-chevron" />}
              </button>

              {openSections.brand && (
                <div className="al-filter-options-list">
                  {availableBrands.map((b) => (
                    <label key={b.name} className="al-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.name)}
                        onChange={() => handleBrandChange(b.name)}
                        className="al-custom-checkbox"
                      />
                      <span>{b.name} <span className="al-count-tag">({b.count})</span></span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="al-filter-section">
              <button
                type="button"
                className="al-section-toggle-btn"
                onClick={() => toggleSection("price")}
              >
                <span>Price</span>
                {openSections.price ? <ChevronUp size={16} className="toggle-chevron" /> : <ChevronDown size={16} className="toggle-chevron" />}
              </button>

              {openSections.price && (
                <div className="al-filter-options-list">
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="cat-price"
                      checked={selectedPriceRange === "all"}
                      onChange={() => setSelectedPriceRange("all")}
                      className="al-custom-radio"
                    />
                    <span>All Prices</span>
                  </label>
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="cat-price"
                      checked={selectedPriceRange === "under-50"}
                      onChange={() => setSelectedPriceRange("under-50")}
                      className="al-custom-radio"
                    />
                    <span>Under $50</span>
                  </label>
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="cat-price"
                      checked={selectedPriceRange === "50-100"}
                      onChange={() => setSelectedPriceRange("50-100")}
                      className="al-custom-radio"
                    />
                    <span>$50 - $100</span>
                  </label>
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="cat-price"
                      checked={selectedPriceRange === "100-250"}
                      onChange={() => setSelectedPriceRange("100-250")}
                      className="al-custom-radio"
                    />
                    <span>$100 - $250</span>
                  </label>
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="cat-price"
                      checked={selectedPriceRange === "over-250"}
                      onChange={() => setSelectedPriceRange("over-250")}
                      className="al-custom-radio"
                    />
                    <span>Over $250</span>
                  </label>
                </div>
              )}
            </div>

            {/* Customer Rating Filter */}
            <div className="al-filter-section">
              <button
                type="button"
                className="al-section-toggle-btn"
                onClick={() => toggleSection("rating")}
              >
                <span>Customer Rating</span>
                {openSections.rating ? <ChevronUp size={16} className="toggle-chevron" /> : <ChevronDown size={16} className="toggle-chevron" />}
              </button>

              {openSections.rating && (
                <div className="al-filter-options-list">
                  <label className="al-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(4)}
                      onChange={() => handleRatingChange(4)}
                      className="al-custom-checkbox"
                    />
                    <span>4 ★ & Up</span>
                  </label>
                  <label className="al-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(3)}
                      onChange={() => handleRatingChange(3)}
                      className="al-custom-checkbox"
                    />
                    <span>3 ★ & Up</span>
                  </label>
                </div>
              )}
            </div>

            {/* Discount Filter */}
            <div className="al-filter-section">
              <button
                type="button"
                className="al-section-toggle-btn"
                onClick={() => toggleSection("discount")}
              >
                <span>Discount</span>
                {openSections.discount ? <ChevronUp size={16} className="toggle-chevron" /> : <ChevronDown size={16} className="toggle-chevron" />}
              </button>

              {openSections.discount && (
                <div className="al-filter-options-list">
                  <label className="al-checkbox-label">
                    <input type="checkbox" className="al-custom-checkbox" />
                    <span>10% or more</span>
                  </label>
                  <label className="al-checkbox-label">
                    <input type="checkbox" className="al-custom-checkbox" />
                    <span>20% or more</span>
                  </label>
                </div>
              )}
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main className="al-catalog-main">
            {/* Desktop Header: Title on Left, Sort by on Right */}
            <div className="al-catalog-header-row desktop-only-row">
              <h1 className="al-category-main-title">{category.name}</h1>

              <div className="al-sort-control">
                <span className="al-sort-label">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="al-sort-select"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid (2 columns on mobile, 4 columns on desktop) */}
            {filteredProducts.length > 0 ? (
              <div className="al-products-grid-4">
                {filteredProducts.map((prod: Product) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="al-empty-catalog">
                <h3>No products found</h3>
                <p>Try clearing some filters to view available items.</p>
                <button onClick={handleClearAll} className="al-clear-all-btn" style={{ fontSize: "0.95rem" }}>
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination: < [1] 2 3 ... 8 > */}
            <div className="al-pagination-bar">
              <button className="al-page-btn" disabled aria-label="Previous Page">
                <ChevronLeft size={16} />
              </button>
              <button className="al-page-btn active">1</button>
              <button className="al-page-btn">2</button>
              <button className="al-page-btn">3</button>
              <span className="al-page-ellipsis">...</span>
              <button className="al-page-btn">8</button>
              <button className="al-page-btn" aria-label="Next Page">
                <ChevronRight size={16} />
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal / Drawer */}
      {isMobileFilterOpen && (
        <div className="mobile-filter-modal-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="mobile-filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-filter-header">
              <h3>Filters</h3>
              <button
                type="button"
                className="mobile-filter-close-btn"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-filter-body">
              {/* Brand Filter */}
              <div className="al-filter-section">
                <div className="mobile-section-heading">Brand</div>
                <div className="al-filter-options-list">
                  {availableBrands.map((b) => (
                    <label key={b.name} className="al-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.name)}
                        onChange={() => handleBrandChange(b.name)}
                        className="al-custom-checkbox"
                      />
                      <span>{b.name} <span className="al-count-tag">({b.count})</span></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="al-filter-section">
                <div className="mobile-section-heading">Price</div>
                <div className="al-filter-options-list">
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="m-cat-price"
                      checked={selectedPriceRange === "all"}
                      onChange={() => setSelectedPriceRange("all")}
                      className="al-custom-radio"
                    />
                    <span>All Prices</span>
                  </label>
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="m-cat-price"
                      checked={selectedPriceRange === "under-50"}
                      onChange={() => setSelectedPriceRange("under-50")}
                      className="al-custom-radio"
                    />
                    <span>Under $50</span>
                  </label>
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="m-cat-price"
                      checked={selectedPriceRange === "50-100"}
                      onChange={() => setSelectedPriceRange("50-100")}
                      className="al-custom-radio"
                    />
                    <span>$50 - $100</span>
                  </label>
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="m-cat-price"
                      checked={selectedPriceRange === "100-250"}
                      onChange={() => setSelectedPriceRange("100-250")}
                      className="al-custom-radio"
                    />
                    <span>$100 - $250</span>
                  </label>
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="m-cat-price"
                      checked={selectedPriceRange === "over-250"}
                      onChange={() => setSelectedPriceRange("over-250")}
                      className="al-custom-radio"
                    />
                    <span>Over $250</span>
                  </label>
                </div>
              </div>

              {/* Customer Rating Filter */}
              <div className="al-filter-section">
                <div className="mobile-section-heading">Customer Rating</div>
                <div className="al-filter-options-list">
                  <label className="al-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(4)}
                      onChange={() => handleRatingChange(4)}
                      className="al-custom-checkbox"
                    />
                    <span>4 ★ & Up</span>
                  </label>
                  <label className="al-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(3)}
                      onChange={() => handleRatingChange(3)}
                      className="al-custom-checkbox"
                    />
                    <span>3 ★ & Up</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mobile-filter-footer">
              <button
                type="button"
                className="mobile-filter-reset-btn"
                onClick={handleClearAll}
              >
                Clear All
              </button>
              <button
                type="button"
                className="mobile-filter-apply-btn"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                View Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
