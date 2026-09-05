"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { products, Product } from "@/data/products";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";


export default function MobileContinueShopping() {
  const { recent } = useRecentlyViewed();
  const { user } = useAuth();

  // If user has viewed products, show them; otherwise fallback to curated starter products
  const displayProducts = useMemo(() => {
    if (recent && recent.length > 0) {
      return recent;
    }
    // Fallback: 4 high quality varied items from products
    return products.slice(0, 5);
  }, [recent]);

  const firstName = user?.firstName || (user?.name ? user.name.split(" ")[0] : "");
  const sectionTitle = firstName 
    ? `${firstName}, still looking for these?`
    : "Still looking for these?";

  return (
    <section className="al-mobile-continue-shopping-section" aria-label="Recently viewed products">
      <div className="al-mobile-continue-shopping-card">
        {/* Section Heading with subtle personalized icon */}
        <div className="al-mobile-continue-header">
          <div className="al-mobile-continue-title-row">
            <h2 className="al-mobile-continue-title">{sectionTitle}</h2>
          </div>
          <Link href="/products" className="al-mobile-continue-view-all">
            <span>Explore all</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Horizontally Scrolling Product Cards */}
        <div className="al-mobile-continue-scroller no-scrollbar">
          {displayProducts.map((product) => {
            const originalPrice = product.originalPrice || (product.price > 80 ? Math.round(product.price * 1.25) : undefined);
            const discount = product.discountPercentage || (originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0);

            return (
              <div key={product.id} className="al-mobile-continue-item">
                <Link
                  href={`/products/${product.slug || product.id}`}
                  className="al-mobile-continue-item-link"
                >
                  <div className="al-mobile-continue-img-box">
                    <Image width={500} height={500}
                      src={product.image}
                      alt={product.title}
                      className="al-mobile-continue-img"
                      loading="lazy"
                    />
                    {discount > 0 && (
                      <span className="al-mobile-continue-discount-badge">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="al-mobile-continue-info">
                    <h3 className="al-mobile-continue-prod-name" title={product.title}>
                      {product.title}
                    </h3>

                    <div className="al-mobile-continue-price-row">
                      <span className="al-mobile-continue-price">${product.price.toFixed(2)}</span>
                      {originalPrice && originalPrice > product.price && (
                        <span className="al-mobile-continue-orig-price">${originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    {/* CTA button matching reference screenshot "View Store" / "Deals for you" */}
                    <div className="al-mobile-continue-cta-tag">
                      <span>View Deals</span>
                      <ArrowRight size={11} />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
