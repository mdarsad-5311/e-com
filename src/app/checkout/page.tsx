"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Plus,
  Shield,
  CreditCard,
  Gift,
  X,
  ArrowLeft,
  Pencil,
  MapPin,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import "@/styles/checkout.css";

interface SavedCard {
  id: string;
  bankName: string;
  last4: string;
  holderName: string;
}

interface Address {
  id: string;
  name: string;
  address1: string;
  city: string;
  country: string;
  phone: string;
  isDefault?: boolean;
  tags?: string[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  // Step State: 1 = Address, 2 = Payment
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");

  // --- Address State ---
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr-1",
      name: "Ahmed Hassan",
      address1: "Building 42, Apt 3B, Street 15",
      city: "Al Maadi, Cairo Governorate 11431",
      country: "Egypt",
      phone: "Phone: +20 100 123 4567",
      isDefault: true,
      tags: ["Default", "Home"],
    },
    {
      id: "addr-2",
      name: "Ahmed Hassan",
      address1: "Smart Village, Building B14",
      city: "Km 28 Cairo-Alexandria Desert Road\nGiza Governorate 12627",
      country: "Egypt",
      phone: "Phone: +20 100 123 4567",
      tags: ["Office"],
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState("addr-1");

  // Add New Address modal
  const [isAddAddrOpen, setIsAddAddrOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // --- Payment State ---
  const [paymentOption, setPaymentOption] = useState<"card" | "upi" | "netbanking" | "cod">("card");
  const [selectedCardId, setSelectedCardId] = useState("card-1");
  const [cvvInput, setCvvInput] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    { id: "card-1", bankName: "State Bank of India", last4: "3456", holderName: "Ahmed Hassan" },
    { id: "card-2", bankName: "HDFC Bank", last4: "8901", holderName: "Ahmed Hassan" },
  ]);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardBank, setNewCardBank] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("Ahmed Hassan");

  // Pricing
  const defaultItemsPrice = 1249.97;
  const itemsPrice = subtotal > 0 ? subtotal : defaultItemsPrice;
  const itemCount = cart.length > 0 ? cart.reduce((s, i) => s + i.quantity, 0) : 3;
  const deliveryFee = 15.0;
  const deliveryDiscount = -15.0;
  const totalBeforeTax = itemsPrice + deliveryFee + deliveryDiscount;
  const estimatedTax = subtotal > 0 ? itemsPrice * 0.09 : 112.5;
  const orderTotal = totalBeforeTax + estimatedTax;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newStreet.trim()) return;
    const id = `addr-${Date.now()}`;
    setAddresses([
      ...addresses,
      {
        id,
        name: newName,
        address1: newStreet,
        city: newCity,
        country: "Egypt",
        phone: newPhone ? `Phone: ${newPhone}` : "Phone: +20 100 123 4567",
        tags: [],
      },
    ]);
    setSelectedAddressId(id);
    setIsAddAddrOpen(false);
    setNewName(""); setNewStreet(""); setNewCity(""); setNewPhone("");
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardBank.trim() || !newCardNumber.trim()) return;
    const last4 = newCardNumber.replace(/\D/g, "").slice(-4) || "0000";
    const card: SavedCard = { id: `card-${Date.now()}`, bankName: newCardBank, last4, holderName: newCardHolder };
    setSavedCards([...savedCards, card]);
    setSelectedCardId(card.id);
    setIsAddCardOpen(false);
    setNewCardBank(""); setNewCardNumber("");
  };

  const handlePlaceOrder = () => {
    const id = `ALU-${Date.now().toString().slice(-8)}`;
    setOrderId(id);
    try {
      localStorage.setItem("al_umaima_last_order", JSON.stringify({ id, total: orderTotal, status: "CONFIRMED" }));
    } catch {}
    setIsOrderSubmitted(true);
    setTimeout(() => clearCart(), 400);
  };

  // ─── Order Success ─────────────────────────────────────────────────────────
  if (isOrderSubmitted) {
    return (
      <div className="co-page">
        <div className="co-container">
          <div className="success-order-card">
            <div className="success-icon-badge"><Check size={36} /></div>
            <h1 className="success-title">Order Placed Successfully!</h1>
            <p className="success-sub">
              Thank you for shopping with Al-Umaima. Your order <strong>#{orderId}</strong> has been received.
            </p>
            <div className="order-summary-box">
              <div className="summary-line"><span>Order Total:</span> <strong>${orderTotal.toFixed(2)}</strong></div>
              <div className="summary-line"><span>Deliver to:</span> <strong>{selectedAddress.name}, {selectedAddress.address1}</strong></div>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <Link href="/track-order" className="btn-success-action primary">Track Order</Link>
              <Link href="/" className="btn-success-action secondary">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 1: Select Address ────────────────────────────────────────────────
  if (currentStep === 1) {
    return (
      <div className="co-page">
        {/* Back + Title */}
        <div className="co-top-bar">
          <button type="button" className="co-back-btn" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="co-page-title">Select Address</h1>
        </div>

        {/* 3-Step Progress: Login → Address → Payment */}
        <div className="co-stepper">
          <div className="co-step completed">
            <div className="co-step-circle completed-circle">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="co-step-label">Login</span>
          </div>
          <div className="co-connector active-connector" />
          <div className="co-step active">
            <div className="co-step-circle active-circle">2</div>
            <span className="co-step-label active-label">Address</span>
          </div>
          <div className="co-connector" />
          <div className="co-step">
            <div className="co-step-circle">3</div>
            <span className="co-step-label">Payment</span>
          </div>
        </div>

        <div className="co-container">
          {/* Add new address */}
          <button
            type="button"
            className="co-add-addr-btn"
            onClick={() => setIsAddAddrOpen(true)}
          >
            <Plus size={16} className="co-plus-icon" />
            Add a new address
          </button>

          {/* Saved Addresses */}
          <h2 className="co-section-title">Saved Addresses</h2>

          <div className="co-addr-list">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  className={`co-addr-card ${isSelected ? "co-addr-selected" : ""}`}
                  onClick={() => setSelectedAddressId(addr.id)}
                >
                  <div className="co-addr-card-inner">
                    {/* Radio */}
                    <div className={`co-radio ${isSelected ? "co-radio-selected" : ""}`}>
                      {isSelected && <div className="co-radio-dot" />}
                    </div>

                    {/* Content */}
                    <div className="co-addr-content">
                      <div className="co-addr-name-row">
                        <span className="co-addr-name">{addr.name}</span>
                        {addr.tags?.map((tag) => (
                          <span key={tag} className={`co-addr-tag co-tag-${tag.toLowerCase()}`}>{tag}</span>
                        ))}
                      </div>
                      <div className="co-addr-lines">
                        <div>{addr.address1}</div>
                        {addr.city.split("\n").map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                        <div>{addr.country}</div>
                        <div>{addr.phone}</div>
                      </div>

                      {/* Action links only for selected */}
                      {isSelected && (
                        <div className="co-addr-actions">
                          <button type="button" className="co-addr-action-link">
                            <Pencil size={13} className="co-action-icon" />
                            Edit
                          </button>
                          <span className="co-action-divider">|</span>
                          <button type="button" className="co-addr-action-link">
                            Add delivery instructions
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="co-sticky-bottom">
          <button
            type="button"
            className="co-deliver-btn"
            onClick={() => setCurrentStep(2)}
          >
            Deliver to this address
          </button>
        </div>

        {/* Add Address Modal */}
        {isAddAddrOpen && (
          <div className="co-modal-backdrop" onClick={() => setIsAddAddrOpen(false)}>
            <div className="co-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="co-modal-header">
                <h3>Add a new address</h3>
                <button onClick={() => setIsAddAddrOpen(false)} className="co-modal-close"><X size={18} /></button>
              </div>
              <form onSubmit={handleAddAddress} className="co-modal-form">
                <div className="co-field"><label>Full Name</label><input type="text" required placeholder="e.g. Ahmed Hassan" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
                <div className="co-field"><label>Street & Building</label><input type="text" required placeholder="e.g. Building 42, Apt 3B, Street 15" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} /></div>
                <div className="co-field"><label>City & Governorate</label><input type="text" placeholder="e.g. Al Maadi, Cairo 11431" value={newCity} onChange={(e) => setNewCity(e.target.value)} /></div>
                <div className="co-field"><label>Phone</label><input type="text" placeholder="e.g. +20 100 123 4567" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} /></div>
                <div className="co-modal-actions">
                  <button type="button" onClick={() => setIsAddAddrOpen(false)} className="co-btn-cancel">Cancel</button>
                  <button type="submit" className="co-btn-submit">Save Address</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── STEP 2: Payment Method ────────────────────────────────────────────────
  return (
    <div className="al-payment-page-layout">
      <div className="checkout-content-container">
        {/* Breadcrumb: ✔ Delivery > Payment */}
        <div className="checkout-breadcrumb-bar">
          <button type="button" className="breadcrumb-step-btn completed-step" onClick={() => setCurrentStep(1)}>
            <span className="breadcrumb-check-icon"><Check size={13} strokeWidth={3} /></span>
            <span className="breadcrumb-text">Delivery</span>
          </button>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-step-btn current-step">
            <span className="breadcrumb-text">Payment</span>
          </span>
        </div>

        <h1 className="payment-page-main-title">Select a payment method</h1>

        <div className="payment-main-grid">
          {/* Left Column: Payment Options */}
          <div className="payment-left-col">
            <div className="payment-accordion-card">
              {/* Credit / Debit Card */}
              <div className={`payment-method-row ${paymentOption === "card" ? "expanded" : ""}`}>
                <label className="payment-row-header" onClick={() => setPaymentOption("card")}>
                  <div className="custom-radio-circle">{paymentOption === "card" && <div className="radio-inner-dot" />}</div>
                  <span className="payment-method-title">Credit or debit card</span>
                </label>

                {paymentOption === "card" && (
                  <div className="saved-cards-subcontainer">
                    <div className="saved-cards-stack">
                      {savedCards.map((card) => {
                        const isSel = selectedCardId === card.id;
                        return (
                          <div key={card.id} className={`saved-card-box ${isSel ? "selected" : ""}`} onClick={() => setSelectedCardId(card.id)}>
                            <div className="saved-card-left-part">
                              <div className="card-sub-radio">
                                {isSel ? <div className="radio-inner-dot-dark" /> : <div className="radio-unselected-circle" />}
                              </div>
                              <CreditCard size={18} className="card-glyph-icon" />
                              <div className="card-details-text">
                                <div className="card-bank-line"><strong>{card.bankName}</strong> ending in {card.last4}</div>
                                <div className="card-holder-line">{card.holderName}</div>
                              </div>
                            </div>
                            {isSel && (
                              <div className="cvv-input-wrapper" onClick={(e) => e.stopPropagation()}>
                                <input type="password" maxLength={4} placeholder="CVV" value={cvvInput} onChange={(e) => setCvvInput(e.target.value)} className="cvv-small-input" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <button type="button" className="add-card-link-btn" onClick={() => setIsAddCardOpen(true)}>
                      <Plus size={14} className="plus-icon-inline" />
                      <span>Add a new debit or credit card</span>
                    </button>
                    <div className="card-logos-row">
                      <span className="card-pill">VISA</span>
                      <span className="card-pill">MC</span>
                      <span className="card-pill">AMEX</span>
                    </div>
                  </div>
                )}
              </div>

              {/* UPI Apps */}
              <div className={`payment-method-row ${paymentOption === "upi" ? "active" : ""}`}>
                <label className="payment-row-header with-tags" onClick={() => setPaymentOption("upi")}>
                  <div className="payment-header-left">
                    <div className="custom-radio-circle">{paymentOption === "upi" && <div className="radio-inner-dot" />}</div>
                    <span className="payment-method-title">UPI Apps</span>
                  </div>
                  <div className="payment-header-tags">
                    <span className="tag-pill-subtle">GPay</span>
                    <span className="tag-pill-subtle">PhPe</span>
                  </div>
                </label>
              </div>

              {/* Net Banking */}
              <div className={`payment-method-row ${paymentOption === "netbanking" ? "active" : ""}`}>
                <label className="payment-row-header" onClick={() => setPaymentOption("netbanking")}>
                  <div className="custom-radio-circle">{paymentOption === "netbanking" && <div className="radio-inner-dot" />}</div>
                  <span className="payment-method-title">Net Banking</span>
                </label>
              </div>

              {/* Cash on Delivery */}
              <div className={`payment-method-row ${paymentOption === "cod" ? "active" : ""}`}>
                <label className="payment-row-header is-multiline" onClick={() => setPaymentOption("cod")}>
                  <div className="custom-radio-circle">{paymentOption === "cod" && <div className="radio-inner-dot" />}</div>
                  <div className="cod-text-block">
                    <span className="payment-method-title">Cash on Delivery/Pay on Delivery</span>
                    <span className="cod-sub-desc">Scan &amp; Pay at delivery available.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Promo Code */}
            <div className="gift-promo-section">
              <div className="promo-title-row">
                <Gift size={16} className="gift-box-icon" />
                <span className="promo-section-title">Add a gift card or promo code</span>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); if (promoCode.trim()) setPromoApplied(true); }} className="promo-input-form">
                <input type="text" placeholder="Enter Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="promo-text-field" />
                <button type="submit" className="promo-apply-submit-btn">Apply</button>
              </form>
              {promoApplied && <div className="promo-success-note">Promo code applied successfully!</div>}
            </div>
          </div>

          {/* Right Column: Summary */}
          <aside className="payment-right-col">
            <div className="payment-summary-card">
              <button type="button" className="use-payment-primary-btn" onClick={handlePlaceOrder}>
                Use this payment method
              </button>
              <p className="payment-disclaimer-subtext">
                Choose a payment method to continue checking out. You will still have a chance to review and edit your order before it is final.
              </p>
              <div className="summary-horizontal-divider" />
              <h2 className="summary-box-heading">Order Summary</h2>
              <div className="summary-math-table">
                <div className="summary-math-row"><span className="math-row-label">Items ({itemCount}):</span><span className="math-row-val">${itemsPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
                <div className="summary-math-row"><span className="math-row-label">Delivery:</span><span className="math-row-val">${deliveryFee.toFixed(2)}</span></div>
                <div className="summary-math-row"><span className="math-row-label">Free Delivery Promo:</span><span className="math-row-val">-${Math.abs(deliveryDiscount).toFixed(2)}</span></div>
                <div className="summary-math-row"><span className="math-row-label">Total before tax:</span><span className="math-row-val">${totalBeforeTax.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
                <div className="summary-math-row"><span className="math-row-label">Estimated tax:</span><span className="math-row-val">${estimatedTax.toFixed(2)}</span></div>
              </div>
              <div className="summary-horizontal-divider" />
              <div className="summary-final-total-row">
                <span className="final-total-label">Order Total:</span>
                <span className="final-total-value">${orderTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="payment-security-trust-box">
                <Shield size={16} className="trust-shield-icon" />
                <span className="trust-box-text">Safe and secure payments. Easy returns. 100% Authentic products.</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Dark Footer */}
      <footer className="payment-dark-footer">
        <div className="checkout-content-container footer-flex-container">
          <div className="footer-left-legal-links">
            <Link href="/faq" className="legal-link">Conditions of Use</Link>
            <Link href="/faq" className="legal-link">Privacy Notice</Link>
            <Link href="/faq" className="legal-link">Help</Link>
          </div>
          <div className="footer-right-copyright">© 2024 Al-Umaima Retail. All rights reserved.</div>
        </div>
      </footer>

      {/* Add Card Modal */}
      {isAddCardOpen && (
        <div className="co-modal-backdrop" onClick={() => setIsAddCardOpen(false)}>
          <div className="co-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="co-modal-header">
              <h3>Add a debit or credit card</h3>
              <button onClick={() => setIsAddCardOpen(false)} className="co-modal-close"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddCard} className="co-modal-form">
              <div className="co-field"><label>Bank Name</label><input type="text" required placeholder="e.g. State Bank of India" value={newCardBank} onChange={(e) => setNewCardBank(e.target.value)} /></div>
              <div className="co-field"><label>Card Number</label><input type="text" required placeholder="16-digit card number" maxLength={19} value={newCardNumber} onChange={(e) => setNewCardNumber(e.target.value)} /></div>
              <div className="co-field"><label>Name on Card</label><input type="text" required value={newCardHolder} onChange={(e) => setNewCardHolder(e.target.value)} /></div>
              <div className="co-modal-actions">
                <button type="button" onClick={() => setIsAddCardOpen(false)} className="co-btn-cancel">Cancel</button>
                <button type="submit" className="co-btn-submit">Add your card</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
