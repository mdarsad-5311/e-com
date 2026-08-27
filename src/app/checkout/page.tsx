"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Plus,
  ShieldCheck,
  Lock,
  Edit2,
  CreditCard,
  Building2,
  Home,
  CheckCircle2
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import "@/styles/checkout.css";

interface Address {
  id: string;
  name: string;
  tag: "HOME" | "OFFICE" | "WORK";
  line1: string;
  line2?: string;
  cityStateZip: string;
  country: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, totalItemsCount, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(2);
  const [selectedAddressId, setSelectedAddressId] = useState("addr-1");
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  // Addresses matching Attachment 2
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr-1",
      name: "John Doe",
      tag: "HOME",
      line1: "123 Tech Boulevard, Suite 400",
      cityStateZip: "Silicon Valley, CA 94025",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "addr-2",
      name: "John Doe",
      tag: "OFFICE",
      line1: "456 Corporate Park Drive",
      line2: "Building B, Floor 2",
      cityStateZip: "San Francisco, CA 94105",
      country: "United States",
      phone: "+1 (555) 987-6543",
    },
  ]);

  // Modal State for adding/editing address
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newTag, setNewTag] = useState<"HOME" | "OFFICE">("HOME");
  const [newLine1, setNewLine1] = useState("");
  const [newCityZip, setNewCityZip] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");

  // Pricing calculations
  const defaultSubtotal = 1498.00;
  const itemsPrice = subtotal > 0 ? subtotal : defaultSubtotal;
  const itemsCount = totalItemsCount > 0 ? totalItemsCount : 2;
  const estimatedTax = itemsPrice * 0.08; // 8% tax -> $119.84 for $1498.00
  const orderTotal = itemsPrice + estimatedTax;

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleDeliverHere = () => {
    setCurrentStep(3);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddrId(addr.id);
    setNewName(addr.name);
    setNewTag(addr.tag === "OFFICE" ? "OFFICE" : "HOME");
    setNewLine1(addr.line1);
    setNewCityZip(addr.cityStateZip);
    setNewPhone(addr.phone);
    setIsAddModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingAddrId(null);
    setNewName("John Doe");
    setNewTag("HOME");
    setNewLine1("");
    setNewCityZip("San Francisco, CA 94105");
    setNewPhone("+1 (555) 000-0000");
    setIsAddModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newLine1.trim()) return;

    if (editingAddrId) {
      setAddresses(
        addresses.map((a) =>
          a.id === editingAddrId
            ? {
                ...a,
                name: newName.trim(),
                tag: newTag,
                line1: newLine1.trim(),
                cityStateZip: newCityZip.trim() || "San Francisco, CA 94105",
                phone: newPhone.trim() || "+1 (555) 123-4567",
              }
            : a
        )
      );
    } else {
      const newAddr: Address = {
        id: `addr-${Date.now()}`,
        name: newName.trim(),
        tag: newTag,
        line1: newLine1.trim(),
        cityStateZip: newCityZip.trim() || "San Francisco, CA 94105",
        country: "United States",
        phone: newPhone.trim() || "+1 (555) 123-4567",
      };
      setAddresses([...addresses, newAddr]);
      setSelectedAddressId(newAddr.id);
    }

    setIsAddModalOpen(false);
    setEditingAddrId(null);
  };

  const handlePlaceOrder = () => {
    const num = `AU-${Math.floor(10000 + Math.random() * 90000)}`;
    clearCart();
    setGeneratedOrderId(num);
    setIsOrderSubmitted(true);
    // Redirect to dedicated Order Confirmation page
    router.push(`/checkout/success?orderId=${num}&subtotal=${itemsPrice.toFixed(2)}`);
  };

  // While redirecting show nothing extra
  if (isOrderSubmitted) return null;

  return (
    <div className="al-checkout-page">
      {/* Checkout Clean Top Header */}
      <header className="al-checkout-header">
        <div className="header-container al-checkout-header-inner">
          <Link href="/" className="al-checkout-logo">
            AL-UMAIMA
          </Link>
          <div className="al-checkout-secure-badge">
            <Lock size={15} />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Progress Stepper Bar (Login -> Shipping -> Payment) */}
      <div className="al-checkout-stepper-wrap">
        <div className="al-stepper-container">
          {/* Step 1: Login (Completed) */}
          <div 
            className="al-step-item completed"
            onClick={() => setCurrentStep(2)}
            style={{ cursor: "pointer" }}
          >
            <div className="al-step-circle">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="al-step-label">Login</span>
          </div>

          <div className="al-step-connector completed" />

          {/* Step 2: Shipping */}
          <div 
            className={`al-step-item ${currentStep >= 2 ? "active" : ""}`}
            onClick={() => setCurrentStep(2)}
            style={{ cursor: "pointer" }}
          >
            <div className="al-step-circle">2</div>
            <span className="al-step-label">Shipping</span>
          </div>

          <div className={`al-step-connector ${currentStep >= 3 ? "completed" : ""}`} />

          {/* Step 3: Payment */}
          <div 
            className={`al-step-item ${currentStep === 3 ? "active" : ""}`}
            onClick={() => setCurrentStep(3)}
            style={{ cursor: "pointer" }}
          >
            <div className="al-step-circle">3</div>
            <span className="al-step-label">Payment</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Grid */}
      <main className="container al-checkout-main-grid">
        {/* Left Column */}
        <section className="al-checkout-left-col">
          {currentStep === 2 ? (
            <>
              <h2 className="al-checkout-section-title">Select Delivery Address</h2>

              <div className="al-addresses-grid">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;

                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr.id)}
                      className={`al-address-card ${isSelected ? "selected" : ""}`}
                    >
                      {/* Top Row: Name + Tag + Radio Button */}
                      <div className="al-addr-top">
                        <div className="al-addr-name-tag">
                          <strong className="al-addr-name">{addr.name}</strong>
                          <span className="al-addr-tag-pill">{addr.tag}</span>
                        </div>

                        <div className={`al-custom-radio ${isSelected ? "checked" : ""}`}>
                          {isSelected && <div className="al-radio-dot" />}
                        </div>
                      </div>

                      {/* Address Details */}
                      <div className="al-addr-body">
                        <p>{addr.line1}</p>
                        {addr.line2 && <p>{addr.line2}</p>}
                        <p>{addr.cityStateZip}</p>
                        <p>{addr.country}</p>
                        <p className="al-addr-phone">{addr.phone}</p>
                      </div>

                      {/* Actions (Deliver Here + Edit) */}
                      {isSelected ? (
                        <div className="al-addr-actions-row">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeliverHere();
                            }}
                            className="al-deliver-here-btn"
                          >
                            Deliver Here
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(addr);
                            }}
                            className="al-edit-addr-link"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <div className="al-addr-actions-row">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAddress(addr.id);
                            }}
                            className="al-edit-addr-link"
                          >
                            Select this address
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add New Address Card */}
                <div
                  onClick={handleOpenNew}
                  className="al-add-address-card"
                >
                  <div className="al-add-icon-circle">
                    <Plus size={20} />
                  </div>
                  <span className="al-add-addr-text">Add New Address</span>
                </div>
              </div>
            </>
          ) : (
            /* Step 3: Payment Method */
            <div className="al-payment-step-wrap">
              <h2 className="al-checkout-section-title">Select Payment Method</h2>

              <div className="al-payment-options-list">
                {/* Credit Card Option */}
                <div 
                  className={`al-payment-option-card ${paymentMethod === "card" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="al-pay-card-header">
                    <div className="al-pay-title-group">
                      <CreditCard size={20} className="al-pay-icon" />
                      <strong>Credit or Debit Card</strong>
                    </div>
                    <div className={`al-custom-radio ${paymentMethod === "card" ? "checked" : ""}`}>
                      {paymentMethod === "card" && <div className="al-radio-dot" />}
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="al-card-inputs-grid" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="al-checkout-input"
                      />
                      <div className="al-card-two-col">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="al-checkout-input"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="al-checkout-input"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div 
                  className={`al-payment-option-card ${paymentMethod === "cod" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="al-pay-card-header">
                    <div className="al-pay-title-group">
                      <Home size={20} className="al-pay-icon" />
                      <strong>Cash on Delivery (COD)</strong>
                    </div>
                    <div className={`al-custom-radio ${paymentMethod === "cod" ? "checked" : ""}`}>
                      {paymentMethod === "cod" && <div className="al-radio-dot" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="al-payment-actions-bar">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="al-btn-back-step"
                >
                  ← Back to Shipping
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="al-btn-place-order"
                >
                  Confirm & Place Order →
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Order Summary Card */}
        <aside className="al-checkout-right-col">
          <div className="al-checkout-summary-card">
            <h3 className="al-summary-card-title">Order Summary</h3>

            <div className="al-summary-card-rows">
              <div className="al-summary-line">
                <span>Items ({itemsCount})</span>
                <span>${itemsPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="al-summary-line">
                <span>Shipping</span>
                <span className="al-free-shipping-text">Free</span>
              </div>

              <div className="al-summary-line">
                <span>Estimated Tax</span>
                <span>${estimatedTax.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="al-summary-divider" />

            <div className="al-summary-total-line">
              <span className="al-total-word">Total</span>
              <span className="al-total-amount">${orderTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Trust Guarantee Box */}
            <div className="al-checkout-trust-box">
              <ShieldCheck size={20} className="al-trust-icon" />
              <div className="al-trust-texts">
                <strong>Al-Umaima Assured</strong>
                <span>Secure transaction guarantees</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="al-checkout-footer">
        <div className="container">
          <p>© 2024 Al-Umaima Premium Electronics. All rights reserved.</p>
        </div>
      </footer>

      {/* Add/Edit Address Modal */}
      {isAddModalOpen && (
        <div className="al-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="al-checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="al-modal-header">
              <h3>{editingAddrId ? "Edit Delivery Address" : "Add New Delivery Address"}</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="al-modal-close">✕</button>
            </div>

            <form onSubmit={handleSaveAddress} className="al-modal-form">
              <div className="al-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="al-checkout-input"
                  required
                />
              </div>

              <div className="al-form-group">
                <label>Address Tag</label>
                <div className="al-tag-selector">
                  <button
                    type="button"
                    onClick={() => setNewTag("HOME")}
                    className={`al-tag-opt ${newTag === "HOME" ? "active" : ""}`}
                  >
                    HOME
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTag("OFFICE")}
                    className={`al-tag-opt ${newTag === "OFFICE" ? "active" : ""}`}
                  >
                    OFFICE
                  </button>
                </div>
              </div>

              <div className="al-form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 123 Tech Boulevard, Suite 400"
                  value={newLine1}
                  onChange={(e) => setNewLine1(e.target.value)}
                  className="al-checkout-input"
                  required
                />
              </div>

              <div className="al-form-group">
                <label>City, State & Zip Code</label>
                <input
                  type="text"
                  placeholder="e.g. Silicon Valley, CA 94025"
                  value={newCityZip}
                  onChange={(e) => setNewCityZip(e.target.value)}
                  className="al-checkout-input"
                  required
                />
              </div>

              <div className="al-form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 123-4567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="al-checkout-input"
                  required
                />
              </div>

              <div className="al-modal-footer">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="al-modal-cancel">Cancel</button>
                <button type="submit" className="al-modal-save-btn">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
