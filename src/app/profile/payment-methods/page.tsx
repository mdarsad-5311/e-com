"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ShieldCheck, 
  MoreVertical, 
  PlusCircle, 
  Building2, 
  X,
  CreditCard,
  Trash2,
  Check
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import "@/styles/payment-methods.css";

interface SavedCard {
  id: string;
  type: "visa" | "mastercard";
  name: string;
  expiry: string;
}

interface SavedUPI {
  id: string;
  vpa: string;
  isPrimary: boolean;
}

export default function PaymentMethodsPage() {
  const router = useRouter();

  // Cards exactly from Attachment 3
  const [cards, setCards] = useState<SavedCard[]>([
    {
      id: "card-1",
      type: "visa",
      name: "Visa ending in 4242",
      expiry: "Expires 12/25",
    },
    {
      id: "card-2",
      type: "mastercard",
      name: "Mastercard ending in 8891",
      expiry: "Expires 08/26",
    },
  ]);

  // UPI exactly from Attachment 3
  const [upis, setUpis] = useState<SavedUPI[]>([
    {
      id: "upi-1",
      vpa: "user@upi",
      isPrimary: true,
    },
  ]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"card" | "upi">("card");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [upiId, setUpiId] = useState("");

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDeleteUPI = (id: string) => {
    setUpis((prev) => prev.filter((u) => u.id !== id));
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalTab === "card" && cardNum) {
      const last4 = cardNum.slice(-4) || "1234";
      const isMaster = cardNum.startsWith("5");
      setCards((prev) => [
        ...prev,
        {
          id: `card-${Date.now()}`,
          type: isMaster ? "mastercard" : "visa",
          name: `${isMaster ? "Mastercard" : "Visa"} ending in ${last4}`,
          expiry: cardExp ? `Expires ${cardExp}` : "Expires 12/28",
        },
      ]);
      setCardNum("");
      setCardExp("");
    } else if (modalTab === "upi" && upiId) {
      setUpis((prev) => [
        ...prev,
        {
          id: `upi-${Date.now()}`,
          vpa: upiId.trim(),
          isPrimary: upis.length === 0,
        },
      ]);
      setUpiId("");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="al-payment-methods-page">
      {/* Top Bar with Back Arrow */}
      <header className="al-pay-header">
        <button
          type="button"
          onClick={() => router.back()}
          className="al-pay-back-btn"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="al-pay-title">Payment Methods</h1>
      </header>

      {/* Main Content */}
      <main className="al-pay-content">
        {/* 1. Security Banner */}
        <div className="al-pay-security-banner">
          <ShieldCheck size={18} className="al-pay-security-icon" />
          <span>Secure &amp; Encrypted 256-bit</span>
        </div>

        {/* 2. Saved Cards */}
        <section className="al-pay-section">
          <h2 className="al-pay-section-heading">Saved Cards</h2>

          {cards.map((c) => (
            <div key={c.id} className="al-pay-card">
              {/* Card Chip Box */}
              <div className={`al-pay-card-logo-box ${c.type}`}>
                {c.type === "visa" ? "VISA" : "MC"}
              </div>

              {/* Info */}
              <div className="al-pay-card-info">
                <span className="al-pay-card-name">{c.name}</span>
                <span className="al-pay-card-sub">{c.expiry}</span>
              </div>

              {/* Menu / Delete */}
              <button
                type="button"
                onClick={() => handleDeleteCard(c.id)}
                className="al-pay-card-menu-btn"
                aria-label="Card options"
                title="Remove Card"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          ))}
        </section>

        {/* 3. UPI IDs */}
        <section className="al-pay-section">
          <h2 className="al-pay-section-heading">UPI IDs</h2>

          {upis.map((u) => (
            <div key={u.id} className="al-pay-card">
              {/* UPI Bank Icon Box */}
              <div className="al-pay-card-logo-box upi">
                <Building2 size={20} />
              </div>

              {/* Info */}
              <div className="al-pay-card-info">
                <span className="al-pay-card-name">{u.vpa}</span>
                <span className="al-pay-card-sub">
                  {u.isPrimary ? "Primary" : "Secondary"}
                </span>
              </div>

              {/* Menu / Delete */}
              <button
                type="button"
                onClick={() => handleDeleteUPI(u.id)}
                className="al-pay-card-menu-btn"
                aria-label="UPI options"
                title="Remove UPI ID"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          ))}
        </section>

        {/* 4. Add New Payment Method Dashed Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="al-btn-add-payment-dashed"
        >
          <PlusCircle size={20} className="al-pay-plus-icon-orange" />
          <span>Add New Payment Method</span>
        </button>
      </main>

      {/* Add Payment Modal */}
      {isModalOpen && (
        <div className="al-pay-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="al-pay-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0C2340" }}>
                Add Payment Method
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab switch */}
            <div className="al-pay-tab-toggle">
              <button
                type="button"
                className={`al-pay-tab-btn ${modalTab === "card" ? "active" : ""}`}
                onClick={() => setModalTab("card")}
              >
                <CreditCard size={15} style={{ display: "inline", marginRight: 4 }} />
                Credit / Debit Card
              </button>
              <button
                type="button"
                className={`al-pay-tab-btn ${modalTab === "upi" ? "active" : ""}`}
                onClick={() => setModalTab("upi")}
              >
                <Building2 size={15} style={{ display: "inline", marginRight: 4 }} />
                UPI ID
              </button>
            </div>

            <form onSubmit={handleAddPayment} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {modalTab === "card" ? (
                <>
                  <input
                    type="text"
                    placeholder="Card Number (e.g. 4242 4242 4242 4242)"
                    value={cardNum}
                    onChange={(e) => setCardNum(e.target.value)}
                    required
                    style={{
                      height: 42,
                      padding: "0 0.85rem",
                      borderRadius: 6,
                      border: "1.5px solid #cbd5e1",
                      fontSize: "0.88rem",
                      outline: "none",
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      required
                      style={{
                        flex: 1,
                        height: 42,
                        padding: "0 0.85rem",
                        borderRadius: 6,
                        border: "1.5px solid #cbd5e1",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={4}
                      required
                      style={{
                        flex: 1,
                        height: 42,
                        padding: "0 0.85rem",
                        borderRadius: 6,
                        border: "1.5px solid #cbd5e1",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </>
              ) : (
                <input
                  type="text"
                  placeholder="UPI ID (e.g. username@okhdfcbank)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                  style={{
                    height: 42,
                    padding: "0 0.85rem",
                    borderRadius: 6,
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.88rem",
                    outline: "none",
                  }}
                />
              )}

              <button
                type="submit"
                style={{
                  height: 44,
                  backgroundColor: "#FF7A00",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
              >
                Save Payment Method
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
