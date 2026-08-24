"use client";

import { useEffect } from "react";
import { Product } from "@/data/products";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

export default function ProductViewTracker({ product }: { product: Product }) {
  const { addViewed } = useRecentlyViewed();

  useEffect(() => {
    addViewed(product);
  }, [product, addViewed]);

  return null;
}
