"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { products, categories, Product, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import "@/styles/category-page.css";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const isFeaturedQuery = searchParams.get("featured") === "true";

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter & Accordion States
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    price: true,
    rating: true,
    discount: false,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
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
    setSelectedCategory("all");
    setSelectedBrands([]);
    setSelectedPriceRange("all");
    setSelectedRatings([]);
    setSortBy("featured");
  };

  const filteredProducts = useMemo<Product[]>(() => {
    return products
      .filter((p: Product) => {
        if (isFeaturedQuery && !p.isFeatured && !p.isBestSeller && !p.isDealOfTheDay && (!p.discountPercentage || p.discountPercentage <= 0)) {
          return false;
        }
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }
        if (initialQuery.trim()) {
          const q = initialQuery.toLowerCase();
          const match = p.title.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (selectedBrands.length > 0) {
          const productBrand = p.brand || "Al-Umaima";
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
  }, [isFeaturedQuery, selectedCategory, initialQuery, selectedBrands, selectedPriceRange, selectedRatings, sortBy]);

  const availableBrands = useMemo(() => {
    const brandMap = new Map<string, number>();
    products.forEach((p) => {
      const b = p.brand || "Al-Umaima";
      brandMap.set(b, (brandMap.get(b) || 0) + 1);
    });
    return Array.from(brandMap.entries()).map(([name, count]) => ({ name, count }));
  }, []);

  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const pageHeading = isFeaturedQuery 
    ? "Featured Deals & Offers"
    : selectedCategory === "all" 
      ? (initialQuery ? `Search Results for "${initialQuery}"` : "All Products") 
      : (currentCategoryObj ? currentCategoryObj.name : "Products");

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
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="21" y2="21"/><line x1="4" x2="20" y1="14" y2="14"/><line x1="4" x2="20" y1="7" y2="7"/><circle cx="8" cy="7" r="2"/><circle cx="16" cy="14" r="2"/><circle cx="10" cy="21" r="2"/></svg>
              Filter
            </span>
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
          {/* Left Sidebar Filters */}
          <aside className="al-filter-sidebar desktop-filter-sidebar">
            <div className="al-filter-top-row">
              <span className="al-filter-heading">Filters</span>
              <button onClick={handleClearAll} className="al-clear-all-btn">
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="al-filter-section">
              <button
                type="button"
                className="al-section-toggle-btn"
                onClick={() => toggleSection("category")}
              >
                <span>Category</span>
                {openSections.category ? <ChevronUp size={16} className="toggle-chevron" /> : <ChevronDown size={16} className="toggle-chevron" />}
              </button>

              {openSections.category && (
                <div className="al-filter-options-list">
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="catalog-cat"
                      checked={selectedCategory === "all"}
                      onChange={() => setSelectedCategory("all")}
                      className="al-custom-radio"
                    />
                    <span>All Categories</span>
                  </label>
                  {categories.map((cat: Category) => (
                    <label key={cat.id} className="al-radio-label">
                      <input
                        type="radio"
                        name="catalog-cat"
                        checked={selectedCategory === cat.slug}
                        onChange={() => setSelectedCategory(cat.slug)}
                        className="al-custom-radio"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              )}
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
            <div className="al-catalog-header-row">
              <h1 className="al-category-main-title">{pageHeading}</h1>

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

            {filteredProducts.length > 0 ? (
              <div className="al-products-grid-4">
                {filteredProducts.map((prod: Product) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="al-empty-catalog">
                <h3>No products found</h3>
                <p>Try resetting your filters or adjusting your criteria.</p>
                <button onClick={handleClearAll} className="al-clear-all-btn" style={{ fontSize: "0.95rem" }}>
                  Reset Filters
                </button>
              </div>
            )}

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
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>Loading products catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
