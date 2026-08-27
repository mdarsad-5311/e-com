"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Check, ShieldCheck, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import "@/styles/trending-now.css";

const CATEGORY_PILLS = [
  "All Items",
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Offers",
];

export default function TrendingNow() {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [addedId, setAddedId] = useState<string | null>(null);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Products from Attachments 1 & 4
  const trendingProducts: Product[] = [
    {
      id: "acoustic-pro-headphones-anc",
      title: "Acoustic Pro Headphones ANC",
      slug: "acoustic-pro-headphones-anc",
      category: "electronics",
      categoryName: "Electronics",
      subCategory: "Headphones",
      price: 299.00,
      originalPrice: 349.00,
      rating: 4.8,
      reviewsCount: 128,
      isFeatured: true,
      isBestSeller: true,
      isAssured: true,
      stock: 35,
      brand: "Sennheiser",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      description: "Studio reference active noise cancellation headphones.",
      specifications: ["Hybrid ANC", "42mm Drivers", "35h Battery"],
      reviews: []
    },
    {
      id: "artisan-ceramic-mug-set",
      title: "Artisan Ceramic Mug Set",
      slug: "artisan-ceramic-mug-set",
      category: "home-goods",
      categoryName: "Home Goods",
      subCategory: "Kitchen",
      price: 45.00,
      originalPrice: 55.00,
      rating: 4.9,
      reviewsCount: 84,
      isFeatured: true,
      isBestSeller: false,
      isAssured: true,
      stock: 60,
      brand: "Al-Umaima Living",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
      description: "Hand-thrown stoneware ceramic mugs.",
      specifications: ["Handmade Stoneware", "Microwave Safe", "Set of 2"],
      reviews: []
    }
  ];

  const handleWishlist = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(p);
  };

  const handleAdd = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p, 1);
    setAddedId(p.id);
    showToast(`${p.title} added to cart!`);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="al-trending-now-section">
      <div className="header-container">
        {/* Category Pills Bar (Attachments 1 & 4) */}
        <div className="al-trending-pills-bar">
          {CATEGORY_PILLS.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`al-trending-pill-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Header Row */}
        <div className="al-trending-header-row">
          <h2 className="al-trending-heading">Trending Now</h2>
          <Link href="/products" className="al-trending-view-all">
            View All <ChevronRight size={15} />
          </Link>
        </div>

        {/* 2-Column Product Grid (Attachments 1 & 4) */}
        <div className="al-trending-grid">
          {trendingProducts.map((p) => {
            const isWish = isInWishlist(p.id);
            const isAdded = addedId === p.id;

            return (
              <div key={p.id} className="al-trending-card">
                {/* Image Wrap */}
                <div className="al-trending-img-wrap">
                  <Link href={`/products/${p.slug || p.id}`} style={{ display: "contents" }}>
                    <img src={p.image} alt={p.title} className="al-trending-img" />
                  </Link>

                  {/* Gold Assured Badge */}
                  {p.isAssured && (
                    <div className="al-trending-assured-badge">
                      <ShieldCheck size={11} />
                      <span>Assured</span>
                    </div>
                  )}

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    className={`al-trending-wish-btn ${isWish ? "active" : ""}`}
                    onClick={(e) => handleWishlist(e, p)}
                    aria-label="Wishlist"
                  >
                    <Heart size={14} fill={isWish ? "#e11d48" : "none"} color={isWish ? "#e11d48" : "#64748b"} />
                  </button>
                </div>

                {/* Info */}
                <div className="al-trending-info">
                  <Link href={`/products/${p.slug || p.id}`} className="al-trending-title">
                    {p.title}
                  </Link>

                  {/* Meta Row: Price & Star Rating */}
                  <div className="al-trending-meta-row">
                    <span className="al-trending-price">${p.price.toFixed(2)}</span>
                    <span className="al-trending-rating">
                      <Star size={12} fill="#f59e0b" color="#f59e0b" />
                      {p.rating}
                    </span>
                  </div>

                  {/* Full-width Add Button */}
                  <button
                    type="button"
                    className={`al-trending-btn-add ${isAdded ? "added" : ""}`}
                    onClick={(e) => handleAdd(e, p)}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
