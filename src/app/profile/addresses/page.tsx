"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Search, 
  Home, 
  Briefcase, 
  MapPin, 
  Phone, 
  Plus, 
  X,
  Check
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import "@/styles/saved-addresses.css";

interface SavedAddress {
  id: string;
  type: "Home" | "Office" | "Parents' House" | "Other";
  isDefault: boolean;
  addressLines: string[];
  phone?: string;
}

export default function SavedAddressesPage() {
  const router = useRouter();

  // Initial list exactly from Attachment 2
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "addr-home",
      type: "Home",
      isDefault: true,
      addressLines: [
        "1234 Palm Grove Avenue",
        "Apartment 4B",
        "Dubai Marina, Dubai",
        "UAE"
      ],
      phone: "+971 50 123 4567"
    },
    {
      id: "addr-office",
      type: "Office",
      isDefault: false,
      addressLines: [
        "Tech Hub Tower, Floor 12",
        "Desk 45",
        "Internet City, Dubai",
        "UAE"
      ],
      phone: "+971 50 987 6543"
    },
    {
      id: "addr-parents",
      type: "Parents' House",
      isDefault: false,
      addressLines: [
        "Villa 88, Desert Bloom St",
        "Jumeirah 3, Dubai",
        "UAE"
      ],
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "Home" as SavedAddress["type"],
    customType: "",
    addressText: "",
    phone: "",
    isDefault: false,
  });

  const getIcon = (type: SavedAddress["type"]) => {
    switch (type) {
      case "Home":
        return <Home size={18} />;
      case "Office":
        return <Briefcase size={18} />;
      case "Parents' House":
      default:
        return <MapPin size={18} />;
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      type: "Home",
      customType: "",
      addressText: "",
      phone: "",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setFormData({
      type: addr.type,
      customType: addr.type === "Other" ? "" : addr.type,
      addressText: addr.addressLines.join(", "),
      phone: addr.phone || "",
      isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.addressText.trim()) return;

    const lines = formData.addressText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const resolvedLines = lines.length > 0 ? lines : [formData.addressText.trim()];
    const resolvedType = formData.type === "Other" && formData.customType ? formData.customType as SavedAddress["type"] : formData.type;

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingId) {
            return {
              ...a,
              type: resolvedType,
              addressLines: resolvedLines,
              phone: formData.phone.trim() || undefined,
              isDefault: formData.isDefault,
            };
          }
          if (formData.isDefault) {
            return { ...a, isDefault: false };
          }
          return a;
        })
      );
    } else {
      const newAddress: SavedAddress = {
        id: `addr-${Date.now()}`,
        type: resolvedType,
        isDefault: formData.isDefault || addresses.length === 0,
        addressLines: resolvedLines,
        phone: formData.phone.trim() || undefined,
      };

      setAddresses((prev) => {
        if (newAddress.isDefault) {
          return [newAddress, ...prev.map((a) => ({ ...a, isDefault: false }))];
        }
        return [...prev, newAddress];
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="al-saved-addresses-page">
      {/* Top Bar */}
      <header className="al-addresses-top-bar">
        <button
          type="button"
          onClick={() => router.back()}
          className="al-addresses-back-btn"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>
        <span className="al-addresses-header-title">Al-Umaima</span>
        <Link href="/search" className="al-addresses-search-link" aria-label="Search">
          <Search size={20} />
        </Link>
      </header>

      {/* Main Content */}
      <main className="al-addresses-content">
        <h1 className="al-addresses-heading">Saved Addresses</h1>

        {/* Address Cards List */}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`al-address-card ${addr.isDefault ? "default" : ""}`}
          >
            {/* Top Row: Icon + Type + Default Tag */}
            <div className="al-addr-top-row">
              <div className="al-addr-icon-box">{getIcon(addr.type)}</div>
              <div className="al-addr-type-title">
                <span>{addr.type}</span>
                {addr.isDefault && (
                  <span className="al-addr-default-pill">DEFAULT</span>
                )}
              </div>
            </div>

            {/* Address Lines */}
            <div className="al-addr-body-text">
              {addr.addressLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>

            {/* Phone */}
            {addr.phone && (
              <div className="al-addr-phone-row">
                <Phone size={14} />
                <span>{addr.phone}</span>
              </div>
            )}

            {/* Actions: Delete + Edit */}
            <div className="al-addr-actions-row">
              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  className="al-addr-btn-delete"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={() => handleOpenEdit(addr)}
                className="al-addr-btn-edit"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Floating Add Button */}
      <div className="al-addresses-bottom-bar">
        <button
          type="button"
          onClick={handleOpenAdd}
          className="al-btn-add-address"
        >
          <Plus size={18} />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="al-addr-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="al-addr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="al-addr-modal-header">
              <h2 className="al-addr-modal-title">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="al-addr-modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="al-addr-modal-form">
              {/* Type selector */}
              <div className="al-addr-type-selector">
                {(["Home", "Office", "Parents' House", "Other"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`al-addr-type-btn ${formData.type === t ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, type: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Address details */}
              <textarea
                value={formData.addressText}
                onChange={(e) => setFormData({ ...formData, addressText: e.target.value })}
                placeholder="Full address (Street, Building/Villa, City, Country)"
                className="al-addr-textarea"
                required
              />

              {/* Phone */}
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone Number (e.g. +971 50 123 4567)"
                className="al-addr-input-field"
              />

              {/* Default checkbox */}
              <label className="al-addr-checkbox-row">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                />
                <span>Set as default delivery address</span>
              </label>

              <button type="submit" className="al-addr-btn-save">
                {editingId ? "Update Address" : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
