"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Truck,
  MapPin,
  ShieldCheck,
  ChevronRight,
  User,
  Plus,
  Trash2,
  Lock,
  LogOut,
  ArrowLeft,
  Check
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "@/styles/profile.css";

export default function ProfilePage() {
  const router = useRouter();
  const { user, addresses, addAddress, deleteAddress, logout, updateProfile } = useAuth();

  const [activeModal, setActiveModal] = useState<"addresses" | "security" | null>(null);
  const [newAddrName, setNewAddrName] = useState("");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("New York");
  const [newAddrZip, setNewAddrZip] = useState("10001");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const userName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName}` : "Alex Johnson");

  const handleAddAddress = (e: FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrStreet) return;
    addAddress({
      label: "Home",
      recipient: newAddrName,
      phone: "+1 555-0123",
      pincode: newAddrZip,
      locality: newAddrCity,
      street: newAddrStreet,
      city: newAddrCity,
      state: "NY",
      landmark: "",
      addressType: "HOME",
      isDefault: addresses.length === 0,
    });
    setNewAddrName("");
    setNewAddrStreet("");
    setSaveSuccessMsg("Address added successfully!");
    setTimeout(() => setSaveSuccessMsg(""), 2500);
  };

  return (
    <div className="al-profile-page">
      {/* Top Dark Navy Header Area Matching Attachment 1 */}
      <div className="al-profile-header-banner">
        <div className="container al-profile-header-content">
          <div className="al-profile-user-row">
            {/* User Avatar with Status Dot */}
            <div className="al-avatar-container">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt={userName}
                className="al-user-avatar-img"
              />
              <span className="al-avatar-status-dot" />
            </div>

            {/* Greeting & Name */}
            <div className="al-user-greeting-block">
              <span className="al-greeting-text">Good Morning,</span>
              <h1 className="al-user-display-name">{userName}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Body Container */}
      <div className="container al-profile-main-container">
        {/* Assured Member Perk Card */}
        <div className="al-member-benefit-card">
          <div className="al-benefit-icon-wrap">
            <ShieldCheck size={24} className="al-benefit-shield-icon" />
          </div>
          <div className="al-benefit-text-wrap">
            <h2 className="al-benefit-title">Al-Umaima Assured Member</h2>
            <p className="al-benefit-subtitle">Free shipping on all premium electronics</p>
          </div>
        </div>

        {/* Main Action Menu Cards */}
        <div className="al-profile-menu-list">
          {/* Card 1: Your Orders */}
          <Link href="/orders" className="al-profile-nav-card">
            <div className="al-nav-card-icon-wrap">
              <Package size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Your Orders</h3>
              <p className="al-nav-card-desc">View history &amp; invoices</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </Link>

          {/* Card 2: Tracking */}
          <Link href="/track-order" className="al-profile-nav-card">
            <div className="al-nav-card-icon-wrap">
              <Truck size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Tracking</h3>
              <p className="al-nav-card-desc">Track active deliveries</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </Link>

          {/* Card 3: Saved Addresses (Attachment 2) */}
          <Link href="/profile/addresses" className="al-profile-nav-card">
            <div className="al-nav-card-icon-wrap">
              <MapPin size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Saved Addresses</h3>
              <p className="al-nav-card-desc">Manage delivery locations</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </Link>

          {/* Card 4: Payment Methods (Attachment 3) */}
          <Link href="/profile/payment-methods" className="al-profile-nav-card">
            <div className="al-nav-card-icon-wrap">
              <ShieldCheck size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Payment Methods</h3>
              <p className="al-nav-card-desc">Saved cards &amp; UPI IDs</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </Link>

          {/* Card 5: Security */}
          <button 
            type="button" 
            onClick={() => setActiveModal("security")} 
            className="al-profile-nav-card"
          >
            <div className="al-nav-card-icon-wrap">
              <Lock size={22} className="al-nav-card-icon" />
            </div>
            <div className="al-nav-card-texts">
              <h3 className="al-nav-card-title">Security</h3>
              <p className="al-nav-card-desc">Passwords &amp; 2FA settings</p>
            </div>
            <ChevronRight size={18} className="al-nav-card-chevron" />
          </button>
        </div>


        {/* Sign Out Action Button */}
        <div className="al-logout-wrap">
          <button type="button" onClick={logout} className="al-profile-logout-btn">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Addresses Modal */}
      {activeModal === "addresses" && (
        <div className="al-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="al-profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="al-modal-head">
              <h3>Saved Delivery Addresses</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="al-close-btn">✕</button>
            </div>

            {saveSuccessMsg && (
              <div className="al-success-alert">{saveSuccessMsg}</div>
            )}

            <div className="al-address-list-wrap">
              {addresses.map((addr) => (
                <div key={addr.id} className="al-address-pill">
                  <div className="al-addr-details">
                    <strong>{addr.recipient}</strong>
                    <span>{addr.street}, {addr.city}, {addr.pincode}</span>
                  </div>
                  <button type="button" onClick={() => deleteAddress(addr.id)} className="al-addr-del-btn">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddAddress} className="al-addr-form">
              <h4 className="al-form-subheading">Add New Address</h4>
              <input
                type="text"
                placeholder="Full Name"
                value={newAddrName}
                onChange={(e) => setNewAddrName(e.target.value)}
                className="al-input"
                required
              />
              <input
                type="text"
                placeholder="Street Address"
                value={newAddrStreet}
                onChange={(e) => setNewAddrStreet(e.target.value)}
                className="al-input"
                required
              />
              <div className="al-form-two-col">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddrCity}
                  onChange={(e) => setNewAddrCity(e.target.value)}
                  className="al-input"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={newAddrZip}
                  onChange={(e) => setNewAddrZip(e.target.value)}
                  className="al-input"
                />
              </div>
              <button type="submit" className="al-btn-submit-addr">
                <Plus size={16} /> Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {activeModal === "security" && (
        <div className="al-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="al-profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="al-modal-head">
              <h3>Security & 2FA Settings</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="al-close-btn">✕</button>
            </div>

            <div className="al-security-content">
              <div className="al-security-item">
                <div className="al-sec-info">
                  <strong>Two-Factor Authentication (2FA)</strong>
                  <span>Protect your account with extra SMS or Authenticator verification.</span>
                </div>
                <span className="al-badge-enabled">Active</span>
              </div>

              <div className="al-security-item">
                <div className="al-sec-info">
                  <strong>Password</strong>
                  <span>Last updated 3 months ago.</span>
                </div>
                <button type="button" className="al-btn-outline-sm">Change</button>
              </div>

              <div className="al-security-item">
                <div className="al-sec-info">
                  <strong>Active Login Sessions</strong>
                  <span>Logged in on Windows 11 (Current session).</span>
                </div>
                <span className="al-badge-current">Current</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
