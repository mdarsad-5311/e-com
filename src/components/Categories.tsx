"use client";

import Link from "next/link";
import { Headphones, Shirt, Home, Watch, ArrowRight } from "lucide-react";
import { categories, Category } from "@/data/products";
import { motion } from "framer-motion";
import "@/styles/categories.css";

const categoryIconMap: Record<string, any> = {
  Headphones: Headphones,
  Shirt: Shirt,
  Home: Home,
  Watch: Watch,
};

export default function Categories() {
  return (
    <section className="section categories-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Explore handpicked collections across high-performance audio, fashion, smart living, and gear.
            </p>
          </div>

          <Link href="/products" className="view-all-link">
            <span>Browse All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="categories-grid-6">
          {categories.map((cat: Category, idx: number) => {
            const IconComponent = categoryIconMap[cat.icon] || Headphones;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link href={`/category/${cat.slug}`} className="category-item-card">
                  <div className="cat-card-top">
                    <div className="cat-icon-badge">
                      <IconComponent size={22} />
                    </div>
                    <span className="cat-count-tag">{cat.itemCount} Items</span>
                  </div>

                  <div className="cat-image-container">
                    <img src={cat.image} alt={cat.name} className="cat-img" />
                  </div>

                  <div className="cat-card-body">
                    <h3 className="cat-name">{cat.name}</h3>
                    <p className="cat-desc">{cat.description}</p>
                    <span className="cat-link-text">
                      Shop Category <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
