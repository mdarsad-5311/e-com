"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { Product, products } from "@/data/products";

interface RecentlyViewedContextType {
  recent: Product[];
  addViewed: (product: Product) => void;
}

const STORAGE_KEY = "aurastore_recent";
const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recent, setRecent] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        const mapped = ids
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is Product => Boolean(p));
        setRecent(mapped);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.map((p) => p.id)));
  }, [recent, hydrated]);

  const addViewed = useCallback((product: Product) => {
    setRecent((prev) => {
      const next = [product, ...prev.filter((p) => p.id !== product.id)];
      return next.slice(0, 8);
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recent, addViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}
