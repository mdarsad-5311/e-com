"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Product, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import "@/styles/category-page.css";

interface CategoryViewProps {
  category: Category;
  initialProducts: Product[];
}

export default function CategoryView({ category, initialProducts }: CategoryViewProps) {
  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Accordion open/close states
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);

  // Filter criteria - all subcategories shown by default
  const [selectedSubCats, setSelectedSubCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const subCategoriesList = [
    "Headphones",
    "Wearables",
    "Keyboards",
    "Laptops",
    "Smartphones",
  ];

  const brandsList = [
    "Aura",
    "Chronox",
    "Keychron",
  ];

  const handleSubCatChange = (subCat: string) => {
    setSelectedSubCats((prev) =>
      prev.includes(subCat) ? prev.filter((s) => s !== subCat) : [...prev, subCat]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleClearAll = () => {
    setSelectedSubCats([]);
    setSelectedBrands([]);
    setSortBy("recommended");
  };

  const filteredProducts = useMemo<Product[]>(() => {
    return initialProducts
      .filter((p: Product) => {
        // Subcategory filter
        if (selectedSubCats.length > 0) {
          const productSubCat = p.subCategory || (
            p.title.toLowerCase().includes("headphone") || p.title.toLowerCase().includes("buds") ? "Headphones" :
            p.title.toLowerCase().includes("watch") ? "Wearables" :
            p.title.toLowerCase().includes("keyboard") ? "Keyboards" :
            p.title.toLowerCase().includes("laptop") || p.title.toLowerCase().includes("ultrabook") ? "Laptops" :
            p.title.toLowerCase().includes("phone") ? "Smartphones" : "Headphones"
          );
          if (!selectedSubCats.includes(productSubCat)) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrands.length > 0) {
          const productBrand = p.brand || (
            p.title.includes("Aura") ? "Aura" :
            p.title.includes("Chronox") ? "Chronox" :
            p.title.includes("Keychron") ? "Keychron" : "Aura"
          );
          if (!selectedBrands.includes(productBrand)) {
            return false;
          }
        }

        return true;
      })
      .sort((a: Product, b: Product) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // recommended
      });
  }, [initialProducts, selectedSubCats, selectedBrands, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="al-catalog-wrapper">
      <div className="container">
        {/* Top Breadcrumb & Sort Bar */}
        <div className="al-catalog-top-bar">
          <div className="al-breadcrumbs">
            <Link href="/" className="al-breadcrumb-link">Home</Link>
            <ChevronRight size={14} className="al-breadcrumb-arrow" />
            <span className="al-breadcrumb-current">{category?.name || "Electronics"}</span>
          </div>

          <div className="al-sort-container">
            <div className="al-sort-box">
              <span className="al-sort-label">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="al-sort-select"
                aria-label="Sort products"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown size={14} className="al-sort-chevron" />
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              type="button" 
              className="al-mobile-filter-btn"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Catalog Layout */}
        <div className="al-catalog-layout">
          {/* Left Sidebar: Filters */}
          <aside className="al-filter-sidebar">
            <div className="al-filter-header">
              <h2 className="al-filter-title">Filters</h2>
              <button 
                type="button" 
                onClick={handleClearAll} 
                className="al-clear-all-link"
              >
                Clear All
              </button>
            </div>

            {/* Section 1: Category */}
            <div className="al-filter-group">
              <button
                type="button"
                className="al-group-toggle-btn"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <span>Category</span>
                {isCategoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isCategoryOpen && (
                <div className="al-options-list">
                  {subCategoriesList.map((item) => (
                    <label key={item} className="al-checkbox-row">
                      <input
                        type="checkbox"
                        checked={selectedSubCats.includes(item)}
                        onChange={() => handleSubCatChange(item)}
                        className="al-checkbox-input"
                      />
                      <span className="al-checkbox-text">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Brand */}
            <div className="al-filter-group">
              <button
                type="button"
                className="al-group-toggle-btn"
                onClick={() => setIsBrandOpen(!isBrandOpen)}
              >
                <span>Brand</span>
                {isBrandOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isBrandOpen && (
                <div className="al-options-list">
                  {brandsList.map((brand) => (
                    <label key={brand} className="al-checkbox-row">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="al-checkbox-input"
                      />
                      <span className="al-checkbox-text">{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Right Area: Products Grid & Load More */}
          <main className="al-catalog-content">
            {displayedProducts.length > 0 ? (
              <>
                <div className="al-products-grid">
                  {displayedProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>

                {visibleCount < filteredProducts.length && (
                  <div className="al-load-more-wrap">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 4)}
                      className="al-load-more-btn"
                    >
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="al-empty-catalog">
                <h3>No products match the selected filters</h3>
                <p>Try unchecking some filter categories or brands.</p>
                <button 
                  type="button" 
                  onClick={handleClearAll} 
                  className="al-load-more-btn"
                  style={{ marginTop: "1rem" }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="al-mobile-modal-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="al-mobile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="al-mobile-modal-header">
              <h3>Filters</h3>
              <button 
                type="button" 
                onClick={() => setIsMobileFilterOpen(false)}
                className="al-modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="al-mobile-modal-body">
              <div className="al-filter-group">
                <div className="al-modal-section-title">Category</div>
                <div className="al-options-list">
                  {subCategoriesList.map((item) => (
                    <label key={item} className="al-checkbox-row">
                      <input
                        type="checkbox"
                        checked={selectedSubCats.includes(item)}
                        onChange={() => handleSubCatChange(item)}
                        className="al-checkbox-input"
                      />
                      <span className="al-checkbox-text">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="al-filter-group" style={{ marginTop: "1.5rem" }}>
                <div className="al-modal-section-title">Brand</div>
                <div className="al-options-list">
                  {brandsList.map((brand) => (
                    <label key={brand} className="al-checkbox-row">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="al-checkbox-input"
                      />
                      <span className="al-checkbox-text">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="al-mobile-modal-footer">
              <button 
                type="button" 
                onClick={handleClearAll} 
                className="al-modal-clear-btn"
              >
                Clear All
              </button>
              <button 
                type="button" 
                onClick={() => setIsMobileFilterOpen(false)} 
                className="al-modal-apply-btn"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
