"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Product } from "@/data/products";
import { api, getAccessToken } from "@/lib/api";
import { WishlistListResponse, AddWishlistResponse, MoveToCartResponse } from "@/types/api";

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  loading: boolean;
  error: string | null;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string | number) => boolean;
  removeFromWishlist: (productId: string | number) => Promise<void>;
  moveToCart: (productId: string | number) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Wishlist from Django REST API (Zero localStorage)
  const refreshWishlist = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.get<WishlistListResponse>("/api/wishlist/");
      const productsList = (data.results || []).map((item) => item.product);
      setWishlist(productsList);
    } catch (err: any) {
      if (err?.status === 401) {
        setWishlist([]);
      } else {
        setError("Failed to fetch wishlist from server");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and listen to storage/token events
  useEffect(() => {
    refreshWishlist();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "ecommerce_access_token" || e.key === "access_token") {
        refreshWishlist();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshWishlist]);

  // 2. Add or Toggle Wishlist Item via Django API
  const toggleWishlist = async (product: Product) => {
    const token = getAccessToken();
    const isCurrentlyIn = wishlist.some((p) => String(p.id) === String(product.id));

    if (!token) {
      // Unauthenticated fallback: temporary local session state
      setWishlist((prev) =>
        isCurrentlyIn ? prev.filter((p) => String(p.id) !== String(product.id)) : [...prev, product]
      );
      return;
    }

    if (isCurrentlyIn) {
      await removeFromWishlist(product.id);
      return;
    }

    // Optimistic add
    setWishlist((prev) => [...prev.filter((p) => String(p.id) !== String(product.id)), product]);

    try {
      const res = await api.post<AddWishlistResponse>("/api/wishlist/add/", {
        product_id: product.id,
      });
      const savedProduct = res?.item?.product || product;
      setWishlist((prev) => [...prev.filter((p) => String(p.id) !== String(product.id)), savedProduct]);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      // Rollback on error
      setWishlist((prev) => prev.filter((p) => String(p.id) !== String(product.id)));
    }
  };

  // 3. Remove from Wishlist via Django API
  const removeFromWishlist = async (productId: string | number) => {
    const token = getAccessToken();
    const previous = wishlist;
    // Optimistic removal
    setWishlist((prev) => prev.filter((p) => String(p.id) !== String(productId)));

    if (!token) return;

    try {
      await api.delete(`/api/wishlist/remove/${productId}/`);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      // Rollback on failure
      setWishlist(previous);
    }
  };

  // 4. Move to Cart (Atomic Server-Side Transfer)
  const moveToCart = async (productId: string | number): Promise<boolean> => {
    const token = getAccessToken();
    if (!token) return false;

    try {
      await api.post<MoveToCartResponse>(`/api/wishlist/move-to-cart/${productId}/`);
      setWishlist((prev) => prev.filter((p) => String(p.id) !== String(productId)));
      return true;
    } catch (err) {
      console.error("Error moving wishlist item to cart:", err);
      return false;
    }
  };

  const isInWishlist = (productId: string | number) => {
    return wishlist.some((p) => String(p.id) === String(productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        error,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveToCart,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
