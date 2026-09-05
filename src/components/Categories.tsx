"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Smartphone, 
  Monitor, 
  Shirt, 
  Home as HomeIcon, 
  Sparkles,
  Headphones,
  Watch
} from "lucide-react";
import { categories as fallbackCategories, Category } from "@/data/products";
import { getCategories } from "@/lib/categories";
import "@/styles/categories.css";

export default function Categories() {
  const [categoryList, setCategoryList] = useState<Category[]>(fallbackCategories);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const items = await getCategories();
        if (isMounted && items.length > 0) {
          setCategoryList(items);
        }
      } catch (err) {
        console.error("Failed to load categories from Django API:", err);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Smartphone":
        return <Smartphone size={24} strokeWidth={1.8} />;
      case "Monitor":
        return <Monitor size={24} strokeWidth={1.8} />;
      case "Shirt":
        return <Shirt size={24} strokeWidth={1.8} />;
      case "Home":
        return <HomeIcon size={24} strokeWidth={1.8} />;
      case "Sparkles":
        return <Sparkles size={24} strokeWidth={1.8} />;
      case "Headphones":
        return <Headphones size={24} strokeWidth={1.8} />;
      case "Watch":
        return <Watch size={24} strokeWidth={1.8} />;
      default:
        return <Smartphone size={24} strokeWidth={1.8} />;
    }
  };

  return (
    <section className="al-categories-section">
      <div className="header-container">
        {/* Section Heading */}
        <div className="al-cat-header">
          <h2 className="al-cat-title">Shop by Category</h2>
        </div>

        {/* Category Icons Row */}
        <div className="al-cat-strip-container">
          <div className="al-cat-grid">
            {categoryList.map((cat: Category) => {
              return (
                <Link 
                  key={cat.id} 
                  href={`/category/${cat.slug}`} 
                  className="al-cat-card"
                >
                  <div className="al-cat-icon-box">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <span className="al-cat-name">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
