"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
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
  status: "Delivered" | "In Transit" | "Processing" | "Cancelled" | string;
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
  label?: string;
  recipient: string;
  phone: string;
  pincode: string;
  locality?: string;
  street: string;
  city: string;
  state: string;
  landmark?: string;
  alternatePhone?: string;
  addressType?: "HOME" | "WORK" | string;
  isDefault: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  orders: UserOrder[];
  addresses: UserAddress[];
  login: (emailOrPhone: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<boolean>;
  forgotPassword: (email: string) => boolean;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  addAddress: (addr: Omit<UserAddress, "id">) => Promise<void>;
  editAddress: (id: string, updated: Partial<UserAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: "Delivered" | "In Transit" | "Processing" | "Cancelled") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



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
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);

  const fetchAddresses = useCallback(async () => {
    try {
      const data = await api.get("/api/addresses/");
      if (Array.isArray(data)) {
        const mapped = data.map((addr: any) => ({
          id: String(addr.id),
          label: addr.address_type === "home" ? "Home" : addr.address_type === "work" ? "Work" : "Other",
          recipient: addr.full_name || addr.name || "Recipient",
          phone: addr.phone_number || addr.phone || "",
          pincode: addr.postal_code || addr.pincode || "",
          locality: addr.locality || "",
          street: addr.street_address || addr.address || "",
          city: addr.city || "",
          state: addr.state || "",
          landmark: addr.landmark || "",
          alternatePhone: addr.alternate_phone || "",
          addressType: addr.address_type === "work" ? "WORK" : "HOME",
          isDefault: Boolean(addr.is_default),
        }));
        setAddresses(mapped);
      }
    } catch (e) {
      console.warn("Failed to fetch addresses:", e);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await api.get("/api/orders/");
      const ordersData = Array.isArray(data) ? data : (data?.results || []);
      
      const mapped = ordersData.map((ord: any) => ({
        id: ord.order_number || String(ord.id),
        date: ord.created_at || ord.date || "",
        status: ord.status_display || ord.status || "Processing",
        totalAmount: Number(ord.total_amount || ord.totalAmount || 0),
        itemsCount: ord.items_count || ord.itemsCount || 0,
        trackingNumber: ord.tracking_number || ord.trackingNumber || "",
        estimatedDelivery: ord.estimated_delivery || ord.estimatedDelivery || "",
        items: (ord.items || []).map((item: any) => ({
          id: String(item.product_id || item.id),
          title: item.product_name || item.title || "",
          price: Number(item.unit_price || item.price || 0),
          quantity: item.quantity || item.qty || 1,
          image: item.product_image_url || item.image || "",
        })),
        shippingAddress: ord.shippingAddress || "N/A",
        paymentMethod: ord.payment_method || ord.paymentMethod || "N/A",
      }));
      setOrders(mapped);
    } catch (e) {
      console.warn("Failed to fetch orders:", e);
    }
  }, []);

  const loadUserData = useCallback(async () => {
    if (getAccessToken()) {
      await Promise.all([fetchAddresses(), fetchOrders()]);
    } else {
      setAddresses([]);
      setOrders([]);
    }
  }, [fetchAddresses, fetchOrders]);

  // Initialize with demo user logged in for fast development experience
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const token = getAccessToken() || getRefreshToken();
      if (!token) {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
          setAddresses([]);
          setOrders([]);
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
          await loadUserData();
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
  }, [loadUserData]);

  const saveUserToState = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("al_umaima_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("al_umaima_user");
      setAddresses([]);
      setOrders([]);
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
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('aurastore_login_success'));
      }
      await loadUserData();
    }

    return true;
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
      await loadUserData();
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
      setAddresses([]);
      setOrders([]);
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

  const addAddress = async (newAddr: Omit<UserAddress, "id">) => {
    try {
      const payload = {
        full_name: newAddr.recipient,
        phone_number: newAddr.phone,
        street_address: newAddr.street,
        city: newAddr.city,
        state: newAddr.state,
        postal_code: newAddr.pincode,
        country: "India",
        is_default: newAddr.isDefault,
        address_type: newAddr.addressType === "WORK" ? "work" : "home",
      };
      await api.post("/api/addresses/", payload);
      await fetchAddresses();
    } catch (e) {
      console.error("Failed to add address", e);
    }
  };

  const editAddress = async (id: string, updated: Partial<UserAddress>) => {
    try {
      const payload: any = {};
      if (updated.recipient !== undefined) payload.full_name = updated.recipient;
      if (updated.phone !== undefined) payload.phone_number = updated.phone;
      if (updated.street !== undefined) payload.street_address = updated.street;
      if (updated.city !== undefined) payload.city = updated.city;
      if (updated.state !== undefined) payload.state = updated.state;
      if (updated.pincode !== undefined) payload.postal_code = updated.pincode;
      if (updated.isDefault !== undefined) payload.is_default = updated.isDefault;
      
      await api.patch(`/api/addresses/${id}/`, payload);
      await fetchAddresses();
    } catch (e) {
      console.error("Failed to edit address", e);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await api.delete(`/api/addresses/${id}/`);
      await fetchAddresses();
    } catch (e) {
      console.error("Failed to delete address", e);
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      await api.post(`/api/addresses/${id}/set-default/`, {});
      await fetchAddresses();
    } catch (e) {
      console.error("Failed to set default address", e);
    }
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

