"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, ShoppingBag, Sparkles } from "lucide-react";
import { Product, products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import "@/styles/frequently-bought.css";

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

export default function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Pick 2 companion products
  const companionProducts = products
    .filter((p) => p.id !== currentProduct.id && (p.category === currentProduct.category || p.isFeatured))
    .slice(0, 2);

  const [selectedIds, setSelectedIds] = useState<string[]>([
    currentProduct.id,
    ...companionProducts.map((p) => p.id),
  ]);
  const [isAdded, setIsAdded] = useState(false);

  if (companionProducts.length === 0) return null;

  const allItems = [currentProduct, ...companionProducts];

  const handleToggle = (id: string) => {
    if (id === currentProduct.id) return; // Main product cannot be unselected
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const activeProducts = allItems.filter((item) => selectedIds.includes(item.id));
  const rawTotal = activeProducts.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscountRate = activeProducts.length >= 3 ? 0.15 : activeProducts.length === 2 ? 0.1 : 0;
  const bundleDiscount = rawTotal * bundleDiscountRate;
  const bundlePrice = rawTotal - bundleDiscount;

  const handleAddBundle = () => {
    activeProducts.forEach((prod) => {
      addToCart(prod, 1);
    });
    setIsAdded(true);
    showToast(`Added ${activeProducts.length} items to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section className="al-fbt-section">
      <div className="al-fbt-header">
        <Sparkles size={18} className="al-fbt-sparkle" />
        <h3 className="al-fbt-title">Frequently Bought Together</h3>
      </div>

      <div className="al-fbt-grid">
        {/* Images & Plus row */}
        <div className="al-fbt-items-flow">
          {allItems.map((item, idx) => {
            const isChecked = selectedIds.includes(item.id);
            const isMain = item.id === currentProduct.id;

            return (
              <div key={item.id} className="al-fbt-single-item-wrap">
                {idx > 0 && <span className="al-fbt-plus-icon">+</span>}
                <div className={`al-fbt-thumb-card ${isChecked ? "active" : "inactive"}`}>
                  <Link href={`/products/${item.slug || item.id}`} className="al-fbt-thumb-link">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="al-fbt-thumb-img"
                    />
                  </Link>
                  <label className="al-fbt-checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isMain}
                      onChange={() => handleToggle(item.id)}
                      className="al-fbt-checkbox"
                    />
                    <span className="al-fbt-item-name">{isMain ? "This item:" : ""} {item.title}</span>
                    <strong className="al-fbt-item-price">${item.price.toFixed(2)}</strong>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bundle Summary & CTA */}
        <div className="al-fbt-cta-card">
          <div className="al-fbt-price-block">
            <span className="al-fbt-combo-label">Total Bundle Price:</span>
            <div className="al-fbt-price-values">
              <span className="al-fbt-final-price">${bundlePrice.toFixed(2)}</span>
              {bundleDiscount > 0 && (
                <span className="al-fbt-orig-price">${rawTotal.toFixed(2)}</span>
              )}
            </div>
            {bundleDiscount > 0 && (
              <span className="al-fbt-save-pill">Save ${(bundleDiscount).toFixed(2)} ({Math.round(bundleDiscountRate * 100)}% OFF)</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddBundle}
            className={`al-fbt-add-btn ${isAdded ? "added" : ""}`}
            disabled={activeProducts.length === 0}
          >
            {isAdded ? (
              <>
                <Check size={16} />
                <span>Bundle Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add all {activeProducts.length} to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
