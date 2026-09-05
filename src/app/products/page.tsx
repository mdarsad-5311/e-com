"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Clock, Sparkles, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { Product, Category, products as fallbackProducts, categories as fallbackCategories } from "@/data/products";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import ProductCard from "@/components/ProductCard";
import "@/styles/category-page.css";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const isFeaturedQuery = searchParams.get("featured") === "true";

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Countdown timer for deals
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 15, seconds: 32 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => num.toString().padStart(2, "0");

  // Filter & Accordion States
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    price: true,
    rating: true,
    discount: true,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [categoryList, setCategoryList] = useState<Category[]>(fallbackCategories);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchCatalog() {
      setIsLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        if (isMounted) {
          if (pRes && pRes.results && pRes.results.length > 0) {
            setProductList(pRes.results);
          }
          if (cRes && cRes.length > 0) {
            setCategoryList(cRes);
          }
        }
      } catch (err) {
        console.error("Failed to load catalog from Django API:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleDiscountChange = (disc: number) => {
    setSelectedDiscounts((prev) =>
      prev.includes(disc) ? prev.filter((d) => d !== disc) : [...prev, disc]
    );
  };

  const handleClearAll = () => {
    setSelectedCategory("all");
    setSelectedBrands([]);
    setSelectedPriceRange("all");
    setSelectedRatings([]);
    setSelectedDiscounts([]);
    setSortBy("featured");
  };

  const filteredProducts = useMemo<Product[]>(() => {
    return productList
      .filter((p: Product) => {
        if (isFeaturedQuery && !p.isFeatured && !p.isBestSeller && !p.isDealOfTheDay && (!p.discountPercentage || p.discountPercentage <= 0) && p.badge !== "SALE") {
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

        if (selectedDiscounts.length > 0) {
          const minDiscount = Math.min(...selectedDiscounts);
          const pDiscount = p.discountPercentage || 0;
          if (pDiscount < minDiscount) return false;
        }

        return true;
      })
      .sort((a: Product, b: Product) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "discount") return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        return 0;
      });
  }, [productList, isFeaturedQuery, selectedCategory, initialQuery, selectedBrands, selectedPriceRange, selectedRatings, selectedDiscounts, sortBy]);

  const availableBrands = useMemo(() => {
    const brandMap = new Map<string, number>();
    productList.forEach((p) => {
      const b = p.brand || "Al-Umaima";
      brandMap.set(b, (brandMap.get(b) || 0) + 1);
    });
    return Array.from(brandMap.entries()).map(([name, count]) => ({ name, count }));
  }, [productList]);

  const currentCategoryObj = categoryList.find((c) => c.slug === selectedCategory);
  const pageHeading = isFeaturedQuery 
    ? "Featured Deals & Flash Offers"
    : selectedCategory === "all" 
      ? (initialQuery ? `Search Results for "${initialQuery}"` : "All Products") 
      : (currentCategoryObj ? currentCategoryObj.name : "Products");

  return (
    <div className="al-catalog-page">
      {/* 1. DEALS PROMO SPOTLIGHT HERO (Shown on Deals Page) */}
      {isFeaturedQuery && (
        <section className="al-deals-spotlight-hero">
          <div className="container">
            <div className="al-deals-hero-inner">
              <div className="al-deals-hero-text">
                <div className="al-deals-hero-tag">
                  <Sparkles size={14} />
                  <span>SPECIAL EVENT • LIMITED TIME</span>
                </div>
                <h1 className="al-deals-hero-title">
                  Flash Deals &amp; Exclusive Offers
                </h1>
                <p className="al-deals-hero-sub">
                  Save up to 40% on audiophile headphones, smart home lighting, and minimalist fashion with free express delivery.
                </p>
              </div>

              <div className="al-deals-timer-card">
                <span className="al-timer-card-label">Deals Expire In</span>
                <div className="al-timer-digits-row">
                  <div className="al-timer-box">
                    <span className="al-timer-num">{formatDigit(timeLeft.hours)}</span>
                    <span className="al-timer-unit">HRS</span>
                  </div>
                  <span className="al-timer-colon">:</span>
                  <div className="al-timer-box">
                    <span className="al-timer-num">{formatDigit(timeLeft.minutes)}</span>
                    <span className="al-timer-unit">MIN</span>
                  </div>
                  <span className="al-timer-colon">:</span>
                  <div className="al-timer-box">
                    <span className="al-timer-num">{formatDigit(timeLeft.seconds)}</span>
                    <span className="al-timer-unit">SEC</span>
                  </div>
                </div>
                <span className="al-timer-card-foot">⚡ Limited Stock Remaining</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Mobile Toolbar (Filter & Sort) */}
      <div className="al-mobile-filter-toolbar">
        <div className="container al-mobile-toolbar-flex">
          <button
            type="button"
            className="al-mobile-filter-trigger"
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Open filter options"
          >
            <SlidersHorizontal size={15} />
            <span>Filters ({selectedBrands.length + (selectedCategory !== "all" ? 1 : 0) + (selectedPriceRange !== "all" ? 1 : 0)})</span>
          </button>

          <div className="al-mobile-sort-wrap">
            <span className="al-sort-prefix">Sort:</span>
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
              <option value="discount">Biggest Discount</option>
            </select>
            <ChevronDown size={14} className="al-sort-chevron" />
          </div>
        </div>
      </div>

      {/* 3. Main Catalog Layout */}
      <div className="container">
        <div className="al-catalog-layout">
          {/* Left Sidebar Filters */}
          <aside className="al-filter-sidebar desktop-filter-sidebar" aria-label="Product Filters">
            <div className="al-filter-top-row">
              <span className="al-filter-heading">Filters</span>
              <button onClick={handleClearAll} className="al-clear-all-btn" title="Reset all filters">
                <RotateCcw size={12} />
                <span>Reset All</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="al-filter-section">
              <button
                type="button"
                className="al-section-toggle-btn"
                onClick={() => toggleSection("category")}
                aria-expanded={openSections.category}
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
                  {categoryList.map((cat: Category) => (
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
                aria-expanded={openSections.brand}
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
                        name="cat-price"
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

            {/* Customer Rating Filter */}
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

            {/* Discount Percentage Filter */}
            <div className="al-filter-section">
              <button
                type="button"
                className="al-section-toggle-btn"
                onClick={() => toggleSection("discount")}
                aria-expanded={openSections.discount}
              >
                <span>Discount / Deals</span>
                {openSections.discount ? <ChevronUp size={16} className="toggle-chevron" /> : <ChevronDown size={16} className="toggle-chevron" />}
              </button>

              {openSections.discount && (
                <div className="al-filter-options-list">
                  {[10, 20, 30].map((disc) => (
                    <label key={disc} className="al-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedDiscounts.includes(disc)}
                        onChange={() => handleDiscountChange(disc)}
                        className="al-custom-checkbox"
                      />
                      <span>{disc}% OFF or more</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main className="al-catalog-main">
            <div className="al-catalog-header-row">
              <div>
                <h1 className="al-category-main-title">{pageHeading}</h1>
                <p className="al-category-count-sub">Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "product" : "products"}</p>
              </div>

              <div className="al-sort-control">
                <span className="al-sort-label">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="al-sort-select"
                  aria-label="Sort catalog products"
                >
                  <option value="featured">Featured / Best Match</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
                <ChevronDown size={14} className="al-sort-chevron" />
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
                <h3>No products match your criteria</h3>
                <p>Try resetting some filters or searching with different keywords.</p>
                <button onClick={handleClearAll} className="al-load-more-btn" style={{ marginTop: "1rem" }}>
                  Reset All Filters
                </button>
              </div>
            )}

            {filteredProducts.length > 0 && (
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
              {/* Category */}
              <div className="al-modal-group">
                <h4 className="al-modal-section-title">Category</h4>
                <div className="al-modal-options-list">
                  <label className="al-radio-label">
                    <input
                      type="radio"
                      name="m-cat"
                      checked={selectedCategory === "all"}
                      onChange={() => setSelectedCategory("all")}
                      className="al-custom-radio"
                    />
                    <span>All Categories</span>
                  </label>
                  {categoryList.map((c) => (
                    <label key={c.id} className="al-radio-label">
                      <input
                        type="radio"
                        name="m-cat"
                        checked={selectedCategory === c.slug}
                        onChange={() => setSelectedCategory(c.slug)}
                        className="al-custom-radio"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="al-modal-group" style={{ marginTop: "1.25rem" }}>
                <h4 className="al-modal-section-title">Brand</h4>
                <div className="al-modal-options-list">
                  {availableBrands.map((b) => (
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
                        name="m-price"
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>Loading products catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
