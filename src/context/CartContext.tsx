"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Product, products } from "@/data/products";
import { api, getAccessToken } from "@/lib/api";
import { mapDjangoProductToFrontendProduct } from "@/lib/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  savedForLater: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeFromSaved: (productId: string) => void;
  clearCart: () => Promise<void>;
  totalItemsCount: number;
  subtotal: number;
  totalOriginalPrice: number;
  totalSavings: number;
  refreshCart: () => Promise<void>;
}

const STORAGE_KEY = "aurastore_cart";
const SAVED_STORAGE_KEY = "aurastore_saved_for_later";
const CartContext = createContext<CartContextType | undefined>(undefined);

function hydrateCart(raw: string): CartItem[] {
  try {
    const parsed: { productId: string; quantity: number }[] = JSON.parse(raw);
    return parsed
      .map((row) => {
        const product = products.find((p) => p.id === row.productId);
        if (!product || row.quantity < 1) return null;
        return { product, quantity: row.quantity };
      })
      .filter((item): item is CartItem => Boolean(item));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // 1. Fetch Cart from Django REST API
  const refreshCart = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      // Unauthenticated fallback: read from localStorage
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw !== null) {
          setCart(hydrateCart(raw));
        } else {
          setCart([
            { product: products[0], quantity: 1 },
            { product: products[1], quantity: 2 }
          ]);
        }
      } catch {
        /* ignore */
      }
      return;
    }

    try {
      const data = await api.get("/api/cart/");
      if (data && data.items) {
        const mappedCart = data.items.map((item: any) => ({
          product: mapDjangoProductToFrontendProduct(item.product || item),
          quantity: item.quantity || item.qty || 1,
        }));
        setCart(mappedCart);
      } else if (Array.isArray(data)) {
        const mappedCart = data.map((item: any) => ({
          product: mapDjangoProductToFrontendProduct(item.product || item),
          quantity: item.quantity || item.qty || 1,
        }));
        setCart(mappedCart);
      }
    } catch (err: any) {
      console.warn("Failed to fetch cart from backend:", err);
    }
  }, []);

  // Fetch on mount and listen to storage/token events
  useEffect(() => {
    refreshCart();
    
    try {
      const rawSaved = localStorage.getItem(SAVED_STORAGE_KEY);
      if (rawSaved !== null) {
        setSavedForLater(hydrateCart(rawSaved));
      }
    } catch {
      /* ignore */
    }
    
    setHydrated(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "ecommerce_access_token" || e.key === "ecommerce_refresh_token") {
        refreshCart();
      }
    };
    
    const handleLoginSuccess = async () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed: { productId: string; quantity: number }[] = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            for (const item of parsed) {
              await api.post("/api/cart/add/", {
                product_id: item.productId,
                quantity: item.quantity
              });
            }
          }
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.error("Cart migration failed", e);
        }
      }
      await refreshCart();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("aurastore_login_success", handleLoginSuccess);
    
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("aurastore_login_success", handleLoginSuccess);
    };
  }, [refreshCart]);

  useEffect(() => {
    if (!hydrated) return;
    const token = getAccessToken();
    if (!token) {
      const payload = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const payload = savedForLater.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(payload));
  }, [savedForLater, hydrated]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    const token = getAccessToken();
    
    // Optimistic Update
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const nextQty = Math.min(updated[existingIndex].quantity + quantity, product.stock || 99);
        updated[existingIndex] = { ...updated[existingIndex], quantity: nextQty, product };
        return updated;
      }
      return [...prevCart, { product, quantity: Math.min(quantity, product.stock || 99) }];
    });

    if (token) {
      try {
        await api.post("/api/cart/add/", { product_id: product.id, quantity });
        await refreshCart(); // Refresh to sync backend exact state
      } catch (err) {
        console.error("Error adding to backend cart:", err);
        await refreshCart(); // Revert to backend state on error
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    const token = getAccessToken();
    
    // Optimistic Update
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));

    if (token) {
      try {
        await api.delete(`/api/cart/remove/${productId}/`);
      } catch (err) {
        console.error("Error removing from backend cart:", err);
        await refreshCart(); // Revert to backend state on error
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    const token = getAccessToken();
    
    // Optimistic Update
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock || 99) }
          : item
      )
    );

    if (token) {
      try {
        await api.patch(`/api/cart/update/${productId}/`, { quantity });
      } catch (err) {
        console.error("Error updating backend cart quantity:", err);
        await refreshCart(); // Revert to backend state on error
      }
    }
  };

  const clearCart = async () => {
    const token = getAccessToken();
    setCart([]);
    
    if (token) {
      try {
        await api.post("/api/cart/clear/");
      } catch (err) {
        console.error("Error clearing backend cart:", err);
        await refreshCart(); // Revert to backend state on error
      }
    }
  };

  const saveForLater = (productId: string) => {
    const itemToSave = cart.find((item) => item.product.id === productId);
    if (itemToSave) {
      removeFromCart(productId);
      setSavedForLater((prev) => {
        const exists = prev.some((it) => it.product.id === productId);
        if (exists) return prev;
        return [...prev, itemToSave];
      });
    }
  };

  const moveToCart = (productId: string) => {
    const itemToMove = savedForLater.find((item) => item.product.id === productId);
    if (itemToMove) {
      removeFromSaved(productId);
      addToCart(itemToMove.product, itemToMove.quantity);
    }
  };

  const removeFromSaved = (productId: string) => {
    setSavedForLater((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalOriginalPrice = cart.reduce(
    (sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );
  const totalSavings = Math.max(0, totalOriginalPrice - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveForLater,
        moveToCart,
        removeFromSaved,
        clearCart,
        totalItemsCount,
        subtotal,
        totalOriginalPrice,
        totalSavings,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

