"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Product, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
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

  const subCategoriesList = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.subCategory) set.add(p.subCategory);
    });
    return set.size > 0 ? Array.from(set) : ["Headphones", "Wearables", "Keyboards", "Laptops", "Smartphones"];
  }, [initialProducts]);

  const brandsList = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return set.size > 0 ? Array.from(set) : ["Sony", "Bose", "Sennheiser", "Apple", "Aura"];
  }, [initialProducts]);

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
          const productSubCat = p.subCategory || "";
          if (!selectedSubCats.includes(productSubCat) && !selectedSubCats.some((s) => p.title.toLowerCase().includes(s.toLowerCase()))) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrands.length > 0) {
          const productBrand = p.brand || "";
          if (!selectedBrands.includes(productBrand) && !selectedBrands.some((b) => p.title.toLowerCase().includes(b.toLowerCase()))) {
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
            <span className="al-breadcrumb-current">{category?.name || "Catalog"}</span>
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
              <h3 className="al-filter-group-label">Category</h3>
              <div className="al-options-list">
                {subCategoriesList.slice(0, 6).map((item) => (
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

            {/* Section 2: Price Range (Attachment 4) */}
            <div className="al-filter-group">
              <h3 className="al-filter-group-label">Price Range</h3>
              <div className="al-price-range-inputs">
                <div className="al-price-input-box">
                  <span className="al-price-prefix">$</span>
                  <input type="number" placeholder="50" defaultValue="50" className="al-price-input" />
                </div>
                <span className="al-price-dash">-</span>
                <div className="al-price-input-box">
                  <span className="al-price-prefix">$</span>
                  <input type="text" placeholder="Max" defaultValue="Max" className="al-price-input" />
                </div>
              </div>
            </div>

            {/* Section 3: Brand Chips (Attachment 4) */}
            <div className="al-filter-group">
              <h3 className="al-filter-group-label">Brand</h3>
              <div className="al-brand-chips-row">
                {brandsList.slice(0, 6).map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`al-brand-chip ${selectedBrands.includes(b) ? "active" : ""}`}
                    onClick={() => handleBrandChange(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Filters Button (Attachment 4) */}
            <button type="button" className="al-btn-apply-filters">
              Apply Filters
            </button>
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
