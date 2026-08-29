"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  ChevronDown, 
  Bell, 
  Sparkles, 
  Coins, 
  Check, 
  Plus, 
  X, 
  PackageCheck 
} from "lucide-react";
import { useAuth, UserAddress } from "@/context/AuthContext";
import MobileSearchBar from "./MobileSearchBar";

export default function MobileHomeHeader() {
  const { user, addresses, orders } = useAuth();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const defaultAddr = addresses.find((a) => a.isDefault);
    return defaultAddr ? defaultAddr.id : addresses[0]?.id || "default";
  });

  const activeOrdersCount = orders.filter((o) => o.status === "In Transit" || o.status === "Processing").length;

  const currentAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const addressLabel = currentAddress?.label || "Home";
  const addressSummary = currentAddress
    ? `${currentAddress.locality || currentAddress.city}, ${currentAddress.pincode}`
    : "Bengaluru 560001";

  const handleSelectAddress = (addr: UserAddress) => {
    setSelectedAddressId(addr.id);
    setIsAddressModalOpen(false);
  };

  return (
    <header className="al-mobile-home-header" aria-label="Mobile App Header">
      {/* 1. Top Bar: Brand, Address Selector, Actions */}
      <div className="al-mobile-header-top-row">
        {/* Brand Logo with App Emblem */}
        <Link href="/" className="al-mobile-brand-link" aria-label="Al-Umaima Home">
          <div className="al-mobile-brand-badge">
            <Sparkles size={14} className="al-mobile-brand-sparkle" />
          </div>
          <span className="al-mobile-brand-title">AL-UMAIMA</span>
        </Link>

        {/* Right Side Icons: Coins / Loyalty & Notifications / Orders */}
        <div className="al-mobile-header-actions">
          {/* Member Rewards / SuperCoins badge reference */}
          <Link href="/profile" className="al-mobile-coin-badge" title="Rewards Balance">
            <Coins size={14} className="al-mobile-coin-icon" />
            <span className="al-mobile-coin-val">250</span>
          </Link>

          {/* Active Orders / Notification Link */}
          <Link
            href="/orders"
            className="al-mobile-header-btn"
            title="Your Orders"
            aria-label="Your Orders"
          >
            <Bell size={18} />
            {activeOrdersCount > 0 && (
              <span className="al-mobile-badge-dot" />
            )}
          </Link>
        </div>
      </div>

      {/* 2. Delivery Address Selector Strip (Flipkart Reference Style) */}
      <div className="al-mobile-location-strip">
        <button
          type="button"
          className="al-mobile-location-btn"
          onClick={() => setIsAddressModalOpen(true)}
          aria-label="Select delivery address"
        >
          <MapPin size={14} className="al-mobile-loc-pin" />
          <div className="al-mobile-loc-text">
            <span className="al-mobile-loc-tag">{addressLabel.toUpperCase()}</span>
            <span className="al-mobile-loc-summary">{addressSummary}</span>
          </div>
          <ChevronDown size={14} className="al-mobile-loc-arrow" />
        </button>
      </div>

      {/* 3. Prominent Search Bar */}
      <MobileSearchBar />

      {/* Address Switcher Bottom Sheet Modal */}
      {isAddressModalOpen && (
        <div
          className="al-mobile-sheet-overlay"
          onClick={() => setIsAddressModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="al-mobile-sheet-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="al-mobile-sheet-drag-handle" />
            <div className="al-mobile-sheet-header">
              <div className="al-mobile-sheet-title-wrap">
                <MapPin size={18} className="text-primary" />
                <h3 className="al-mobile-sheet-title">Select Delivery Location</h3>
              </div>
              <button
                type="button"
                className="al-mobile-sheet-close"
                onClick={() => setIsAddressModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="al-mobile-sheet-desc">
              Choose your address to see accurate product availability and delivery timelines.
            </p>

            <div className="al-mobile-address-list">
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <div
                    key={addr.id}
                    className={`al-mobile-address-item ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectAddress(addr)}
                  >
                    <div className="al-mobile-addr-radio">
                      <span className={`al-radio-dot ${isSelected ? "active" : ""}`} />
                    </div>
                    <div className="al-mobile-addr-info">
                      <div className="al-mobile-addr-label-row">
                        <span className="al-mobile-addr-type-pill">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="al-mobile-addr-default-tag">Default</span>
                        )}
                        <span className="al-mobile-addr-recipient">{addr.recipient}</span>
                      </div>
                      <p className="al-mobile-addr-street">
                        {addr.street}, {addr.locality}, {addr.city} - {addr.pincode}
                      </p>
                    </div>
                    {isSelected && <Check size={18} className="al-mobile-addr-check" />}
                  </div>
                );
              })}
            </div>

            <div className="al-mobile-sheet-footer">
              <Link
                href="/profile/addresses"
                className="al-mobile-sheet-add-btn"
                onClick={() => setIsAddressModalOpen(false)}
              >
                <Plus size={16} /> Add or Manage Addresses
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
