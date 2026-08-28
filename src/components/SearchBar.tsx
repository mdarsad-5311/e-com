"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Star, ArrowRight, Tag } from "lucide-react";
import { products, Product } from "@/data/products";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import "@/styles/search-bar.css";

interface SearchBarProps {
  onClose: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const modalRef = useFocusTrap<HTMLDivElement>(true, onClose);

  const searchResults = useMemo<Product[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="search-overlay" onClick={onClose}>
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="search-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search catalog products"
      >
        <div className="search-input-wrapper">
          <Search size={22} className="search-icon" aria-hidden="true" />
          <input
            id="global-catalog-search-input"
            name="searchQuery"
            type="search"
            className="search-input"
            placeholder="Search audio, smartwatches, furniture, fashion..."
            aria-label="Search audio, smartwatches, furniture, fashion"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button 
              type="button"
              onClick={() => setQuery("")} 
              className="clear-btn"
              aria-label="Clear search input"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
          <button 
            type="button"
            onClick={onClose} 
            className="close-modal-btn"
            aria-label="Close search dialog"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="search-suggestions">
            <div className="suggestion-label">Popular Searches:</div>
            <div className="tag-list" role="list">
              {["Headphones", "Smartwatch", "Waterproof", "RGB Lamp", "Coffee Dripper"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="search-tag"
                  onClick={() => setQuery(tag)}
                  aria-label={`Search for ${tag}`}
                >
                  <Tag size={12} aria-hidden="true" /> {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Search Results */}
        {query && (
          <div className="search-results">
            <div className="results-count" aria-live="polite">
              Found {searchResults.length} match{searchResults.length === 1 ? "" : "es"} for &quot;{query}&quot;
            </div>

            {searchResults.length > 0 ? (
              <div className="results-list" role="list">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug || product.id}`}
                    onClick={onClose}
                    className="result-card"
                    aria-label={`${product.title}, $${product.price.toFixed(2)}, rating ${product.rating}`}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={52}
                      height={52}
                      className="result-thumb"
                    />
                    <div className="result-info">
                      <div className="result-category">{product.categoryName}</div>
                      <div className="result-title">{product.title}</div>
                      <div className="result-meta">
                        <span className="result-price">${product.price.toFixed(2)}</span>
                        <span className="result-rating">
                          <Star size={12} fill="#f59e0b" color="#f59e0b" aria-hidden="true" /> {product.rating}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={18} className="result-arrow" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-results" role="status">
                No products found matching your search. Try different keywords.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}