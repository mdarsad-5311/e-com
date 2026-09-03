"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight, Check } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/wishlist.css";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [movedId, setMovedId] = useState<string | number | null>(null);

  const handleMoveToCart = async (product: any) => {
    setMovedId(product.id);
    const success = await moveToCart(product.id);
    if (success) {
      showToast(`${product.title} moved to cart!`);
    } else {
      // Fallback to client-side cart add if server-side wishlist move fails or is offline
      addToCart(product, 1);
      await removeFromWishlist(product.id);
      showToast(`${product.title} added to cart`);
    }
    setTimeout(() => {
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
                  <span className="wishlist-cat">{product.categoryName || product.category}</span>
                  <Link href={`/products/${product.slug || product.id}`}>
                    <h3 className="wishlist-title">{product.title}</h3>
                  </Link>

                  <div className="wishlist-price-row">
                    <span className="current-price">${Number(product.price).toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="old-price">${Number(product.originalPrice).toFixed(2)}</span>
                    )}
                  </div>

                  <button
                    className={`btn btn-primary move-cart-btn ${movedId === product.id ? "moved" : ""}`}
                    onClick={() => handleMoveToCart(product)}
                    disabled={movedId === product.id}
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
    </div>
  );
}
