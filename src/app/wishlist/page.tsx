"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight, Check } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [movedId, setMovedId] = useState<string | null>(null);

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    setMovedId(product.id);
    setTimeout(() => {
      removeFromWishlist(product.id);
      setMovedId(null);
    }, 1200);
  };

  return (
    <div className="container section">
      <div className="wishlist-page-header">
        <h1 className="section-title">My Wishlist</h1>
        <p className="section-subtitle">
          {wishlist.length > 0
            ? `You have saved ${wishlist.length} item${wishlist.length === 1 ? "" : "s"} for later.`
            : "Your wishlist is currently empty."}
        </p>
      </div>

      {wishlist.length > 0 ? (
        <div className="wishlist-grid">
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="wishlist-card"
              >
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="remove-wishlist-btn"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>

                <div className="wishlist-img-frame">
                  <img src={product.image} alt={product.title} className="wishlist-img" />
                </div>

                <div className="wishlist-card-content">
                  <span className="wishlist-cat">{product.categoryName}</span>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="wishlist-title">{product.title}</h3>
                  </Link>

                  <div className="wishlist-price-row">
                    <span className="current-price">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="old-price">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <button
                    className={`btn btn-primary move-cart-btn ${movedId === product.id ? "moved" : ""}`}
                    onClick={() => handleMoveToCart(product)}
                  >
                    {movedId === product.id ? (
                      <>
                        <Check size={16} /> Moved to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} /> Move to Cart
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="empty-wishlist-card">
          <div className="heart-icon-wrapper">
            <Heart size={48} fill="#EF4444" color="#EF4444" className="animate-pulse-glow" />
          </div>
          <h2>Your Wishlist is Empty</h2>
          <p>Explore our catalog and click the heart icon on any product to save it here.</p>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Explore Products Catalog <ArrowRight size={18} />
          </Link>
        </div>
      )}

      <style jsx>{`
        .wishlist-page-header {
          margin-bottom: 2.5rem;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.75rem;
        }

        @media (max-width: 1200px) { .wishlist-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 868px) { .wishlist-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) { .wishlist-grid { grid-template-columns: 1fr; } }

        .wishlist-card {
          position: relative;
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid var(--borders);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .remove-wishlist-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid var(--borders);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: all 0.2s ease;
        }

        .remove-wishlist-btn:hover {
          color: var(--danger);
          border-color: var(--danger);
        }

        .wishlist-img-frame {
          width: 100%;
          height: 200px;
          border-radius: 14px;
          overflow: hidden;
          background: #F8FAFC;
        }

        .wishlist-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .wishlist-card-content {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .wishlist-cat {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
        }

        .wishlist-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text);
          margin: 0.3rem 0 0.6rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .wishlist-price-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .current-price { font-size: 1.35rem; font-weight: 900; color: var(--text); }
        .old-price { font-size: 0.85rem; color: var(--text-muted); text-decoration: line-through; }

        .move-cart-btn {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          margin-top: auto;
          font-size: 0.875rem;
        }

        .move-cart-btn.moved {
          background: var(--success);
        }

        .empty-wishlist-card {
          background: #FFFFFF;
          border-radius: 24px;
          border: 1px solid var(--borders);
          padding: 4rem 2rem;
          text-align: center;
          max-width: 500px;
          margin: 2rem auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .heart-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--danger-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
