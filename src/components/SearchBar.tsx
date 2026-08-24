"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, X, Star, ArrowRight, Tag } from "lucide-react";
import { products, Product } from "@/data/products";
import "@/styles/search-bar.css";

interface SearchBarProps {
  onClose: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const searchResults = useMemo<Product[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <Search size={22} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search audio, smartwatches, furniture, fashion..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="clear-btn">
              <X size={18} />
            </button>
          )}
          <button onClick={onClose} className="close-modal-btn">
            ESC
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="search-suggestions">
            <div className="suggestion-label">Popular Searches:</div>
            <div className="tag-list">
              {["Headphones", "Smartwatch", "Waterproof", "RGB Lamp", "Coffee Dripper"].map((tag) => (
                <button
                  key={tag}
                  className="search-tag"
                  onClick={() => setQuery(tag)}
                >
                  <Tag size={12} /> {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Search Results */}
        {query && (
          <div className="search-results">
            <div className="results-count">
              Found {searchResults.length} match{searchResults.length === 1 ? "" : "es"} for &quot;{query}&quot;
            </div>

            {searchResults.length > 0 ? (
              <div className="results-list">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="result-card"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="result-thumb"
                    />
                    <div className="result-info">
                      <div className="result-category">{product.categoryName}</div>
                      <div className="result-title">{product.title}</div>
                      <div className="result-meta">
                        <span className="result-price">${product.price.toFixed(2)}</span>
                        <span className="result-rating">
                          <Star size={12} fill="#f59e0b" color="#f59e0b" /> {product.rating}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={18} className="result-arrow" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-results">
                No products found matching your search. Try different keywords.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}