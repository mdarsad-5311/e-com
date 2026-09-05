"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Plus,
  ShieldCheck,
  Lock,
  CreditCard,
  Home,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { api } from "@/lib/api";
import { CreateOrderPayload, OrderResponse } from "@/types/api";
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
  const { user, isLoading } = useAuth();
  const { subtotal, totalItemsCount, clearCart } = useCart();

  // Protected Route Guard
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=" + encodeURIComponent("/checkout"));
    }
  }, [isLoading, user, router]);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(2);
  const [selectedAddressId, setSelectedAddressId] = useState("addr-1");
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Addresses state
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

  // Load saved user addresses from backend if authenticated
  useEffect(() => {
    let isMounted = true;
    const loadAddresses = async () => {
      try {
        const res = await api.get("/api/addresses/");
        const addrList = Array.isArray(res) ? res : (res?.results || []);
        if (isMounted && addrList.length > 0) {
          const mapped: Address[] = addrList.map((a: any) => ({
            id: String(a.id),
            name: a.full_name || a.name || "Recipient",
            tag: a.is_default ? "HOME" : "OFFICE",
            line1: a.street_address || a.line1 || "",
            line2: a.line2 || "",
            cityStateZip: `${a.city || ""}, ${a.state || ""} ${a.postal_code || ""}`.trim().replace(/^,\s*/, ""),
            country: a.country || "United States",
            phone: a.phone_number || a.phone || "",
          }));
          setAddresses(mapped);
          setSelectedAddressId(mapped[0].id);
        }
      } catch {
        // Gracefully use local addresses
      }
    };

    if (user) {
      loadAddresses();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Modal State for adding/editing address
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newTag, setNewTag] = useState<"HOME" | "OFFICE">("HOME");
  const [newLine1, setNewLine1] = useState("");
  const [newCityZip, setNewCityZip] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Baseline state to track form dirtiness
  const initialValuesRef = useRef({ name: "", tag: "HOME", line1: "", cityZip: "", phone: "" });
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  // Input refs for autofocus on error
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const line1InputRef = useRef<HTMLInputElement | null>(null);
  const cityZipInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");

  // Server computes authoritative totals; frontend displays preview based on live cart
  const itemsPrice = subtotal;
  const itemsCount = totalItemsCount;
  const estimatedTax = itemsPrice > 0 ? itemsPrice * 0.08 : 0;
  const orderTotal = itemsPrice + estimatedTax;
  const isCartEmpty = itemsCount === 0;

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    setCheckoutError(null);
  };

  const handleDeliverHere = () => {
    setCurrentStep(3);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddrId(addr.id);
    const initial = {
      name: addr.name,
      tag: addr.tag === "OFFICE" ? ("OFFICE" as const) : ("HOME" as const),
      line1: addr.line1,
      cityZip: addr.cityStateZip,
      phone: addr.phone,
    };
    initialValuesRef.current = initial;
    setNewName(initial.name);
    setNewTag(initial.tag);
    setNewLine1(initial.line1);
    setNewCityZip(initial.cityZip);
    setNewPhone(initial.phone);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingAddrId(null);
    const initial = {
      name: "",
      tag: "HOME" as const,
      line1: "",
      cityZip: "",
      phone: "",
    };
    initialValuesRef.current = initial;
    setNewName(initial.name);
    setNewTag(initial.tag);
    setNewLine1(initial.line1);
    setNewCityZip(initial.cityZip);
    setNewPhone(initial.phone);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const isFormDirty = () => {
    const init = initialValuesRef.current;
    return (
      newName.trim() !== init.name.trim() ||
      newTag !== init.tag ||
      newLine1.trim() !== init.line1.trim() ||
      newCityZip.trim() !== init.cityZip.trim() ||
      newPhone.trim() !== init.phone.trim()
    );
  };

  const handleRequestCloseModal = () => {
    if (isFormDirty()) {
      setIsDiscardConfirmOpen(true);
    } else {
      setIsAddModalOpen(false);
      setEditingAddrId(null);
    }
  };

  const handleConfirmDiscard = () => {
    setIsDiscardConfirmOpen(false);
    setIsAddModalOpen(false);
    setEditingAddrId(null);
  };

  const validateAddressForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newName.trim() || newName.trim().length < 2) {
      errors.name = "Full name is required (at least 2 characters).";
    }

    if (!newLine1.trim() || newLine1.trim().length < 5) {
      errors.line1 = "Street address is required (at least 5 characters).";
    }

    if (!newCityZip.trim() || newCityZip.trim().length < 3) {
      errors.cityZip = "City, State & ZIP/Postal Code is required.";
    }

    const phoneTrimmed = newPhone.trim();
    const phoneRegex = /^[+]?[\d\s().-]{7,20}$/;
    if (!phoneTrimmed) {
      errors.phone = "Phone number is required for delivery notifications.";
    } else if (!phoneRegex.test(phoneTrimmed) || phoneTrimmed.replace(/\D/g, "").length < 7) {
      errors.phone = "Please enter a valid phone number (e.g. +1 555-123-4567).";
    }

    setFormErrors(errors);

    if (errors.name) {
      nameInputRef.current?.focus();
    } else if (errors.line1) {
      line1InputRef.current?.focus();
    } else if (errors.cityZip) {
      cityZipInputRef.current?.focus();
    } else if (errors.phone) {
      phoneInputRef.current?.focus();
    }

    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAddressForm()) {
      return;
    }

    setIsSubmittingAddress(true);

    try {
      if (editingAddrId) {
        setAddresses((prev) =>
          prev.map((a) =>
            a.id === editingAddrId
              ? {
                  ...a,
                  name: newName.trim(),
                  tag: newTag,
                  line1: newLine1.trim(),
                  cityStateZip: newCityZip.trim(),
                  phone: newPhone.trim(),
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
          cityStateZip: newCityZip.trim(),
          country: "United States",
          phone: newPhone.trim(),
        };
        setAddresses((prev) => [...prev, newAddr]);
        setSelectedAddressId(newAddr.id);
      }

      setIsSubmittingAddress(false);
      setIsAddModalOpen(false);
      setEditingAddrId(null);
    } catch {
      setIsSubmittingAddress(false);
    }
  };

  // Place Order API Integration with double-submission protection
  const handlePlaceOrder = async () => {
    if (isSubmittingOrder) return;
    if (isCartEmpty) {
      setCheckoutError("Your cart is empty. Please add items to your cart before proceeding.");
      return;
    }

    setIsSubmittingOrder(true);
    setCheckoutError(null);

    try {
      const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
      const isNumericId = selectedAddr && !isNaN(Number(selectedAddr.id)) && Number(selectedAddr.id) > 0;

      const payload: CreateOrderPayload = {
        payment_method: paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "apple" ? "Apple Pay" : "Credit Card",
      };

      if (isNumericId && selectedAddr) {
        payload.shipping_address_id = Number(selectedAddr.id);
      } else if (selectedAddr) {
        payload.shipping_address = {
          name: selectedAddr.name,
          line1: selectedAddr.line1,
          line2: selectedAddr.line2 || "",
          cityStateZip: selectedAddr.cityStateZip,
          country: selectedAddr.country || "United States",
          phone: selectedAddr.phone,
        };
      }

      const order = await api.post<OrderResponse>("/api/orders/", payload);
      clearCart();
      setIsOrderSubmitted(true);
      const orderIdentifier = order.order_number || String(order.id);
      router.push(`/checkout/success?orderId=${encodeURIComponent(orderIdentifier)}&id=${order.id}&subtotal=${order.subtotal}&total=${order.total_amount}`);
    } catch (err: any) {
      setCheckoutError(err.message || "Failed to place order. Please verify your cart and address and try again.");
      setIsSubmittingOrder(false);
    }
  };

  // Focus trap hooks
  const modalContainerRef = useFocusTrap<HTMLDivElement>(isAddModalOpen && !isDiscardConfirmOpen, handleRequestCloseModal);
  const discardModalRef = useFocusTrap<HTMLDivElement>(isDiscardConfirmOpen, () => setIsDiscardConfirmOpen(false));

  if (isOrderSubmitted) return null;

  if (isLoading) {
    return (
      <div className="al-checkout-page" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading checkout...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="al-checkout-page">
      {/* Checkout Clean Top Header */}
      <header className="al-checkout-header">
        <div className="header-container al-checkout-header-inner">
          <Link href="/" className="al-checkout-logo" aria-label="Al-Umaima Home">
            AL-UMAIMA
          </Link>
          <div className="al-checkout-secure-badge">
            <Lock size={15} aria-hidden="true" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Progress Stepper Bar (Login -> Shipping -> Payment) */}
      <nav className="al-checkout-stepper-wrap" aria-label="Checkout Progress">
        <div className="al-stepper-container">
          {/* Step 1: Login (Completed) */}
          <button 
            type="button"
            className="al-step-item completed"
            onClick={() => setCurrentStep(2)}
            aria-label="Step 1: Login (Completed)"
            style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
          >
            <div className="al-step-circle">
              <Check size={14} strokeWidth={3} aria-hidden="true" />
            </div>
            <span className="al-step-label">Login</span>
          </button>

          <div className="al-step-connector completed" aria-hidden="true" />

          {/* Step 2: Shipping */}
          <button 
            type="button"
            className={`al-step-item ${currentStep >= 2 ? "active" : ""}`}
            onClick={() => setCurrentStep(2)}
            aria-label="Step 2: Shipping"
            aria-current={currentStep === 2 ? "step" : undefined}
            style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
          >
            <div className="al-step-circle">2</div>
            <span className="al-step-label">Shipping</span>
          </button>

          <div className={`al-step-connector ${currentStep >= 3 ? "completed" : ""}`} aria-hidden="true" />

          {/* Step 3: Payment */}
          <button 
            type="button"
            className={`al-step-item ${currentStep === 3 ? "active" : ""}`}
            onClick={() => setCurrentStep(3)}
            aria-label="Step 3: Payment"
            aria-current={currentStep === 3 ? "step" : undefined}
            style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
          >
            <div className="al-step-circle">3</div>
            <span className="al-step-label">Payment</span>
          </button>
        </div>
      </nav>

      {/* Empty cart warning banner */}
      {isCartEmpty && (
        <div className="container" style={{ marginBottom: "1.5rem" }}>
          <div style={{ padding: "1rem 1.25rem", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid #f59e0b", borderRadius: "8px", color: "#b45309", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <ShoppingBag size={20} />
              <span>Your cart is empty. Add products to your cart to proceed with checkout.</span>
            </div>
            <Link href="/" className="btn btn-outline" style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem", borderColor: "#f59e0b", color: "#b45309" }}>
              Shop Now
            </Link>
          </div>
        </div>
      )}

      {/* Error alert if order placement fails */}
      {checkoutError && (
        <div className="container" style={{ marginBottom: "1.5rem" }}>
          <div style={{ padding: "0.85rem 1.25rem", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--error, #ef4444)", borderRadius: "8px", color: "var(--error, #ef4444)", display: "flex", alignItems: "center", gap: "0.75rem" }} role="alert">
            <AlertCircle size={18} />
            <span>{checkoutError}</span>
          </div>
        </div>
      )}

      {/* Main Checkout Grid */}
      <main className="container al-checkout-main-grid">
        {/* Left Column */}
        <section className="al-checkout-left-col" aria-labelledby="checkout-step-title">
          {currentStep === 2 ? (
            <>
              <h2 id="checkout-step-title" className="al-checkout-section-title">Select Delivery Address</h2>

              <div className="al-addresses-grid" role="radiogroup" aria-label="Saved Delivery Addresses">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;

                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectAddress(addr.id);
                        }
                      }}
                      tabIndex={0}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${addr.name}, ${addr.tag} address at ${addr.line1}, ${addr.cityStateZip}`}
                      className={`al-address-card ${isSelected ? "selected" : ""}`}
                    >
                      {/* Top Row: Name + Tag + Radio Button */}
                      <div className="al-addr-top">
                        <div className="al-addr-name-tag">
                          <strong className="al-addr-name">{addr.name}</strong>
                          <span className="al-addr-tag-pill">{addr.tag}</span>
                        </div>

                        <div className={`al-custom-radio ${isSelected ? "checked" : ""}`} aria-hidden="true">
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
                            aria-label={`Edit address for ${addr.name}`}
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
                <button
                  type="button"
                  onClick={handleOpenNew}
                  className="al-add-address-card"
                  aria-label="Add a new delivery address"
                >
                  <div className="al-add-icon-circle">
                    <Plus size={20} aria-hidden="true" />
                  </div>
                  <span className="al-add-addr-text">Add New Address</span>
                </button>
              </div>
            </>
          ) : (
            /* Step 3: Payment Method */
            <div className="al-payment-step-wrap">
              <h2 id="checkout-step-title" className="al-checkout-section-title">Select Payment Method</h2>

              <div className="al-payment-options-list" role="radiogroup" aria-label="Payment Options">
                {/* Credit Card Option */}
                <div 
                  className={`al-payment-option-card ${paymentMethod === "card" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPaymentMethod("card");
                    }
                  }}
                  tabIndex={0}
                  role="radio"
                  aria-checked={paymentMethod === "card"}
                  aria-label="Credit or Debit Card"
                >
                  <div className="al-pay-card-header">
                    <div className="al-pay-title-group">
                      <CreditCard size={20} className="al-pay-icon" aria-hidden="true" />
                      <strong>Credit or Debit Card</strong>
                    </div>
                    <div className={`al-custom-radio ${paymentMethod === "card" ? "checked" : ""}`} aria-hidden="true">
                      {paymentMethod === "card" && <div className="al-radio-dot" />}
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="al-card-inputs-grid" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <label htmlFor="card-number-input" className="sr-only" style={{ display: "none" }}>Card Number</label>
                        <input
                          id="card-number-input"
                          name="cardNumber"
                          type="text"
                          autoComplete="cc-number"
                          placeholder="Card Number"
                          aria-label="Card Number"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="al-checkout-input"
                        />
                      </div>
                      <div className="al-card-two-col">
                        <div>
                          <label htmlFor="card-expiry-input" className="sr-only" style={{ display: "none" }}>Expiration Date</label>
                          <input
                            id="card-expiry-input"
                            name="cardExpiry"
                            type="text"
                            autoComplete="cc-exp"
                            placeholder="MM/YY"
                            aria-label="Card Expiration Date"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="al-checkout-input"
                          />
                        </div>
                        <div>
                          <label htmlFor="card-cvc-input" className="sr-only" style={{ display: "none" }}>Security Code</label>
                          <input
                            id="card-cvc-input"
                            name="cardCvc"
                            type="password"
                            maxLength={4}
                            autoComplete="cc-csc"
                            placeholder="CVC"
                            aria-label="Card Security Code"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="al-checkout-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div 
                  className={`al-payment-option-card ${paymentMethod === "cod" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("cod")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPaymentMethod("cod");
                    }
                  }}
                  tabIndex={0}
                  role="radio"
                  aria-checked={paymentMethod === "cod"}
                  aria-label="Cash on Delivery"
                >
                  <div className="al-pay-card-header">
                    <div className="al-pay-title-group">
                      <Home size={20} className="al-pay-icon" aria-hidden="true" />
                      <strong>Cash on Delivery (COD)</strong>
                    </div>
                    <div className={`al-custom-radio ${paymentMethod === "cod" ? "checked" : ""}`} aria-hidden="true">
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
                  disabled={isSubmittingOrder || isCartEmpty}
                  className="al-btn-place-order"
                >
                  {isSubmittingOrder ? "Placing Order..." : "Confirm & Place Order →"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Order Summary Card */}
        <aside className="al-checkout-right-col" aria-label="Order Summary">
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

              <div className="al-summary-divider" />

              <div className="al-summary-total-line">
                <span>Order Total</span>
                <span>${orderTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="al-checkout-badge-row">
              <ShieldCheck size={18} className="al-badge-shield-icon" aria-hidden="true" />
              <span>Safe &amp; Secure 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Add / Edit Address Modal with accessible Focus Trap */}
      {isAddModalOpen && (
        <div className="al-modal-backdrop" onClick={handleRequestCloseModal}>
          <div
            ref={modalContainerRef}
            tabIndex={-1}
            className="al-checkout-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-addr-title"
          >
            <div className="al-modal-header">
              <h3 id="modal-addr-title">
                {editingAddrId ? "Edit Delivery Address" : "Add New Delivery Address"}
              </h3>
            </div>

            <form onSubmit={handleSaveAddress} className="al-modal-form" noValidate>
              <div className="al-form-group">
                <label htmlFor="checkout-full-name">Full Name *</label>
                <input
                  ref={nameInputRef}
                  id="checkout-full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={`al-checkout-input ${formErrors.name ? "error" : ""}`}
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? "name-error-msg" : undefined}
                  required
                />
                {formErrors.name && (
                  <span id="name-error-msg" role="alert" style={{ color: "var(--error)", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                    <AlertCircle size={13} aria-hidden="true" /> {formErrors.name}
                  </span>
                )}
              </div>

              <div className="al-form-group">
                <label id="addr-tag-label">Address Tag</label>
                <div className="al-tag-selector" role="radiogroup" aria-labelledby="addr-tag-label">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={newTag === "HOME"}
                    onClick={() => setNewTag("HOME")}
                    className={`al-tag-opt ${newTag === "HOME" ? "active" : ""}`}
                  >
                    HOME
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={newTag === "OFFICE"}
                    onClick={() => setNewTag("OFFICE")}
                    className={`al-tag-opt ${newTag === "OFFICE" ? "active" : ""}`}
                  >
                    OFFICE
                  </button>
                </div>
              </div>

              <div className="al-form-group">
                <label htmlFor="checkout-street-address">Street Address *</label>
                <input
                  ref={line1InputRef}
                  id="checkout-street-address"
                  name="streetAddress"
                  type="text"
                  autoComplete="street-address"
                  placeholder="e.g. 123 Tech Boulevard, Suite 400"
                  value={newLine1}
                  onChange={(e) => {
                    setNewLine1(e.target.value);
                    if (formErrors.line1) setFormErrors((prev) => ({ ...prev, line1: "" }));
                  }}
                  className={`al-checkout-input ${formErrors.line1 ? "error" : ""}`}
                  aria-invalid={!!formErrors.line1}
                  aria-describedby={formErrors.line1 ? "line1-error-msg" : undefined}
                  required
                />
                {formErrors.line1 && (
                  <span id="line1-error-msg" role="alert" style={{ color: "var(--error)", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                    <AlertCircle size={13} aria-hidden="true" /> {formErrors.line1}
                  </span>
                )}
              </div>

              <div className="al-form-group">
                <label htmlFor="checkout-city-zip">City, State & ZIP / Postal Code *</label>
                <input
                  ref={cityZipInputRef}
                  id="checkout-city-zip"
                  name="cityStateZip"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="e.g. Silicon Valley, CA 94025"
                  value={newCityZip}
                  onChange={(e) => {
                    setNewCityZip(e.target.value);
                    if (formErrors.cityZip) setFormErrors((prev) => ({ ...prev, cityZip: "" }));
                  }}
                  className={`al-checkout-input ${formErrors.cityZip ? "error" : ""}`}
                  aria-invalid={!!formErrors.cityZip}
                  aria-describedby={formErrors.cityZip ? "cityzip-error-msg" : undefined}
                  required
                />
                {formErrors.cityZip && (
                  <span id="cityzip-error-msg" role="alert" style={{ color: "var(--error)", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                    <AlertCircle size={13} aria-hidden="true" /> {formErrors.cityZip}
                  </span>
                )}
              </div>

              <div className="al-form-group">
                <label htmlFor="checkout-phone-number">Phone Number *</label>
                <input
                  ref={phoneInputRef}
                  id="checkout-phone-number"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="e.g. +1 (555) 123-4567"
                  value={newPhone}
                  onChange={(e) => {
                    setNewPhone(e.target.value);
                    if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  className={`al-checkout-input ${formErrors.phone ? "error" : ""}`}
                  aria-invalid={!!formErrors.phone}
                  aria-describedby={formErrors.phone ? "phone-error-msg" : undefined}
                  required
                />
                {formErrors.phone && (
                  <span id="phone-error-msg" role="alert" style={{ color: "var(--error)", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                    <AlertCircle size={13} aria-hidden="true" /> {formErrors.phone}
                  </span>
                )}
              </div>

              <div className="al-modal-footer">
                <button
                  type="button"
                  onClick={handleRequestCloseModal}
                  className="al-modal-cancel"
                  disabled={isSubmittingAddress}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="al-modal-save-btn"
                  disabled={isSubmittingAddress}
                >
                  {isSubmittingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discard Confirmation Modal */}
      {isDiscardConfirmOpen && (
        <div className="al-modal-backdrop" style={{ zIndex: 2100 }} onClick={() => setIsDiscardConfirmOpen(false)}>
          <div
            ref={discardModalRef}
            tabIndex={-1}
            className="al-checkout-modal"
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="discard-title"
            aria-describedby="discard-desc"
          >
            <div className="al-modal-header">
              <h3 id="discard-title">Discard changes?</h3>
            </div>
            <p id="discard-desc" style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "1rem 0 1.5rem" }}>
              You have unsaved changes to this delivery address. Are you sure you want to discard them?
            </p>
            <div className="al-modal-footer" style={{ justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setIsDiscardConfirmOpen(false)}
                className="al-modal-cancel"
              >
                Continue Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmDiscard}
                className="al-modal-save-btn"
                style={{ backgroundColor: "var(--error)", color: "#FFFFFF" }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
