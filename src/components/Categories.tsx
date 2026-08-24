"use client";

import Link from "next/link";
import { categories, Category } from "@/data/products";
import { motion } from "framer-motion";
import "@/styles/categories.css";

export default function Categories() {
  return (
    <section className="al-categories-section">
      <div className="header-container">
        {/* Centered Heading & Description */}
        <div className="al-cat-header">
          <h2 className="al-cat-title">Shop by Category</h2>
          <p className="al-cat-subtitle">
            Explore handpicked collections across high-performance audio, fashion, smart living, and gear.
          </p>
        </div>

        {/* 4 Category Tiles Row */}
        <div className="al-cat-grid">
          {categories.slice(0, 4).map((cat: Category, idx: number) => {
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="al-cat-motion-item"
              >
                <Link href={`/category/${cat.slug}`} className="al-cat-card">
                  <div className="al-cat-img-box">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="al-cat-img" 
                    />
                  </div>
                  <span className="al-cat-name">{cat.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
