"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, products } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  savedForLater: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeFromSaved: (productId: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  totalOriginalPrice: number;
  totalSavings: number;
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
  // Pre-seed with matching sample products from reference attachment
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 2 }
  ]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        setCart(hydrateCart(raw));
      }
      const rawSaved = localStorage.getItem(SAVED_STORAGE_KEY);
      if (rawSaved !== null) {
        setSavedForLater(hydrateCart(rawSaved));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const payload = savedForLater.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(payload));
  }, [savedForLater, hydrated]);

  const addToCart = (product: Product, quantity: number = 1) => {
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
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock || 99) }
          : item
      )
    );
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

  const clearCart = () => {
    setCart([]);
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
