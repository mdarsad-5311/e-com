"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number; // e.g. 10 for 10%, 50 for $50
  minOrder?: number;
  description: string;
}

const AVAILABLE_COUPONS: Record<string, Coupon> = {
  SAVE10: {
    code: "SAVE10",
    type: "percentage",
    value: 10,
    description: "10% off your entire order",
  },
  WELCOME20: {
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    minOrder: 100,
    description: "20% off on orders above $100",
  },
  VIP50: {
    code: "VIP50",
    type: "fixed",
    value: 50,
    minOrder: 250,
    description: "$50 instant discount on orders above $250",
  },
};

interface CouponContextType {
  appliedCoupon: Coupon | null;
  couponError: string | null;
  couponSuccess: string | null;
  applyCoupon: (code: string, subtotal: number) => boolean;
  removeCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Load from session storage if exists
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("al_applied_coupon");
      if (saved) {
        setAppliedCoupon(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const applyCoupon = (code: string, subtotal: number): boolean => {
    setCouponError(null);
    setCouponSuccess(null);

    const cleanCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[cleanCode];

    if (!coupon) {
      setCouponError("Invalid promo code. Try SAVE10 or WELCOME20.");
      return false;
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      setCouponError(`Minimum order amount of $${coupon.minOrder} required for this code.`);
      return false;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(`Coupon "${coupon.code}" applied: ${coupon.description}`);
    try {
      sessionStorage.setItem("al_applied_coupon", JSON.stringify(coupon));
    } catch {
      // Ignore
    }
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
    try {
      sessionStorage.removeItem("al_applied_coupon");
    } catch {
      // Ignore
    }
  };

  const calculateDiscount = (subtotal: number): number => {
    if (!appliedCoupon || subtotal <= 0) return 0;

    if (appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder) {
      return 0;
    }

    if (appliedCoupon.type === "percentage") {
      return Math.round((subtotal * (appliedCoupon.value / 100)) * 100) / 100;
    }

    if (appliedCoupon.type === "fixed") {
      return Math.min(subtotal, appliedCoupon.value);
    }

    return 0;
  };

  return (
    <CouponContext.Provider
      value={{
        appliedCoupon,
        couponError,
        couponSuccess,
        applyCoupon,
        removeCoupon,
        calculateDiscount,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
}
