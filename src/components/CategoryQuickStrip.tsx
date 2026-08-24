"use client";

import Link from "next/link";
import { Headphones, Shirt, Home, Watch, Smartphone, Sparkles, Flame } from "lucide-react";
import { categories } from "@/data/products";
import "@/styles/category-quick-strip.css";

export default function CategoryQuickStrip() {
  const quickCategories = [
    {
      id: "all-deals",
      title: "Flash Offers",
      slug: "products?featured=true",
      icon: Flame,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=150&q=80",
      highlight: true,
      badge: "HOT",
    },
    ...categories.map((c) => ({
      id: c.id,
      title: c.name,
      slug: `category/${c.slug}`,
      icon: c.icon === "Headphones" ? Headphones : c.icon === "Shirt" ? Shirt : c.icon === "Home" ? Home : Watch,
      image: c.image,
      highlight: false,
      badge: `${c.itemCount}+`,
    })),
    {
      id: "mobiles-tech",
      title: "Smart Tech",
      slug: "category/electronics",
      icon: Smartphone,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&q=80",
      highlight: false,
      badge: "NEW",
    },
    {
      id: "new-arrivals",
      title: "2026 Drop",
      slug: "products?featured=true",
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&q=80",
      highlight: false,
      badge: "TRENDING",
    },
  ];

  return (
    <div className="quick-strip-container">
      <div className="container">
        <div className="quick-strip-row no-scrollbar">
          {quickCategories.map((item) => {
            const IconComp = item.icon;
            return (
              <Link
                key={item.id}
                href={`/${item.slug}`}
                className={`quick-cat-item ${item.highlight ? "highlight-deal" : ""}`}
              >
                <div className="avatar-ring-wrapper">
                  <div className="avatar-circle">
                    <img src={item.image} alt={item.title} className="avatar-img" />
                    <div className="icon-overlay">
                      <IconComp size={14} />
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`strip-pill-badge ${item.highlight ? "badge-flash" : ""}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="cat-title">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
