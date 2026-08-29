"use client";

import { useState } from "react";
import MobileHomeHeader from "./MobileHomeHeader";
import MobileCategoryScroller from "./MobileCategoryScroller";
import MobileBannerCarousel from "./MobileBannerCarousel";
import MobileContinueShopping from "./MobileContinueShopping";
import MobileSuggestedProducts from "./MobileSuggestedProducts";

export default function MobileHomePage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("for-you");

  return (
    <div className="al-mobile-home-view-inner" aria-label="Mobile Shopping App Home">
      {/* 1. App Top Area: Branding, Address Selector, Actions & Search Bar */}
      <MobileHomeHeader />

      {/* 2. Horizontally Scrollable Category Shortcuts */}
      <MobileCategoryScroller
        activeCategoryId={activeCategoryId}
        onSelectCategory={(id) => setActiveCategoryId(id)}
      />

      {/* 3. Promotional Banner Carousel */}
      <MobileBannerCarousel />

      {/* 4. Personalized / Recently Viewed Section */}
      <MobileContinueShopping />

      {/* 5. Suggested For You Grid */}
      <MobileSuggestedProducts selectedCategoryId={activeCategoryId} />
    </div>
  );
}
