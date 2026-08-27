"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  RotateCcw,
  Zap,
  CheckCircle2
} from "lucide-react";
import { Product, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import "@/styles/category-page.css";

interface CategoryViewProps {
  category: Category;
  initialProducts: Product[];
}

export default function CategoryView({ category, initialProducts }: CategoryViewProps) {
  const isNewArrivals = category?.slug === "new-arrivals";
  const isDeals = category?.slug === "deals";

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Accordion open/close states
  const [openSections, setOpenSections] = useState({
    subCategory: true,
    brand: true,
    price: true,
    rating: true,
  });

  // Filter criteria
  const [selectedSubCats, setSelectedSubCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const subCategoriesList = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.subCategory) set.add(p.subCategory);
    });
    return set.size > 0 ? Array.from(set) : ["Headphones", "Wearables", "Keyboards", "Laptops", "Smartphones", "Smart Home"];
  }, [initialProducts]);

  const brandsList = useMemo(() => {
    const brandMap = new Map<string, number>();
    initialProducts.forEach((p) => {
      const b = p.brand || "Al-Umaima";
      brandMap.set(b, (brandMap.get(b) || 0) + 1);
    });
    return Array.from(brandMap.entries()).map(([name, count]) => ({ name, count }));
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

  const handleRatingChange = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const handleClearAll = () => {
    setSelectedSubCats([]);
    setSelectedBrands([]);
    setSelectedPriceRange("all");
    setSelectedRatings([]);
    setSortBy("recommended");
  };

  const filteredProducts = useMemo<Product[]>(() => {
    return initialProducts
      .filter((p: Product) => {
        // Subcategory filter
        if (selectedSubCats.length > 0) {
          const productSubCat = p.subCategory || "";
          const matches = selectedSubCats.some(
            (s) => productSubCat.toLowerCase() === s.toLowerCase() || p.title.toLowerCase().includes(s.toLowerCase())
          );
          if (!matches) return false;
        }

        // Brand filter
        if (selectedBrands.length > 0) {
          const productBrand = p.brand || "Al-Umaima";
          if (!selectedBrands.includes(productBrand)) {
            return false;
          }
        }

        // Price range filter
        if (selectedPriceRange === "under-50" && p.price >= 50) return false;
        if (selectedPriceRange === "50-100" && (p.price < 50 || p.price > 100)) return false;
        if (selectedPriceRange === "100-250" && (p.price < 100 || p.price > 250)) return false;
        if (selectedPriceRange === "over-250" && p.price <= 250) return false;

        // Rating filter
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
        if (sortBy === "newest") return (b.badge === "NEW" ? 1 : 0) - (a.badge === "NEW" ? 1 : 0);
        return 0; // recommended
      });
  }, [initialProducts, selectedSubCats, selectedBrands, selectedPriceRange, selectedRatings, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="al-catalog-wrapper">
      {/* 1. NEW ARRIVALS SPOTLIGHT BANNER */}
      {isNewArrivals && (
        <section className="al-deals-spotlight-hero al-new-arrivals-hero">
          <div className="container">
            <div className="al-deals-hero-inner">
              <div className="al-deals-hero-text">
                <div className="al-deals-hero-tag al-new-arrivals-tag">
                  <Zap size={14} />
                  <span>JUST DROPPED • SPRING 2026 EDITION</span>
                </div>
                <h1 className="al-deals-hero-title">
                  New Season Arrivals &amp; Innovations
                </h1>
                <p className="al-deals-hero-sub">
                  Experience the latest additions in audiophile gear, next-gen wearables, minimalist luxury fashion, and smart home ergonomics.
                </p>
                <div className="al-new-arrivals-perks">
                  <span className="al-perk-pill"><CheckCircle2 size={13} /> 100% Authentic Quality</span>
                  <span className="al-perk-pill"><CheckCircle2 size={13} /> 48h Express Dispatch</span>
                  <span className="al-perk-pill"><CheckCircle2 size={13} /> 2-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Top Breadcrumb & Sort Bar */}
      <div className="container">
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
                <option value="newest">Newest Drops</option>
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
              aria-label="Open filter menu"
            >
              <SlidersHorizontal size={15} />
              <span>Filters ({selectedSubCats.length + selectedBrands.length + (selectedPriceRange !== "all" ? 1 : 0)})</span>
            </button>
          </div>
        </div>

        {/* 3. Main 2-Column Catalog Layout */}
        <div className="al-catalog-layout">
          {/* Left Sidebar: Filters */}
          <aside className="al-filter-sidebar desktop-filter-sidebar" aria-label="Catalog Filters">
            <div className="al-filter-top-row">
              <span className="al-filter-heading">Filters</span>
              <button 
                type="button" 
                onClick={handleClearAll} 
                className="al-clear-all-btn"
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span>Reset All</span>
              </button>
            </div>

            {/* Section 1: SubCategory */}
            {subCategoriesList.length > 0 && (
              <div className="al-filter-section">
                <button
                  type="button"
                  className="al-section-toggle-btn"
                  onClick={() => toggleSection("subCategory")}
                  aria-expanded={openSections.subCategory}
                >
                  <span>Category Type</span>
                  {openSections.subCategory ? <ChevronUp size={16} className="toggle-chevron" /> : <ChevronDown size={16} className="toggle-chevron" />}
                </button>

                {openSections.subCategory && (
                  <div className="al-filter-options-list">
                    {subCategoriesList.map((item) => (
                      <label key={item} className="al-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedSubCats.includes(item)}
                          onChange={() => handleSubCatChange(item)}
                          className="al-custom-checkbox"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Brand Filter */}
            {brandsList.length > 0 && (
              <div className="al-filter-section">
                <button
                  type="button"
                  className="al-section-toggle-btn"
                  onClick={() => toggleSection("brand")}
                  aria-expanded={openSections.brand}
                >
                  <span>Brand</span>
                  {openSections.brand ? <ChevronUp size={16} className="toggle-chevron" /> : <ChevronDown size={16} className="toggle-chevron" />}
                </button>

                {openSections.brand && (
                  <div className="al-filter-options-list">
                    {brandsList.map((b) => (
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
            )}

            {/* Section 3: Price Range */}
            <div className="al-filter-section">
              <button
                type="button"
                className="al-section-toggle-btn"
                onClick={() => toggleSection("price")}
                aria-expanded={openSections.price}
              >
                <span>Price Range</span>
                {openSections.price ? <ChevronUp size={16} className="toggle-chevron" /> : <ChevronDown size={16} className="toggle-chevron" />}
              </button>

              {openSections.price && (
                <div className="al-filter-options-list">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-50", label: "Under $50" },
                    { id: "50-100", label: "$50 - $100" },
                    { id: "100-250", label: "$100 - $250" },
                    { id: "over-250", label: "Over $250" },
                  ].map((range) => (
                    <label key={range.id} className="al-radio-label">
                      <input
                        type="radio"
                        name="catview-price"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="al-custom-radio"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Section 4: Customer Rating */}
            <div className="al-filter-section">
              <button
                type="button"
                className="al-section-toggle-btn"
                onClick={() => toggleSection("rating")}
                aria-expanded={openSections.rating}
              >
                <span>Customer Rating</span>
                {openSections.rating ? <ChevronUp size={16} className="toggle-chevron" /> : <ChevronDown size={16} className="toggle-chevron" />}
              </button>

              {openSections.rating && (
                <div className="al-filter-options-list">
                  {[4, 3].map((star) => (
                    <label key={star} className="al-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(star)}
                        onChange={() => handleRatingChange(star)}
                        className="al-custom-checkbox"
                      />
                      <span>{star} ★ &amp; Above</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Right Area: Products Grid & Load More */}
          <main className="al-catalog-main">
            <div className="al-catalog-header-row">
              <div>
                <h1 className="al-category-main-title">{category?.name || "New Arrivals"}</h1>
                <p className="al-category-count-sub">Showing <strong>{filteredProducts.length}</strong> items available</p>
              </div>
            </div>

            {displayedProducts.length > 0 ? (
              <>
                <div className="al-products-grid-4">
                  {displayedProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>

                {visibleCount < filteredProducts.length && (
                  <div className="al-load-more-wrap">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 8)}
                      className="al-load-more-btn"
                    >
                      Load More Products ({filteredProducts.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="al-empty-catalog">
                <h3>No products match your selected filters</h3>
                <p>Try unchecking some filter categories or resetting your selections.</p>
                <button 
                  type="button" 
                  onClick={handleClearAll} 
                  className="al-load-more-btn"
                  style={{ marginTop: "1rem" }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="al-mobile-modal-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="al-mobile-modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Mobile Filters">
            <div className="al-mobile-modal-header">
              <h3>Filter Products</h3>
              <button 
                type="button" 
                onClick={() => setIsMobileFilterOpen(false)}
                className="al-modal-close"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className="al-mobile-modal-body">
              {/* Subcategories */}
              {subCategoriesList.length > 0 && (
                <div className="al-modal-group">
                  <h4 className="al-modal-section-title">Category</h4>
                  <div className="al-modal-options-list">
                    {subCategoriesList.map((item) => (
                      <label key={item} className="al-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedSubCats.includes(item)}
                          onChange={() => handleSubCatChange(item)}
                          className="al-custom-checkbox"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {brandsList.length > 0 && (
                <div className="al-modal-group" style={{ marginTop: "1.25rem" }}>
                  <h4 className="al-modal-section-title">Brand</h4>
                  <div className="al-modal-options-list">
                    {brandsList.map((b) => (
                      <label key={b.name} className="al-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b.name)}
                          onChange={() => handleBrandChange(b.name)}
                          className="al-custom-checkbox"
                        />
                        <span>{b.name} ({b.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="al-modal-group" style={{ marginTop: "1.25rem" }}>
                <h4 className="al-modal-section-title">Price Range</h4>
                <div className="al-modal-options-list">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-50", label: "Under $50" },
                    { id: "50-100", label: "$50 - $100" },
                    { id: "100-250", label: "$100 - $250" },
                    { id: "over-250", label: "Over $250" },
                  ].map((range) => (
                    <label key={range.id} className="al-radio-label">
                      <input
                        type="radio"
                        name="m-catview-price"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="al-custom-radio"
                      />
                      <span>{range.label}</span>
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
                Reset All
              </button>
              <button 
                type="button" 
                onClick={() => setIsMobileFilterOpen(false)} 
                className="al-modal-apply-btn"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
