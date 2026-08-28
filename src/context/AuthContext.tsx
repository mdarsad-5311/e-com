"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: "Male" | "Female";
  avatar: string;
  role: "user" | "admin";
  joinDate: string;
  panCard?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface UserOrder {
  id: string;
  date: string;
  status: "Delivered" | "In Transit" | "Processing" | "Cancelled";
  totalAmount: number;
  itemsCount: number;
  trackingNumber: string;
  estimatedDelivery: string;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

export interface UserAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  pincode: string;
  locality: string;
  street: string;
  city: string;
  state: string;
  landmark?: string;
  alternatePhone?: string;
  addressType: "HOME" | "WORK";
  isDefault: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  orders: UserOrder[];
  addresses: UserAddress[];
  login: (emailOrPhone: string, pass: string) => boolean;
  loginWithOtp: (phoneOrEmail: string, otp: string) => boolean;
  loginAsAdmin: () => void;
  register: (name: string, email: string, phone: string, pass: string) => boolean;
  forgotPassword: (email: string) => boolean;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  addAddress: (addr: Omit<UserAddress, "id">) => void;
  editAddress: (id: string, updated: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updateOrderStatus: (orderId: string, newStatus: "Delivered" | "In Transit" | "Processing" | "Cancelled") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: "usr-al-umaima-101",
  name: "Alexander Vance",
  firstName: "Alexander",
  lastName: "Vance",
  email: "alexander.vance@example.com",
  phone: "9876543210",
  gender: "Male",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  role: "user",
  joinDate: "August 2026",
  panCard: "ABCDE1234F"
};

const DEMO_ADMIN: UserProfile = {
  id: "admin-al-umaima-999",
  name: "Al-Umaima SuperAdmin",
  firstName: "Super",
  lastName: "Admin",
  email: "admin@al-umaima.com",
  phone: "9999988888",
  gender: "Male",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  role: "admin",
  joinDate: "January 2024"
};

const INITIAL_ORDERS: UserOrder[] = [
  {
    id: "ORD-98214",
    date: "2026-08-20",
    status: "Delivered",
    totalAmount: 189.98,
    itemsCount: 2,
    trackingNumber: "TRK-8819203",
    estimatedDelivery: "2026-08-22",
    items: [
      { id: "1", title: "SonicPro Wireless Noise Cancelling Headphones", price: 149.99, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" },
      { id: "4", title: "Minimalist Ergonomic Desk Lamp", price: 39.99, quantity: 1, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80" }
    ],
    shippingAddress: "124 Innovation Way, Tech District, Bengaluru 560001",
    paymentMethod: "Credit Card ending in 4242"
  },
  {
    id: "ORD-98105",
    date: "2026-08-18",
    status: "In Transit",
    totalAmount: 89.50,
    itemsCount: 1,
    trackingNumber: "TRK-7712049",
    estimatedDelivery: "2026-08-24",
    items: [
      { id: "2", title: "AuraFit Smart Fitness Watch Series 5", price: 89.50, quantity: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" }
    ],
    shippingAddress: "45 Ocean Avenue, Bandra West, Mumbai 400050",
    paymentMethod: "UPI (Google Pay)"
  },
  {
    id: "ORD-97992",
    date: "2026-08-15",
    status: "Processing",
    totalAmount: 129.99,
    itemsCount: 1,
    trackingNumber: "TRK-5510294",
    estimatedDelivery: "2026-08-25",
    items: [
      { id: "3", title: "Over-Sized Vintage Denim Jacket", price: 129.99, quantity: 1, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80" }
    ],
    shippingAddress: "124 Innovation Way, Tech District, Bengaluru 560001",
    paymentMethod: "Cash on Delivery"
  }
];

const INITIAL_ADDRESSES: UserAddress[] = [
  {
    id: "addr-1",
    label: "Home",
    recipient: "Alexander Vance",
    phone: "9876543210",
    pincode: "560001",
    locality: "Koramangala 4th Block",
    street: "124 Innovation Way, Tech District",
    city: "Bengaluru",
    state: "Karnataka",
    landmark: "Near Forum Mall",
    addressType: "HOME",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Work",
    recipient: "Alexander Vance (Office)",
    phone: "9876543211",
    pincode: "560103",
    locality: "Outer Ring Road, Devarabeesanahalli",
    street: "Embassy TechVillage, Tower 2",
    city: "Bengaluru",
    state: "Karnataka",
    addressType: "WORK",
    isDefault: false,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>(INITIAL_ORDERS);
  const [addresses, setAddresses] = useState<UserAddress[]>(INITIAL_ADDRESSES);

  // Initialize with demo user logged in for fast development experience
  useEffect(() => {
    const savedUser = localStorage.getItem("al_umaima_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(DEMO_USER);
      }
    } else {
      setUser(DEMO_USER);
    }
  }, []);

  const saveUserToState = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("al_umaima_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("al_umaima_user");
    }
  };

  const login = (emailOrPhone: string, pass: string) => {
    if (emailOrPhone.toLowerCase().includes("admin")) {
      saveUserToState(DEMO_ADMIN);
      return true;
    }
    if (emailOrPhone && pass) {
      const parts = emailOrPhone.split("@")[0].split(".");
      const fName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "Alexander";
      const lName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : "Vance";
      saveUserToState({
        id: `usr-${Date.now()}`,
        name: `${fName} ${lName}`,
        firstName: fName,
        lastName: lName,
        email: emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone}@al-umaima.com`,
        phone: emailOrPhone.match(/^\d+$/) ? emailOrPhone : "9876543210",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: "user",
        joinDate: "August 2026",
      });
      return true;
    }
    return false;
  };

  const loginWithOtp = (phoneOrEmail: string, otp: string) => {
    if (otp === "123456" || otp.length === 6) {
      if (phoneOrEmail.includes("admin")) {
        saveUserToState(DEMO_ADMIN);
      } else {
        saveUserToState({
          ...DEMO_USER,
          phone: phoneOrEmail.match(/^\d+$/) ? phoneOrEmail : DEMO_USER.phone,
          email: phoneOrEmail.includes("@") ? phoneOrEmail : DEMO_USER.email,
        });
      }
      return true;
    }
    return false;
  };

  const loginAsAdmin = () => {
    saveUserToState(DEMO_ADMIN);
  };

  const register = (name: string, email: string, phone: string, pass: string) => {
    if (name && (email || phone)) {
      const nameParts = name.trim().split(" ");
      const fName = nameParts[0] || "User";
      const lName = nameParts.slice(1).join(" ") || "";
      saveUserToState({
        id: `usr-${Date.now()}`,
        name: name,
        firstName: fName,
        lastName: lName,
        email: email || `${phone}@al-umaima.com`,
        phone: phone || "9876543210",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: "user",
        joinDate: "August 2026",
      });
      return true;
    }
    return false;
  };

  const forgotPassword = (email: string) => {
    return Boolean(email);
  };

  const logout = () => {
    saveUserToState(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (user) {
      const fullName = updated.firstName || updated.lastName 
        ? `${updated.firstName || user.firstName} ${updated.lastName || user.lastName}`.trim()
        : updated.name || user.name;
        
      const newProfile = {
        ...user,
        ...updated,
        name: fullName
      };
      saveUserToState(newProfile);
    }
  };

  const addAddress = (newAddr: Omit<UserAddress, "id">) => {
    const created: UserAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };
    if (newAddr.isDefault) {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: false })).concat(created)
      );
    } else {
      setAddresses((prev) => [...prev, created]);
    }
  };

  const editAddress = (id: string, updated: Partial<UserAddress>) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: "Delivered" | "In Transit" | "Processing" | "Cancelled") => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        orders,
        addresses,
        login,
        loginWithOtp,
        loginAsAdmin,
        register,
        forgotPassword,
        logout,
        updateProfile,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress,
        updateOrderStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
