"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  ShieldCheck,
  ChevronRight,
  User,
  Heart,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Check,
  Lock,
  Globe,
  Moon,
  Trash2,
  Sliders,
  DollarSign,
  Smartphone,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import "@/styles/profile.css";

export default function ProfilePage() {
  const router = useRouter();
  const { user, addresses, logout, updateProfile } = useAuth();
  const { wishlistCount } = useWishlist();
  const { showToast } = useToast();

  // Active Modals: "profile" | "settings" | "notifications" | "security" | null
  const [activeModal, setActiveModal] = useState<"profile" | "settings" | "notifications" | "security" | null>(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState<
    "notifications" | "language" | "theme" | "privacy" | "security" | "preferences"
  >("notifications");

  // Profile Edit State
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [emailInput, setEmailInput] = useState(user?.email || "");
  const [phoneInput, setPhoneInput] = useState(user?.phone || "");

  // Settings State backed by localStorage
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifDeals, setNotifDeals] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");
  const [selectedTheme, setSelectedTheme] = useState("System Default");
  const [selectedCurrency, setSelectedCurrency] = useState("USD ($)");
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("al_pref_lang");
      if (savedLang) setSelectedLanguage(savedLang);

      const savedTheme = localStorage.getItem("al_pref_theme");
      if (savedTheme) setSelectedTheme(savedTheme);

      const savedCurr = localStorage.getItem("al_pref_currency");
      if (savedCurr) setSelectedCurrency(savedCurr);

      const savedNotifOrders = localStorage.getItem("al_pref_notif_orders");
      if (savedNotifOrders !== null) setNotifOrders(savedNotifOrders === "true");

      const savedNotifDeals = localStorage.getItem("al_pref_notif_deals");
      if (savedNotifDeals !== null) setNotifDeals(savedNotifDeals === "true");

      const saved2FA = localStorage.getItem("al_pref_2fa");
      if (saved2FA !== null) setIsTwoFactorEnabled(saved2FA === "true");
    } catch {
      /* ignore */
    }
  }, []);

  const userName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName}` : "Alexander Vance");

  const handleUpdateProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput,
      email: emailInput,
      phone: phoneInput,
    });
    showToast("Profile information updated successfully");
    setActiveModal(null);
  };

  const handleToggleNotifOrders = () => {
    const next = !notifOrders;
    setNotifOrders(next);
    localStorage.setItem("al_pref_notif_orders", String(next));
    showToast(next ? "Order alerts enabled" : "Order alerts muted");
  };

  const handleToggleNotifDeals = () => {
    const next = !notifDeals;
    setNotifDeals(next);
    localStorage.setItem("al_pref_notif_deals", String(next));
    showToast(next ? "Promotional notifications enabled" : "Promotional alerts muted");
  };

  const handleToggleNotifSms = () => {
    const next = !notifSms;
    setNotifSms(next);
    showToast(next ? "SMS delivery alerts enabled" : "SMS alerts turned off");
  };

  const handleSelectLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem("al_pref_lang", lang);
    showToast(`Language set to ${lang}`);
  };

  const handleSelectTheme = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem("al_pref_theme", theme);
    showToast(`Theme updated to ${theme}`);
  };

  const handleSelectCurrency = (curr: string) => {
    setSelectedCurrency(curr);
    localStorage.setItem("al_pref_currency", curr);
    showToast(`Currency changed to ${curr}`);
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem("aurastore_recent");
      showToast("Recently viewed browsing history cleared");
    } catch {
      showToast("History cleared");
    }
  };

  const handleToggle2FA = () => {
    const next = !isTwoFactorEnabled;
    setIsTwoFactorEnabled(next);
    localStorage.setItem("al_pref_2fa", String(next));
    showToast(next ? "Two-Factor Authentication enabled" : "2FA turned off");
  };

  return (
    <div className="al-profile-page">
      {/* Top Header Area */}
      <div className="al-profile-header-banner">
        <div className="container al-profile-header-content">
          <div className="al-profile-user-row">
            <div className="al-avatar-container">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                alt={userName}
                className="al-user-avatar-img"
              />
              <span className="al-avatar-status-dot" />
            </div>

            <div className="al-user-greeting-block">
              <span className="al-greeting-text">Welcome back,</span>
              <h1 className="al-user-display-name">{userName}</h1>
              <span className="al-user-email-tag">{user?.email || "alexander.vance@example.com"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Account Container */}
      <div className="container al-profile-main-container">
        {/* Assured Member Perk Card */}
        <div className="al-member-benefit-card">
          <div className="al-benefit-icon-wrap">
            <ShieldCheck size={24} className="al-benefit-shield-icon" />
          </div>
          <div className="al-benefit-text-wrap">
            <h2 className="al-benefit-title">Al-Umaima Assured Plus</h2>
            <p className="al-benefit-subtitle">Free express shipping & priority 24/7 concierge</p>
          </div>
        </div>

        {/* Complete Account Menu List (Matching Requirement 3) */}
        <div className="al-profile-menu-list">
          {/* 1. My Profile */}
          <button
            type="button"
            className="al-profile-nav-card"
            onClick={() => {
              setNameInput(user?.name || "");
              setEmailInput(user?.email || "");
              setPhoneInput(user?.phone || "");
              setActiveModal("profile");
            }}
          >
            <div className="al-nav-card-icon-wrap">
              <User size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">My Profile</h3>
              <p className="al-nav-card-desc">Personal details, email & phone</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </button>

          {/* 2. My Orders */}
          <Link href="/orders" className="al-profile-nav-card">
            <div className="al-nav-card-icon-wrap">
              <Package size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">My Orders</h3>
              <p className="al-nav-card-desc">Track active shipments & past invoices</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </Link>

          {/* 3. Wishlist */}
          <Link href="/wishlist" className="al-profile-nav-card">
            <div className="al-nav-card-icon-wrap">
              <Heart size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Wishlist</h3>
              <p className="al-nav-card-desc">{wishlistCount} saved items</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </Link>

          {/* 4. Saved Addresses */}
          <Link href="/profile/addresses" className="al-profile-nav-card">
            <div className="al-nav-card-icon-wrap">
              <MapPin size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Saved Addresses</h3>
              <p className="al-nav-card-desc">{addresses.length} delivery addresses saved</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </Link>

          {/* 5. Payment Methods */}
          <Link href="/profile/payment-methods" className="al-profile-nav-card">
            <div className="al-nav-card-icon-wrap">
              <CreditCard size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Payment Methods</h3>
              <p className="al-nav-card-desc">Saved cards, UPI & wallets</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </Link>

          {/* 6. Notifications */}
          <button
            type="button"
            className="al-profile-nav-card"
            onClick={() => setActiveModal("notifications")}
          >
            <div className="al-nav-card-icon-wrap">
              <Bell size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Notifications</h3>
              <p className="al-nav-card-desc">Alerts, deals & order status</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </button>

          {/* 7. Settings (With Sub-Tree) */}
          <button
            type="button"
            className="al-profile-nav-card"
            onClick={() => setActiveModal("settings")}
          >
            <div className="al-nav-card-icon-wrap">
              <Settings size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Settings</h3>
              <p className="al-nav-card-desc">Language, theme, privacy & preferences</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </button>

          {/* 8. Help & Support */}
          <Link href="/faq" className="al-profile-nav-card">
            <div className="al-nav-card-icon-wrap">
              <HelpCircle size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Help &amp; Support</h3>
              <p className="al-nav-card-desc">FAQs, returns & contact customer care</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </Link>

          {/* 9. Logout */}
          <button
            type="button"
            className="al-profile-nav-card al-profile-nav-logout"
            onClick={() => {
              logout();
              showToast("Signed out successfully");
              router.push("/login");
            }}
          >
            <div className="al-nav-card-icon-wrap">
              <LogOut size={22} className="al-nav-card-icon text-danger" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title text-danger">Logout</h3>
              <p className="al-nav-card-desc">Sign out of this device</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </button>
        </div>
      </div>

      {/* MODAL 1: Edit Profile */}
      {activeModal === "profile" && (
        <div className="al-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="al-profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="al-modal-head">
              <h3>Edit Personal Profile</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="al-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="al-profile-edit-form">
              <div className="al-form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="al-input"
                  required
                />
              </div>

              <div className="al-form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="al-input"
                  required
                />
              </div>

              <div className="al-form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="al-input"
                />
              </div>

              <div className="al-form-actions">
                <button type="button" onClick={() => setActiveModal(null)} className="al-btn-outline">
                  Cancel
                </button>
                <button type="submit" className="al-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Settings (Requirement 3: Settings with Tree of Options) */}
      {activeModal === "settings" && (
        <div className="al-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="al-profile-modal-card al-settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="al-modal-head">
              <div className="al-settings-modal-title">
                <Settings size={20} />
                <h3>Account Settings</h3>
              </div>
              <button type="button" onClick={() => setActiveModal(null)} className="al-close-btn">
                <X size={18} />
              </button>
            </div>

            {/* Settings Horizontal Navigation Pills */}
            <div className="al-settings-tabs no-scrollbar">
              <button
                type="button"
                className={`al-settings-tab ${activeSettingsTab === "notifications" ? "active" : ""}`}
                onClick={() => setActiveSettingsTab("notifications")}
              >
                <Bell size={14} /> Notifications
              </button>
              <button
                type="button"
                className={`al-settings-tab ${activeSettingsTab === "language" ? "active" : ""}`}
                onClick={() => setActiveSettingsTab("language")}
              >
                <Globe size={14} /> Language
              </button>
              <button
                type="button"
                className={`al-settings-tab ${activeSettingsTab === "theme" ? "active" : ""}`}
                onClick={() => setActiveSettingsTab("theme")}
              >
                <Moon size={14} /> Theme
              </button>
              <button
                type="button"
                className={`al-settings-tab ${activeSettingsTab === "privacy" ? "active" : ""}`}
                onClick={() => setActiveSettingsTab("privacy")}
              >
                <EyeOff size={14} /> Privacy
              </button>
              <button
                type="button"
                className={`al-settings-tab ${activeSettingsTab === "security" ? "active" : ""}`}
                onClick={() => setActiveSettingsTab("security")}
              >
                <Lock size={14} /> Security
              </button>
              <button
                type="button"
                className={`al-settings-tab ${activeSettingsTab === "preferences" ? "active" : ""}`}
                onClick={() => setActiveSettingsTab("preferences")}
              >
                <Sliders size={14} /> Preferences
              </button>
            </div>

            {/* Settings Tab Content */}
            <div className="al-settings-body">
              {/* 1. Notifications Tab */}
              {activeSettingsTab === "notifications" && (
                <div className="al-settings-panel">
                  <h4 className="al-settings-section-title">Notification Preferences</h4>

                  <div className="al-setting-toggle-row">
                    <div className="al-toggle-info">
                      <strong>Order Status Updates</strong>
                      <span>Real-time notifications when your items are shipped and out for delivery.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifOrders}
                      onChange={handleToggleNotifOrders}
                      className="al-toggle-switch"
                    />
                  </div>

                  <div className="al-setting-toggle-row">
                    <div className="al-toggle-info">
                      <strong>Deals &amp; Promotional Alerts</strong>
                      <span>Flash sales, coupon releases, and price-drop alerts on saved items.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifDeals}
                      onChange={handleToggleNotifDeals}
                      className="al-toggle-switch"
                    />
                  </div>

                  <div className="al-setting-toggle-row">
                    <div className="al-toggle-info">
                      <strong>SMS Text Notifications</strong>
                      <span>Delivery updates delivered directly to your registered phone number.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifSms}
                      onChange={handleToggleNotifSms}
                      className="al-toggle-switch"
                    />
                  </div>
                </div>
              )}

              {/* 2. Language Tab */}
              {activeSettingsTab === "language" && (
                <div className="al-settings-panel">
                  <h4 className="al-settings-section-title">App Display Language</h4>
                  <div className="al-options-list">
                    {[
                      { id: "en", name: "English (US)" },
                      { id: "ar", name: "Arabic (العربية)" },
                      { id: "es", name: "Spanish (Español)" },
                      { id: "fr", name: "French (Français)" },
                    ].map((lang) => (
                      <div
                        key={lang.id}
                        className={`al-option-item ${selectedLanguage === lang.name ? "selected" : ""}`}
                        onClick={() => handleSelectLanguage(lang.name)}
                      >
                        <span>{lang.name}</span>
                        {selectedLanguage === lang.name && <Check size={16} className="text-primary" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Theme Tab */}
              {activeSettingsTab === "theme" && (
                <div className="al-settings-panel">
                  <h4 className="al-settings-section-title">Appearance &amp; Theme</h4>
                  <div className="al-options-list">
                    {[
                      { id: "system", name: "System Default" },
                      { id: "light", name: "Light Mode" },
                      { id: "dark", name: "Dark Mode (Preview)" },
                    ].map((theme) => (
                      <div
                        key={theme.id}
                        className={`al-option-item ${selectedTheme === theme.name ? "selected" : ""}`}
                        onClick={() => handleSelectTheme(theme.name)}
                      >
                        <span>{theme.name}</span>
                        {selectedTheme === theme.name && <Check size={16} className="text-primary" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Privacy Tab */}
              {activeSettingsTab === "privacy" && (
                <div className="al-settings-panel">
                  <h4 className="al-settings-section-title">Data &amp; Browsing Privacy</h4>

                  <div className="al-setting-action-block">
                    <div className="al-toggle-info">
                      <strong>Recently Viewed Products</strong>
                      <span>Clear your local product browsing history from this browser.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="al-btn-danger-sm"
                    >
                      <Trash2 size={14} /> Clear History
                    </button>
                  </div>

                  <div className="al-setting-toggle-row">
                    <div className="al-toggle-info">
                      <strong>Personalized Recommendations</strong>
                      <span>Allow product suggestions based on your search queries.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={personalizedAds}
                      onChange={() => {
                        setPersonalizedAds(!personalizedAds);
                        showToast("Personalization preference saved");
                      }}
                      className="al-toggle-switch"
                    />
                  </div>
                </div>
              )}

              {/* 5. Security Tab */}
              {activeSettingsTab === "security" && (
                <div className="al-settings-panel">
                  <h4 className="al-settings-section-title">Security &amp; Verification</h4>

                  <div className="al-setting-toggle-row">
                    <div className="al-toggle-info">
                      <strong>Two-Factor Authentication (2FA)</strong>
                      <span>Protect your account with extra SMS verification at checkout.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isTwoFactorEnabled}
                      onChange={handleToggle2FA}
                      className="al-toggle-switch"
                    />
                  </div>

                  <div className="al-security-item-card">
                    <div className="al-toggle-info">
                      <strong>Active Sessions</strong>
                      <span>Logged in on this browser (Current active session).</span>
                    </div>
                    <span className="al-badge-current">Active Now</span>
                  </div>
                </div>
              )}

              {/* 6. App Preferences Tab */}
              {activeSettingsTab === "preferences" && (
                <div className="al-settings-panel">
                  <h4 className="al-settings-section-title">App Currency &amp; Regional Preferences</h4>
                  <div className="al-options-list">
                    {[
                      { id: "usd", name: "USD ($)" },
                      { id: "inr", name: "INR (₹)" },
                      { id: "eur", name: "EUR (€)" },
                      { id: "aed", name: "AED (د.إ)" },
                    ].map((curr) => (
                      <div
                        key={curr.id}
                        className={`al-option-item ${selectedCurrency === curr.name ? "selected" : ""}`}
                        onClick={() => handleSelectCurrency(curr.name)}
                      >
                        <span>{curr.name}</span>
                        {selectedCurrency === curr.name && <Check size={16} className="text-primary" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="al-modal-foot">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="al-btn-primary full-width"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Direct Notifications Modal */}
      {activeModal === "notifications" && (
        <div className="al-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="al-profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="al-modal-head">
              <h3>Notification Preferences</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="al-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="al-settings-panel">
              <div className="al-setting-toggle-row">
                <div className="al-toggle-info">
                  <strong>Order Status Updates</strong>
                  <span>Instant alerts for transit and delivery.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifOrders}
                  onChange={handleToggleNotifOrders}
                  className="al-toggle-switch"
                />
              </div>

              <div className="al-setting-toggle-row">
                <div className="al-toggle-info">
                  <strong>Promotional Deals &amp; Discounts</strong>
                  <span>Flash sale drops and exclusive member pricing.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifDeals}
                  onChange={handleToggleNotifDeals}
                  className="al-toggle-switch"
                />
              </div>

              <div className="al-setting-toggle-row">
                <div className="al-toggle-info">
                  <strong>SMS Shipping Alerts</strong>
                  <span>SMS updates delivered directly to your device.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifSms}
                  onChange={handleToggleNotifSms}
                  className="al-toggle-switch"
                />
              </div>
            </div>

            <div className="al-modal-foot">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="al-btn-primary full-width"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
