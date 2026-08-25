"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  PackageCheck,
  MapPin,
  CreditCard,
  LogOut,
  ChevronRight,
  Plus,
  Check,
  Trash2,
  Shield,
  ShieldCheck,
  Star,
  Crown,
  LayoutDashboard,
  Lock,
  ArrowRight,
  Edit3,
  Truck,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "@/styles/profile.css";

type SidebarView = "dashboard" | "orders" | "addresses" | "security" | "payments";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAdmin, orders, addresses, updateProfile, addAddress, deleteAddress, setDefaultAddress, logout } = useAuth();

  const [activeView, setActiveView] = useState<SidebarView>("dashboard");

  const [firstName, setFirstName] = useState(user?.firstName || "Welcome");
  const [lastName, setLastName]   = useState(user?.lastName  || "User");
  const [email, setEmail]         = useState(user?.email     || "user@example.com");
  const [phone, setPhone]         = useState(user?.phone     || "+1 555-0123");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrName, setNewAddrName]   = useState("");
  const [newAddrPhone, setNewAddrPhone] = useState("");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrCity, setNewAddrCity]   = useState("");
  const [newAddrState, setNewAddrState] = useState("");
  const [newAddrZip, setNewAddrZip]     = useState("");
  const [newAddrType, setNewAddrType]   = useState<"HOME" | "WORK">("HOME");

  if (!user) {
    return (
      <div className="pf-page">
        <div className="pf-unauth-card">
          <User size={48} className="pf-unauth-icon" />
          <h2 className="pf-unauth-title">Sign in to your account</h2>
          <p className="pf-unauth-sub">Please log in to access your account profile and orders.</p>
          <Link href="/login" className="pf-unauth-btn">Log in to Al-Umaima</Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({ firstName, lastName, email, phone });
    setSaveSuccessMsg("Profile updated successfully!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleAddAddressSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrStreet) return;
    addAddress({
      label: newAddrType === "HOME" ? "Home" : "Work",
      recipient: newAddrName,
      phone: newAddrPhone,
      pincode: newAddrZip,
      locality: newAddrCity,
      street: newAddrStreet,
      city: newAddrCity || "New York",
      state: newAddrState || "NY",
      landmark: "",
      addressType: newAddrType,
      isDefault: addresses.length === 0,
    });
    setIsAddingAddress(false);
    setNewAddrName(""); setNewAddrPhone(""); setNewAddrStreet("");
    setNewAddrCity(""); setNewAddrState(""); setNewAddrZip("");
  };

  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  const recentOrders = orders.slice(0, 3);

  const sidebarLinks: { id: SidebarView; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard",  label: "Dashboard",       icon: <LayoutDashboard size={18} /> },
    { id: "orders",     label: "Your Orders",     icon: <PackageCheck size={18} /> },
    { id: "addresses",  label: "Saved Addresses", icon: <MapPin size={18} /> },
    { id: "security",   label: "Security",        icon: <Lock size={18} /> },
    { id: "payments",   label: "Payment Methods", icon: <CreditCard size={18} /> },
  ];

  // Mobile menu items matching attachment
  const mobileMenuItems = [
    {
      icon: <PackageCheck size={22} className="pf-mob-icon-orders" />,
      iconBg: "pf-mob-icon-bg-orders",
      label: "Your Orders",
      sub: "Track, return, or buy things again",
      action: () => setActiveView("orders"),
    },
    {
      icon: <Truck size={22} className="pf-mob-icon-tracking" />,
      iconBg: "pf-mob-icon-bg-tracking",
      label: "Tracking",
      sub: "View real time delivery status",
      action: () => router.push("/track-order"),
    },
    {
      icon: <MapPin size={22} className="pf-mob-icon-address" />,
      iconBg: "pf-mob-icon-bg-address",
      label: "Saved Addresses",
      sub: "Edit delivery locations and preferences",
      action: () => setActiveView("addresses"),
    },
    {
      icon: <ShieldCheck size={22} className="pf-mob-icon-security" />,
      iconBg: "pf-mob-icon-bg-security",
      label: "Security Settings",
      sub: "Manage passwords, 2FA, and sessions",
      action: () => setActiveView("security"),
    },
    {
      icon: <CreditCard size={22} className="pf-mob-icon-payment" />,
      iconBg: "pf-mob-icon-bg-payment",
      label: "Payment Methods",
      sub: "Manage cards and billing info",
      action: () => setActiveView("payments"),
    },
    {
      icon: <HelpCircle size={22} className="pf-mob-icon-help" />,
      iconBg: "pf-mob-icon-bg-help",
      label: "Help Center",
      sub: "Contact support and FAQs",
      action: () => router.push("/faq"),
    },
  ];

  return (
    <div className="pf-page">

      {/* ═══════════════ MOBILE LAYOUT ═══════════════ */}
      <div className="pf-mobile-layout">
        {/* Show mobile account menu when on "dashboard" view */}
        {activeView === "dashboard" && (
          <>
            {/* User Header card */}
            <div className="pf-mob-user-card">
              <div className="pf-mob-avatar-wrap">
                <div className="pf-mob-avatar">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} />
                    : <span>{user.name.charAt(0).toUpperCase()}</span>
                  }
                </div>
                <button type="button" className="pf-mob-edit-badge" aria-label="Edit profile">
                  <Edit3 size={12} />
                </button>
              </div>
              <div>
                <div className="pf-mob-user-name">Welcome, User</div>
                <div className="pf-mob-prime-badge">
                  <Star size={11} className="pf-mob-prime-star" />
                  Al-Umaima Prime Member
                </div>
              </div>
            </div>

            {/* Menu list */}
            <div className="pf-mob-menu-list">
              {mobileMenuItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="pf-mob-menu-item"
                  onClick={item.action}
                >
                  <div className={`pf-mob-icon-wrap ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <div className="pf-mob-menu-text">
                    <div className="pf-mob-menu-label">{item.label}</div>
                    <div className="pf-mob-menu-sub">{item.sub}</div>
                  </div>
                  <ChevronRight size={18} className="pf-mob-chevron" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Sub-views on mobile */}
        {activeView !== "dashboard" && (
          <div className="pf-mob-subview">
            <button
              type="button"
              className="pf-mob-back-btn"
              onClick={() => setActiveView("dashboard")}
            >
              ← Back
            </button>

            {/* Orders sub-view */}
            {activeView === "orders" && (
              <div>
                <h1 className="pf-mob-subview-title">Your Orders</h1>
                {orders.length === 0 ? (
                  <div className="pf-empty-state">
                    <PackageCheck size={40} className="pf-empty-icon" />
                    <div className="pf-empty-title">No orders yet</div>
                    <Link href="/products" className="pf-cta-btn">Browse Products</Link>
                  </div>
                ) : (
                  <div className="pf-orders-mini-list">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="pf-order-mini-card">
                        <div className="pf-order-mini-meta">
                          <span className="pf-order-mini-id">#{order.id}</span>
                          <span className="pf-order-mini-date">{order.date}</span>
                          <strong>${order.totalAmount.toFixed(2)}</strong>
                        </div>
                        <div className="pf-order-mini-status">
                          {order.status === "Delivered" && <span className="pf-status-badge pf-status-delivered"><Check size={12} />Delivered</span>}
                          {order.status === "In Transit" && <span className="pf-status-badge pf-status-transit">In Transit</span>}
                          {order.status === "Cancelled" && <span className="pf-status-badge pf-status-cancelled">Cancelled</span>}
                        </div>
                      </div>
                    ))}
                    <Link href="/orders" className="pf-cta-btn pf-cta-outline" style={{ textAlign: "center" }}>View All Orders →</Link>
                  </div>
                )}
              </div>
            )}

            {/* Addresses sub-view */}
            {activeView === "addresses" && (
              <div>
                <h1 className="pf-mob-subview-title">Saved Addresses</h1>
                <button type="button" className="pf-add-addr-trigger" onClick={() => setIsAddingAddress(!isAddingAddress)}>
                  <Plus size={16} />
                  {isAddingAddress ? "Cancel" : "Add a new address"}
                </button>

                {isAddingAddress && (
                  <form onSubmit={handleAddAddressSubmit} className="pf-addr-form">
                    <div className="pf-field"><label>Full Name *</label><input type="text" required value={newAddrName} onChange={(e) => setNewAddrName(e.target.value)} /></div>
                    <div className="pf-field"><label>Phone</label><input type="tel" value={newAddrPhone} onChange={(e) => setNewAddrPhone(e.target.value)} /></div>
                    <div className="pf-field full-width"><label>Street Address *</label><input type="text" required value={newAddrStreet} onChange={(e) => setNewAddrStreet(e.target.value)} /></div>
                    <div className="pf-form-row">
                      <div className="pf-field"><label>City</label><input type="text" value={newAddrCity} onChange={(e) => setNewAddrCity(e.target.value)} /></div>
                      <div className="pf-field"><label>State</label><input type="text" value={newAddrState} onChange={(e) => setNewAddrState(e.target.value)} /></div>
                    </div>
                    <div className="pf-form-actions">
                      <button type="submit" className="pf-cta-btn">Save Address</button>
                    </div>
                  </form>
                )}

                <div className="pf-addr-list">
                  {addresses.length === 0 && (
                    <div className="pf-empty-state">
                      <MapPin size={40} className="pf-empty-icon" />
                      <div className="pf-empty-title">No saved addresses</div>
                    </div>
                  )}
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`pf-addr-card ${addr.isDefault ? "pf-addr-default" : ""}`}>
                      <div className="pf-addr-card-top">
                        <div className="pf-addr-tags">
                          <span className="pf-addr-type-tag">{addr.addressType}</span>
                          {addr.isDefault && <span className="pf-default-tag">Default</span>}
                        </div>
                        <div className="pf-addr-card-actions">
                          {!addr.isDefault && <button type="button" className="pf-addr-action-btn" onClick={() => setDefaultAddress(addr.id)}>Set Default</button>}
                          <button type="button" className="pf-addr-action-btn pf-danger" onClick={() => deleteAddress(addr.id)}><Trash2 size={14} /> Remove</button>
                        </div>
                      </div>
                      <div className="pf-addr-name">{addr.recipient}</div>
                      <div className="pf-addr-body">{addr.street}, {addr.city}, {addr.state} {addr.pincode}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security sub-view */}
            {activeView === "security" && (
              <div>
                <h1 className="pf-mob-subview-title">Account Settings</h1>

                {saveSuccessMsg && (
                  <div className="pf-success-banner"><Check size={16} /> {saveSuccessMsg}</div>
                )}

                {/* Personal Information Card */}
                <div className="pf-settings-card">
                  <div className="pf-settings-card-header">
                    <h2 className="pf-settings-card-title">Personal Information</h2>
                    <p className="pf-settings-card-sub">Manage your basic profile details.</p>
                  </div>
                  <form onSubmit={handleSaveProfile} className="pf-personal-info-form">
                    <div className="pf-personal-info-grid">
                      <div className="pf-field">
                        <label className="pf-field-label">Full Name</label>
                        <input type="text" className="pf-field-input" value={`${firstName} ${lastName}`.trim()} onChange={(e) => { const p = e.target.value.split(" "); setFirstName(p[0] || ""); setLastName(p.slice(1).join(" ")); }} placeholder="John Doe" />
                      </div>
                      <div className="pf-field">
                        <label className="pf-field-label">Email Address</label>
                        <input type="email" className="pf-field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="pf-field">
                        <label className="pf-field-label">Phone Number</label>
                        <input type="tel" className="pf-field-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </div>
                    <div className="pf-personal-save-row">
                      <button type="submit" className="pf-save-changes-btn">Save Changes</button>
                    </div>
                  </form>
                </div>

                {/* Login & Security Card */}
                <div className="pf-settings-card" style={{ marginTop: "1rem" }}>
                  <div className="pf-settings-card-header">
                    <h2 className="pf-settings-card-title">Login &amp; Security</h2>
                    <p className="pf-settings-card-sub">Update your password and secure your account.</p>
                  </div>
                  <div className="pf-security-rows">
                    <div className="pf-security-row">
                      <div className="pf-security-row-info">
                        <div className="pf-security-row-label">Password</div>
                        <div className="pf-security-row-meta">Last changed 3 months ago.</div>
                      </div>
                      <button type="button" className="pf-edit-btn">Edit</button>
                    </div>
                    <div className="pf-security-row pf-security-row-last">
                      <div className="pf-security-row-info">
                        <div className="pf-security-row-label">Two-Factor Authentication (2FA)</div>
                        <div className="pf-security-row-meta">Add an extra layer of security.</div>
                      </div>
                      <button type="button" className="pf-toggle-switch pf-toggle-on" aria-label="2FA enabled">
                        <span className="pf-toggle-thumb" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payments sub-view */}
            {activeView === "payments" && (
              <div>
                <h1 className="pf-mob-subview-title">Payment Methods</h1>
                <div className="pf-payments-empty">
                  <CreditCard size={40} className="pf-empty-icon" />
                  <div className="pf-empty-title">No saved payment methods</div>
                  <div className="pf-empty-sub">Cards used during checkout will appear here.</div>
                  <Link href="/checkout" className="pf-cta-btn">Go to Checkout</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════ DESKTOP LAYOUT ═══════════════ */}
      <div className="pf-layout pf-desktop-layout">
        {/* LEFT SIDEBAR */}
        <aside className="pf-sidebar">
          <div className="pf-sidebar-user">
            <div className="pf-avatar">
              {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user.name.charAt(0).toUpperCase()}</span>}
            </div>
            <div className="pf-sidebar-user-info">
              <div className="pf-sidebar-welcome">Welcome, User</div>
              <div className="pf-sidebar-prime">
                <Star size={12} className="pf-prime-star" />
                Al-Umaima Prime Member
              </div>
            </div>
          </div>

          <nav className="pf-sidebar-nav">
            {sidebarLinks.map((link) => (
              <button key={link.id} type="button" className={`pf-nav-item ${activeView === link.id ? "pf-nav-active" : ""}`} onClick={() => setActiveView(link.id)}>
                <span className="pf-nav-icon">{link.icon}</span>
                <span className="pf-nav-label">{link.label}</span>
              </button>
            ))}
            {isAdmin && (
              <Link href="/admin" className="pf-nav-item pf-nav-admin">
                <span className="pf-nav-icon"><Shield size={18} /></span>
                <span className="pf-nav-label">Admin Panel</span>
              </Link>
            )}
            <div className="pf-sidebar-divider" />
            <button type="button" className="pf-nav-item pf-nav-clearfilters" onClick={() => {}}>Clear All Filters</button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="pf-main">

          {/* DASHBOARD */}
          {activeView === "dashboard" && (
            <div className="pf-view">
              <div className="pf-dashboard-hero">
                <div>
                  <h1 className="pf-dashboard-title">Dashboard</h1>
                  <p className="pf-dashboard-sub">Manage your account settings, track orders, and discover new deals.</p>
                </div>
                <div className="pf-prime-badge">
                  <Crown size={13} className="pf-prime-crown" />
                  <span className="pf-prime-badge-label">PRIME ACTIVE</span>
                  <span className="pf-prime-since">Member since 2021</span>
                </div>
              </div>

              <div className="pf-dashboard-grid">
                <button type="button" className="pf-dash-card" onClick={() => setActiveView("orders")}>
                  <div className="pf-dash-card-top"><div className="pf-dash-icon pf-icon-orders"><PackageCheck size={22} /></div><ArrowRight size={16} className="pf-dash-arrow" /></div>
                  <div className="pf-dash-card-title">Your Orders</div>
                  <div className="pf-dash-card-sub">Track, return, or buy things again</div>
                </button>
                <button type="button" className="pf-dash-card" onClick={() => setActiveView("security")}>
                  <div className="pf-dash-card-top"><div className="pf-dash-icon pf-icon-security"><ShieldCheck size={22} /></div><ArrowRight size={16} className="pf-dash-arrow" /></div>
                  <div className="pf-dash-card-title">Login &amp; Security</div>
                  <div className="pf-dash-card-sub">Edit login, name, and mobile number</div>
                </button>
                <button type="button" className="pf-dash-card">
                  <div className="pf-dash-card-top"><div className="pf-dash-icon pf-icon-prime"><Crown size={22} /></div><ArrowRight size={16} className="pf-dash-arrow" /></div>
                  <div className="pf-dash-card-title">Prime</div>
                  <div className="pf-dash-card-sub">View benefits and payment settings</div>
                </button>
                <button type="button" className="pf-dash-card" onClick={() => setActiveView("addresses")}>
                  <div className="pf-dash-card-top"><div className="pf-dash-icon pf-icon-address"><MapPin size={22} /></div><ArrowRight size={16} className="pf-dash-arrow" /></div>
                  <div className="pf-dash-card-title">Saved Addresses</div>
                  <div className="pf-dash-card-sub">Edit addresses for orders and gifts</div>
                  {defaultAddr ? (
                    <div className="pf-dash-default-addr">Default: {defaultAddr.street}, {defaultAddr.city}, {defaultAddr.state} {defaultAddr.pincode}</div>
                  ) : (
                    <div className="pf-dash-default-addr">Default: 123 Retail Ave, Suite 400, NY 10001</div>
                  )}
                </button>
                <button type="button" className="pf-dash-card" onClick={() => setActiveView("payments")}>
                  <div className="pf-dash-card-top"><div className="pf-dash-icon pf-icon-payment"><CreditCard size={22} /></div><ArrowRight size={16} className="pf-dash-arrow" /></div>
                  <div className="pf-dash-card-title">Payment Options</div>
                  <div className="pf-dash-card-sub">Edit or add payment methods</div>
                </button>
              </div>

              {/* Recent Orders Table */}
              <div className="pf-recent-orders-card">
                <div className="pf-recent-orders-header">
                  <h2 className="pf-recent-orders-title">Recent Orders</h2>
                  <button type="button" className="pf-view-all-btn" onClick={() => setActiveView("orders")}>View All <ArrowRight size={14} /></button>
                </div>
                <table className="pf-orders-table">
                  <thead>
                    <tr className="pf-table-head-row">
                      <th>Order ID</th><th>Date</th><th>Total</th><th>Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <>
                        <tr className="pf-table-row"><td className="pf-order-id">#AU-9876543</td><td>Oct 24, 2023</td><td className="pf-order-total">$129.99</td><td><span className="pf-status-badge pf-status-delivered"><Check size={12} />Delivered</span></td><td><button type="button" className="pf-view-details-btn">View Details</button></td></tr>
                        <tr className="pf-table-row"><td className="pf-order-id">#AU-9876544</td><td>Oct 20, 2023</td><td className="pf-order-total">$45.50</td><td><span className="pf-status-badge pf-status-transit">In Transit</span></td><td><button type="button" className="pf-view-details-btn">View Details</button></td></tr>
                        <tr className="pf-table-row"><td className="pf-order-id">#AU-9876545</td><td>Oct 15, 2023</td><td className="pf-order-total">$899.00</td><td><span className="pf-status-badge pf-status-delivered"><Check size={12} />Delivered</span></td><td><button type="button" className="pf-view-details-btn">View Details</button></td></tr>
                      </>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="pf-table-row">
                          <td className="pf-order-id">#{order.id}</td>
                          <td>{order.date}</td>
                          <td className="pf-order-total">${order.totalAmount.toFixed(2)}</td>
                          <td>
                            {order.status === "Delivered" && <span className="pf-status-badge pf-status-delivered"><Check size={12} />Delivered</span>}
                            {order.status === "In Transit" && <span className="pf-status-badge pf-status-transit">In Transit</span>}
                            {order.status === "Processing" && <span className="pf-status-badge pf-status-processing">Processing</span>}
                            {order.status === "Cancelled" && <span className="pf-status-badge pf-status-cancelled">Cancelled</span>}
                          </td>
                          <td><Link href={`/track-order?id=${order.id}`} className="pf-view-details-btn">View Details</Link></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeView === "orders" && (
            <div className="pf-view">
              <Link href="/orders" className="pf-orders-page-link">
                <h1 className="pf-section-heading">Your Orders</h1>
              </Link>
              <p className="pf-section-sub"><Link href="/orders" className="pf-link">Go to full orders page →</Link></p>
              {orders.length === 0 ? (
                <div className="pf-empty-state"><PackageCheck size={48} className="pf-empty-icon" /><div className="pf-empty-title">No orders yet</div><Link href="/products" className="pf-cta-btn">Browse Products</Link></div>
              ) : (
                <div className="pf-orders-mini-list">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="pf-order-mini-card">
                      <div className="pf-order-mini-meta"><span className="pf-order-mini-id">#{order.id}</span><span className="pf-order-mini-date">{order.date}</span><strong>${order.totalAmount.toFixed(2)}</strong></div>
                      <div className="pf-order-mini-status">
                        {order.status === "Delivered" && <span className="pf-status-badge pf-status-delivered"><Check size={12} />Delivered</span>}
                        {order.status === "In Transit" && <span className="pf-status-badge pf-status-transit">In Transit</span>}
                      </div>
                    </div>
                  ))}
                  <Link href="/orders" className="pf-cta-btn pf-cta-outline">View All Orders →</Link>
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES */}
          {activeView === "addresses" && (
            <div className="pf-view">
              <h1 className="pf-section-heading">Saved Addresses</h1>
              <button type="button" className="pf-add-addr-trigger" onClick={() => setIsAddingAddress(!isAddingAddress)}>
                <Plus size={16} />{isAddingAddress ? "Cancel" : "Add a new address"}
              </button>
              {isAddingAddress && (
                <form onSubmit={handleAddAddressSubmit} className="pf-addr-form">
                  <div className="pf-form-row">
                    <div className="pf-field"><label>Full Name *</label><input type="text" required value={newAddrName} onChange={(e) => setNewAddrName(e.target.value)} /></div>
                    <div className="pf-field"><label>Phone</label><input type="tel" value={newAddrPhone} onChange={(e) => setNewAddrPhone(e.target.value)} /></div>
                  </div>
                  <div className="pf-field full-width"><label>Street Address *</label><input type="text" required value={newAddrStreet} onChange={(e) => setNewAddrStreet(e.target.value)} /></div>
                  <div className="pf-form-row">
                    <div className="pf-field"><label>City</label><input type="text" value={newAddrCity} onChange={(e) => setNewAddrCity(e.target.value)} /></div>
                    <div className="pf-field"><label>State</label><input type="text" value={newAddrState} onChange={(e) => setNewAddrState(e.target.value)} /></div>
                    <div className="pf-field"><label>ZIP</label><input type="text" value={newAddrZip} onChange={(e) => setNewAddrZip(e.target.value)} /></div>
                  </div>
                  <div className="pf-form-actions"><button type="submit" className="pf-cta-btn">Save Address</button><button type="button" className="pf-text-btn" onClick={() => setIsAddingAddress(false)}>Cancel</button></div>
                </form>
              )}
              <div className="pf-addr-list">
                {addresses.length === 0 && <div className="pf-empty-state"><MapPin size={40} className="pf-empty-icon" /><div className="pf-empty-title">No saved addresses</div></div>}
                {addresses.map((addr) => (
                  <div key={addr.id} className={`pf-addr-card ${addr.isDefault ? "pf-addr-default" : ""}`}>
                    <div className="pf-addr-card-top">
                      <div className="pf-addr-tags"><span className="pf-addr-type-tag">{addr.addressType}</span>{addr.isDefault && <span className="pf-default-tag">Default</span>}</div>
                      <div className="pf-addr-card-actions">
                        {!addr.isDefault && <button type="button" className="pf-addr-action-btn" onClick={() => setDefaultAddress(addr.id)}>Set Default</button>}
                        <button type="button" className="pf-addr-action-btn pf-danger" onClick={() => deleteAddress(addr.id)}><Trash2 size={14} /> Remove</button>
                      </div>
                    </div>
                    <div className="pf-addr-name">{addr.recipient}</div>
                    <div className="pf-addr-body">{addr.street}, {addr.city}, {addr.state} {addr.pincode}</div>
                    {addr.phone && <div className="pf-addr-phone">Phone: {addr.phone}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeView === "security" && (
            <div className="pf-view">
              <h1 className="pf-section-heading">Account Settings</h1>
              {saveSuccessMsg && <div className="pf-success-banner"><Check size={16} /> {saveSuccessMsg}</div>}

              <div className="pf-settings-card">
                <div className="pf-settings-card-header">
                  <h2 className="pf-settings-card-title">Personal Information</h2>
                  <p className="pf-settings-card-sub">Manage your basic profile details.</p>
                </div>
                <form onSubmit={handleSaveProfile} className="pf-personal-info-form">
                  <div className="pf-personal-info-grid">
                    <div className="pf-field"><label className="pf-field-label">Full Name</label><input type="text" className="pf-field-input" value={`${firstName} ${lastName}`.trim()} onChange={(e) => { const p = e.target.value.split(" "); setFirstName(p[0] || ""); setLastName(p.slice(1).join(" ")); }} placeholder="John Doe" /></div>
                    <div className="pf-field"><label className="pf-field-label">Email Address</label><input type="email" className="pf-field-input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                    <div className="pf-field"><label className="pf-field-label">Phone Number</label><input type="tel" className="pf-field-input" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                  </div>
                  <div className="pf-personal-save-row"><button type="submit" className="pf-save-changes-btn">Save Changes</button></div>
                </form>
              </div>

              <div className="pf-settings-card" style={{ marginTop: "1rem" }}>
                <div className="pf-settings-card-header">
                  <h2 className="pf-settings-card-title">Login &amp; Security</h2>
                  <p className="pf-settings-card-sub">Update your password and secure your account.</p>
                </div>
                <div className="pf-security-rows">
                  <div className="pf-security-row"><div className="pf-security-row-info"><div className="pf-security-row-label">Password</div><div className="pf-security-row-meta">Last changed 3 months ago.</div></div><button type="button" className="pf-edit-btn">Edit</button></div>
                  <div className="pf-security-row pf-security-row-last"><div className="pf-security-row-info"><div className="pf-security-row-label">Two-Factor Authentication (2FA)</div><div className="pf-security-row-meta">Add an extra layer of security to your account.</div></div><button type="button" className="pf-toggle-switch pf-toggle-on" aria-label="2FA enabled"><span className="pf-toggle-thumb" /></button></div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {activeView === "payments" && (
            <div className="pf-view">
              <h1 className="pf-section-heading">Payment Methods</h1>
              <div className="pf-payments-empty">
                <CreditCard size={40} className="pf-empty-icon" />
                <div className="pf-empty-title">No saved payment methods</div>
                <div className="pf-empty-sub">Cards used during checkout will appear here for quick reuse.</div>
                <Link href="/checkout" className="pf-cta-btn">Go to Checkout</Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
