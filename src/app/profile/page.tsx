"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  PackageCheck, 
  MapPin, 
  CreditCard, 
  Heart, 
  LogOut, 
  ChevronRight, 
  Plus, 
  Check, 
  Trash2, 
  Edit2, 
  ShieldCheck, 
  TrendingUp, 
  Bell, 
  Tag, 
  Gift, 
  Smartphone, 
  Mail,
  Shield
} from "lucide-react";
import { useAuth, UserAddress } from "@/context/AuthContext";
import "@/styles/profile.css";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAdmin, orders, addresses, updateProfile, addAddress, deleteAddress, setDefaultAddress, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "pan" | "payments">("profile");
  
  // Profile form state
  const [isEditingInfo, setIsEditingInfo] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(user?.firstName || "Alexander");
  const [lastName, setLastName] = useState<string>(user?.lastName || "Vance");
  const [gender, setGender] = useState<"Male" | "Female">(user?.gender || "Male");
  const [email, setEmail] = useState<string>(user?.email || "alexander.vance@example.com");
  const [phone, setPhone] = useState<string>(user?.phone || "9876543210");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");

  // Address form state
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [newAddrName, setNewAddrName] = useState<string>("");
  const [newAddrPhone, setNewAddrPhone] = useState<string>("");
  const [newAddrPincode, setNewAddrPincode] = useState<string>("");
  const [newAddrLocality, setNewAddrLocality] = useState<string>("");
  const [newAddrStreet, setNewAddrStreet] = useState<string>("");
  const [newAddrCity, setNewAddrCity] = useState<string>("");
  const [newAddrState, setNewAddrState] = useState<string>("");
  const [newAddrLandmark, setNewAddrLandmark] = useState<string>("");
  const [newAddrType, setNewAddrType] = useState<"HOME" | "WORK">("HOME");

  // PAN Card state
  const [panNumber, setPanNumber] = useState<string>(user?.panCard || "ABCDE1234F");
  const [panName, setPanName] = useState<string>(user?.name || "Alexander Vance");
  const [panSaved, setPanSaved] = useState<boolean>(false);

  if (!user) {
    return (
      <div className="container py-8" style={{ textAlign: "center", minHeight: "50vh" }}>
            <div className="card" style={{ maxWidth: 450, margin: "2rem auto", padding: "2.5rem 2rem" }}>
              <User size={48} style={{ color: "#2874F0", margin: "0 auto 1rem auto" }} />
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Missing Flipkart Login</h2>
              <p style={{ color: "#878787", marginTop: "0.5rem" }}>
                Please log in to your Flipkart account to access your account profile and orders.
              </p>
              <Link href="/login" className="flipkart-btn-orange" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: "1.5rem", textDecoration: "none" }}>
                LOG IN TO FLIPKART
              </Link>
            </div>
          </div>
    );
  }

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      gender,
      email,
      phone
    });
    setIsEditingInfo(false);
    setSaveSuccessMsg("Profile details updated successfully!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleAddAddressSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrPhone || !newAddrPincode || !newAddrStreet) return;

    addAddress({
      label: newAddrType === "HOME" ? "Home" : "Work",
      recipient: newAddrName,
      phone: newAddrPhone,
      pincode: newAddrPincode,
      locality: newAddrLocality,
      street: newAddrStreet,
      city: newAddrCity || "Bengaluru",
      state: newAddrState || "Karnataka",
      landmark: newAddrLandmark,
      addressType: newAddrType,
      isDefault: addresses.length === 0
    });

    setIsAddingAddress(false);
    // Reset form
    setNewAddrName("");
    setNewAddrPhone("");
    setNewAddrPincode("");
    setNewAddrLocality("");
    setNewAddrStreet("");
    setNewAddrCity("");
    setNewAddrState("");
    setNewAddrLandmark("");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="account-page-root">
      <div style={{ backgroundColor: "#F1F3F6", minHeight: "85vh" }}>
        <div className="container">
          <div className="flipkart-account-layout">
            {/* LEFT SIDEBAR NAVIGATION */}
            <aside className="account-sidebar-stack">
              {/* User Avatar & Greeting Header Card */}
              <div className="account-user-card">
                <div className="user-avatar-circle">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="user-hello-text">Hello,</div>
                  <div className="user-display-name">{user.name}</div>
                </div>
              </div>

              {/* Account Navigation Menu Card */}
              <div className="account-nav-card">
                {/* Group 1: MY ORDERS */}
                <div className="nav-group">
                  <Link href="/orders" className="nav-group-header clickable">
                    <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <PackageCheck size={18} style={{ color: "#2874F0" }} /> MY ORDERS
                    </span>
                    <ChevronRight size={16} />
                  </Link>
                </div>

                {/* Group 2: ACCOUNT SETTINGS */}
                <div className="nav-group">
                  <div className="nav-group-header">
                    <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <User size={18} style={{ color: "#2874F0" }} /> ACCOUNT SETTINGS
                    </span>
                  </div>
                  <button
                    className={`nav-sub-item ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <span>Profile Information</span>
                  </button>
                  <button
                    className={`nav-sub-item ${activeTab === "addresses" ? "active" : ""}`}
                    onClick={() => setActiveTab("addresses")}
                  >
                    <span>Manage Addresses ({addresses.length})</span>
                  </button>
                  <button
                    className={`nav-sub-item ${activeTab === "pan" ? "active" : ""}`}
                    onClick={() => setActiveTab("pan")}
                  >
                    <span>PAN Card Information</span>
                  </button>
                </div>

                {/* Group 3: PAYMENTS */}
                <div className="nav-group">
                  <div className="nav-group-header">
                    <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <CreditCard size={18} style={{ color: "#2874F0" }} /> PAYMENTS
                    </span>
                  </div>
                  <button
                    className={`nav-sub-item ${activeTab === "payments" ? "active" : ""}`}
                    onClick={() => setActiveTab("payments")}
                  >
                    <span>Gift Cards & Saved Cards</span>
                  </button>
                </div>

                {/* Group 4: MY STUFF */}
                <div className="nav-group">
                  <div className="nav-group-header">
                    <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <Tag size={18} style={{ color: "#2874F0" }} /> MY STUFF
                    </span>
                  </div>
                  <Link href="/wishlist" className="nav-sub-item">
                    <span>My Wishlist</span>
                  </Link>
                </div>

                {/* Admin Panel Direct Shortcut if Admin */}
                {isAdmin && (
                  <div className="nav-group" style={{ background: "#FFF7ED" }}>
                    <Link href="/admin" className="nav-group-header clickable" style={{ color: "#E5530B" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Shield size={18} style={{ color: "#E5530B" }} /> ADMIN CONTROL PANEL
                      </span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                )}

                {/* Logout Action */}
                <button onClick={handleLogout} className="logout-nav-item">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </aside>

            {/* RIGHT MAIN CONTENT AREA */}
            <div className="account-content-pane">
              {saveSuccessMsg && (
                <div className="verified-badge" style={{ fontSize: "0.85rem", padding: "0.6rem 1rem", marginBottom: "1.25rem" }}>
                  <Check size={16} /> {saveSuccessMsg}
                </div>
              )}

              {/* TAB 1: PROFILE INFORMATION */}
              {activeTab === "profile" && (
                <div>
                  {/* Personal Info Header */}
                  <div className="pane-section-header">
                    <h2 className="pane-section-title">Personal Information</h2>
                    <button 
                      onClick={() => setIsEditingInfo(!isEditingInfo)} 
                      className="edit-link-btn"
                    >
                      {isEditingInfo ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile}>
                    <div className="personal-info-grid">
                      <div className="fk-field-box">
                        <label className="fk-field-label">First Name</label>
                        <input
                          type="text"
                          className="fk-field-input"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={!isEditingInfo}
                        />
                      </div>

                      <div className="fk-field-box">
                        <label className="fk-field-label">Last Name</label>
                        <input
                          type="text"
                          className="fk-field-input"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={!isEditingInfo}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "2rem" }}>
                      <label className="fk-field-label">Your Gender</label>
                      <div className="gender-radio-group">
                        <label className="gender-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={gender === "Male"}
                            onChange={() => setGender("Male")}
                            disabled={!isEditingInfo}
                          />
                          <span>Male</span>
                        </label>
                        <label className="gender-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={gender === "Female"}
                            onChange={() => setGender("Female")}
                            disabled={!isEditingInfo}
                          />
                          <span>Female</span>
                        </label>
                      </div>
                    </div>

                    {/* Email Address Block */}
                    <div className="pane-section-header" style={{ marginTop: "2rem" }}>
                      <h2 className="pane-section-title">
                        Email Address <span className="verified-badge">✓ Verified</span>
                      </h2>
                    </div>

                    <div className="personal-info-grid">
                      <div className="fk-field-box" style={{ gridColumn: "1 / -1" }}>
                        <input
                          type="email"
                          className="fk-field-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!isEditingInfo}
                        />
                      </div>
                    </div>

                    {/* Mobile Number Block */}
                    <div className="pane-section-header" style={{ marginTop: "1rem" }}>
                      <h2 className="pane-section-title">
                        Mobile Number <span className="verified-badge">✓ Verified</span>
                      </h2>
                    </div>

                    <div className="personal-info-grid">
                      <div className="fk-field-box" style={{ gridColumn: "1 / -1" }}>
                        <input
                          type="tel"
                          className="fk-field-input"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={!isEditingInfo}
                        />
                      </div>
                    </div>

                    {isEditingInfo && (
                      <button type="submit" className="fk-save-btn">
                        SAVE PROFILE DETAILS
                      </button>
                    )}
                  </form>

                  {/* Flipkart FAQs Accordion */}
                  <div className="flipkart-faq-box">
                    <h3 className="faq-title">Frequently Asked Questions</h3>
                    
                    <div className="faq-item">
                      <div className="faq-question">What happens when I update my email address or mobile number?</div>
                      <div className="faq-answer">
                        Your login identity updates automatically. You will receive future order updates, digital invoices, and account notifications on your updated details.
                      </div>
                    </div>

                    <div className="faq-item">
                      <div className="faq-question">Does my Flipkart account activity get lost if I change my details?</div>
                      <div className="faq-answer">
                        No! All your past orders, wishlist items, saved shipping addresses, and SuperCoins remain intact under your profile.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE ADDRESSES */}
              {activeTab === "addresses" && (
                <div>
                  <div className="pane-section-header">
                    <h2 className="pane-section-title">Manage Addresses</h2>
                  </div>

                  {/* Add New Address Trigger Button */}
                  <button 
                    onClick={() => setIsAddingAddress(!isAddingAddress)} 
                    className="add-address-trigger-btn"
                  >
                    <Plus size={18} /> {isAddingAddress ? "CANCEL ADDING ADDRESS" : "ADD A NEW ADDRESS"}
                  </button>

                  {/* Add Address Expandable Form */}
                  {isAddingAddress && (
                    <form onSubmit={handleAddAddressSubmit} className="address-form-box">
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>ADD A NEW ADDRESS</h3>
                      
                      <div className="form-row-2">
                        <div className="fk-field-box">
                          <label className="fk-field-label">Name *</label>
                          <input
                            type="text"
                            className="fk-field-input"
                            placeholder="Full Name"
                            value={newAddrName}
                            onChange={(e) => setNewAddrName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="fk-field-box">
                          <label className="fk-field-label">10-digit Mobile Number *</label>
                          <input
                            type="tel"
                            className="fk-field-input"
                            placeholder="Mobile Number"
                            value={newAddrPhone}
                            onChange={(e) => setNewAddrPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="fk-field-box">
                          <label className="fk-field-label">Pincode *</label>
                          <input
                            type="text"
                            className="fk-field-input"
                            placeholder="6-digit Pincode"
                            value={newAddrPincode}
                            onChange={(e) => setNewAddrPincode(e.target.value)}
                            required
                          />
                        </div>
                        <div className="fk-field-box">
                          <label className="fk-field-label">Locality *</label>
                          <input
                            type="text"
                            className="fk-field-input"
                            placeholder="Locality / Area"
                            value={newAddrLocality}
                            onChange={(e) => setNewAddrLocality(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="fk-field-box" style={{ marginBottom: "1rem" }}>
                        <label className="fk-field-label">Address (Area and Street) *</label>
                        <textarea
                          rows={2}
                          className="fk-field-input"
                          style={{ height: "auto", padding: "0.5rem" }}
                          placeholder="Flat no, House name, Street address"
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="fk-field-box">
                          <label className="fk-field-label">City / District / Town *</label>
                          <input
                            type="text"
                            className="fk-field-input"
                            placeholder="City"
                            value={newAddrCity}
                            onChange={(e) => setNewAddrCity(e.target.value)}
                          />
                        </div>
                        <div className="fk-field-box">
                          <label className="fk-field-label">State *</label>
                          <input
                            type="text"
                            className="fk-field-input"
                            placeholder="State"
                            value={newAddrState}
                            onChange={(e) => setNewAddrState(e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: "1.25rem" }}>
                        <label className="fk-field-label">Address Type</label>
                        <div className="gender-radio-group">
                          <label className="gender-label">
                            <input
                              type="radio"
                              name="addrType"
                              value="HOME"
                              checked={newAddrType === "HOME"}
                              onChange={() => setNewAddrType("HOME")}
                            />
                            <span>Home (All day delivery)</span>
                          </label>
                          <label className="gender-label">
                            <input
                              type="radio"
                              name="addrType"
                              value="WORK"
                              checked={newAddrType === "WORK"}
                              onChange={() => setNewAddrType("WORK")}
                            />
                            <span>Work (Delivery between 10 AM - 6 PM)</span>
                          </label>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "1rem" }}>
                        <button type="submit" className="fk-save-btn">
                          SAVE ADDRESS
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setIsAddingAddress(false)}
                          style={{ color: "#2874F0", fontWeight: 700, background: "none", border: "none" }}
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Address List */}
                  <div className="address-cards-stack">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="flipkart-address-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span className="address-type-tag">{addr.addressType}</span>
                            <span className="address-recipient">{addr.recipient}</span>
                            <span className="address-phone">{addr.phone}</span>
                          </div>
                          {addr.isDefault && (
                            <span className="verified-badge">DEFAULT ADDRESS</span>
                          )}
                        </div>

                        <div className="address-text-body">
                          {addr.street}, {addr.locality}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                          {addr.landmark && <div>Landmark: {addr.landmark}</div>}
                        </div>

                        <div className="address-actions-bar">
                          {!addr.isDefault && (
                            <button onClick={() => setDefaultAddress(addr.id)} className="addr-action-btn">
                              SET AS DEFAULT
                            </button>
                          )}
                          <button onClick={() => deleteAddress(addr.id)} className="addr-action-btn delete">
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PAN CARD INFORMATION */}
              {activeTab === "pan" && (
                <div>
                  <div className="pane-section-header">
                    <h2 className="pane-section-title">PAN Card Information</h2>
                  </div>

                  <div className="personal-info-grid">
                    <div className="fk-field-box">
                      <label className="fk-field-label">PAN Card Number</label>
                      <input
                        type="text"
                        className="fk-field-input"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        maxLength={10}
                      />
                    </div>
                    <div className="fk-field-box">
                      <label className="fk-field-label">Full Name on PAN Card</label>
                      <input
                        type="text"
                        className="fk-field-input"
                        value={panName}
                        onChange={(e) => setPanName(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setPanSaved(true)} 
                    className="fk-save-btn"
                  >
                    SAVE PAN CARD DETAILS
                  </button>

                  {panSaved && (
                    <div className="verified-badge" style={{ marginTop: "1rem", display: "inline-flex" }}>
                      ✓ PAN Details verified successfully for Tax Invoices
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PAYMENTS */}
              {activeTab === "payments" && (
                <div>
                  <div className="pane-section-header">
                    <h2 className="pane-section-title">Flipkart Gift Cards & Saved Cards</h2>
                  </div>

                  <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem", background: "#F4F8FF", border: "1px solid #2874F0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.8rem", color: "#878787", fontWeight: 700 }}>FLIPKART GIFT CARD BALANCE</div>
                        <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#2874F0" }}>$0.00 / ₹0</div>
                      </div>
                      <button className="flipkart-btn-orange" style={{ width: "auto", padding: "0 1.25rem", height: 40 }}>
                        + Add Gift Card
                      </button>
                    </div>
                  </div>

                  <div className="faq-title">Saved Payment Methods</div>
                  <p style={{ fontSize: "0.875rem", color: "#878787" }}>
                    No saved cards yet. Cards used during checkout will safely appear here for fast 1-click payments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
