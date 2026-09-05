"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, saveTokens, clearTokens, getAccessToken, getRefreshToken } from "@/lib/api";

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
  isLoading: boolean;
  isAdmin: boolean;
  orders: UserOrder[];
  addresses: UserAddress[];
  login: (emailOrPhone: string, pass: string) => Promise<boolean>;
  loginWithOtp: (phoneOrEmail: string, otp: string) => boolean;
  loginAsAdmin: () => void;
  register: (name: string, email: string, phone: string, pass: string) => Promise<boolean>;
  forgotPassword: (email: string) => boolean;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
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

/**
 * Adapts a Django user serializer response into the frontend UserProfile format.
 */
export function mapDjangoUserToUserProfile(djangoUser: any): UserProfile {
  const fullName =
    djangoUser.name ||
    `${djangoUser.first_name || ""} ${djangoUser.last_name || ""}`.trim() ||
    djangoUser.email?.split("@")[0] ||
    "User";

  const nameParts = fullName.split(" ");
  const fName = djangoUser.first_name || nameParts[0] || "User";
  const lName = djangoUser.last_name || nameParts.slice(1).join(" ") || "";
  const role: "user" | "admin" =
    djangoUser.role === "admin" || djangoUser.is_staff || djangoUser.email?.toLowerCase().includes("admin")
      ? "admin"
      : "user";

  let formattedJoinDate = "August 2026";
  if (djangoUser.date_joined) {
    try {
      const d = new Date(djangoUser.date_joined);
      formattedJoinDate = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      // ignore
    }
  }

  return {
    id: String(djangoUser.id),
    name: fullName,
    firstName: fName,
    lastName: lName,
    email: djangoUser.email,
    phone: djangoUser.phone || djangoUser.phone_number || "",
    gender: djangoUser.gender || "Male",
    avatar:
      djangoUser.profile_image ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    role,
    joinDate: formattedJoinDate,
    panCard: djangoUser.panCard,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<UserOrder[]>(INITIAL_ORDERS);
  const [addresses, setAddresses] = useState<UserAddress[]>(INITIAL_ADDRESSES);

  // Initialize with demo user logged in for fast development experience
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const token = getAccessToken() || getRefreshToken();
      if (!token) {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      // Check cached user first for instantaneous UI rendering
      const savedUser = localStorage.getItem("al_umaima_user");
      if (savedUser && mounted) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore parsing error
        }
      }

      try {
        const profile = await api.get("/api/profile/");
        if (mounted && profile) {
          const mappedUser = mapDjangoUserToUserProfile(profile);
          saveUserToState(mappedUser);
        }
      } catch (err) {
        // If refresh/profile failed and no valid session remains
        if (mounted) {
          clearTokens();
          saveUserToState(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  const saveUserToState = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("al_umaima_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("al_umaima_user");
    }
  };

  const login = async (emailOrPhone: string, pass: string): Promise<boolean> => {
    const email = emailOrPhone.trim();

    // Call real Django REST Framework login endpoint
    const response = await api.post("/api/auth/login/", {
      email,
      password: pass,
    });

    // Save tokens via api helper
    const accessToken = response?.access || response?.tokens?.access;
    const refreshToken = response?.refresh || response?.tokens?.refresh;

    if (accessToken && refreshToken) {
      saveTokens({
        access: accessToken,
        refresh: refreshToken,
      });
    }

    // Map backend user to frontend UserProfile
    if (response?.user) {
      const mappedUser = mapDjangoUserToUserProfile(response.user);
      saveUserToState(mappedUser);
    }

    return true;
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

  const register = async (
    name: string,
    email: string,
    phone: string,
    pass: string
  ): Promise<boolean> => {
    const payload: Record<string, string> = {
      name: name.trim(),
      email: email.trim(),
      password: pass,
    };
    if (phone.trim()) {
      payload.phone = phone.trim();
    }

    // Call real Django REST Framework register endpoint
    const response = await api.post("/api/auth/register/", payload);

    // Save tokens via api helper
    const accessToken = response?.access || response?.tokens?.access;
    const refreshToken = response?.refresh || response?.tokens?.refresh;

    if (accessToken && refreshToken) {
      saveTokens({
        access: accessToken,
        refresh: refreshToken,
      });
    }

    // Map backend user to frontend UserProfile
    if (response?.user) {
      const mappedUser = mapDjangoUserToUserProfile(response.user);
      saveUserToState(mappedUser);
    }

    return true;
  };

  const forgotPassword = (email: string) => {
    return Boolean(email);
  };

  const logout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await api.post("/api/auth/logout/", { refresh: refreshToken });
      }
    } catch {
      // Ignore errors on logout network failure
    } finally {
      clearTokens();
      saveUserToState(null);
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    const payload: Record<string, any> = {};
    if (updated.name !== undefined) payload.name = updated.name;
    if (updated.firstName !== undefined) payload.first_name = updated.firstName;
    if (updated.lastName !== undefined) payload.last_name = updated.lastName;
    if (updated.phone !== undefined) {
      payload.phone = updated.phone;
      payload.phone_number = updated.phone;
    }

    const response = await api.patch("/api/profile/", payload);
    const userData = response?.user || response;
    const mapped = mapDjangoUserToUserProfile(userData);
    saveUserToState(mapped);
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
        isLoading,
        isAdmin: user?.role === "admin" || Boolean(user?.email?.toLowerCase().includes("admin")),
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
