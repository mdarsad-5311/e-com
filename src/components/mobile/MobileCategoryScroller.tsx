"use client";

import { useRef } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Monitor, 
  Shirt, 
  Home, 
  Tag, 
  Flame, 
  Headphones, 
  Smartphone,
  LayoutGrid
} from "lucide-react";
import { categories } from "@/data/products";

interface MobileCategoryScrollerProps {
  activeCategoryId?: string;
  onSelectCategory?: (id: string) => void;
}

export default function MobileCategoryScroller({
  activeCategoryId = "for-you",
  onSelectCategory,
}: MobileCategoryScrollerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Icon mapper helper
  const getCategoryIcon = (iconName?: string, catId?: string) => {
    if (catId === "electronics") return Monitor;
    if (catId === "fashion") return Shirt;
    if (catId === "home-goods") return Home;
    if (catId === "deals") return Flame;
    if (catId === "new-arrivals") return Sparkles;
    if (iconName === "Headphones") return Headphones;
    if (iconName === "Smartphone") return Smartphone;
    return LayoutGrid;
  };

  // Build items list with "For You" as the first personalized tab (Flipkart UX reference)
  const categoryItems = [
    {
      id: "for-you",
      name: "For You",
      slug: "",
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=120&q=80",
    },
    ...categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: `category/${c.slug}`,
      icon: getCategoryIcon(c.icon, c.id),
      image: c.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80",
    })),
  ];

  return (
    <div className="al-mobile-cat-scroller-wrap" aria-label="Category shortcuts">
      <div 
        ref={scrollContainerRef}
        className="al-mobile-cat-track no-scrollbar" 
        role="tablist"
      >
        {categoryItems.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          const IconComp = cat.icon;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              className={`al-mobile-cat-item ${isActive ? "active" : ""}`}
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(cat.id);
                }
              }}
            >
              <div className="al-mobile-cat-icon-frame">
                <div className="al-mobile-cat-icon-circle">
                  <IconComp size={20} className="al-mobile-cat-svg" />
                </div>
              </div>
              <span className="al-mobile-cat-title">{cat.name}</span>
              {/* Active Indicator Underline (Matches reference screenshot blue tab indicator) */}
              {isActive && <span className="al-mobile-cat-active-bar" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
