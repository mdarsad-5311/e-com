"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Check, 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState<boolean>(false);

  // Form State
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "Alexander",
    lastName: "Vance",
    email: "alexander@example.com",
    address: "742 Evergreen Terrace",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
  });

  const [deliveryMethod, setDeliveryMethod] = useState<string>("express");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [orderId, setOrderId] = useState("");

  const shippingCost = deliveryMethod === "express" ? 15 : 0;
  const discountAmount = promoDiscount;
  const estimatedTax = Math.max(0, subtotal - discountAmount) * 0.08;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "AURA2026" || code === "AURA15") {
      setPromoDiscount(subtotal * 0.15);
      setPromoMsg("15% off applied");
    } else if (code === "WELCOME10") {
      setPromoDiscount(10);
      setPromoMsg("$10 off applied");
    } else {
      setPromoDiscount(0);
      setPromoMsg("Invalid code. Try AURA2026.");
    }
  };

  const handlePlaceOrder = () => {
    const id = `AURA-${Date.now().toString().slice(-8)}`;
    setOrderId(id);
    try {
      localStorage.setItem(
        "aurastore_last_order",
        JSON.stringify({
          id,
          total: totalAmount,
          status: "PROCESSING",
          shippingTo: `${shippingInfo.address}, ${shippingInfo.city}`,
          eta: "August 24, 2026",
        })
      );
    } catch {
      /* ignore */
    }
    setIsOrderSubmitted(true);
    setTimeout(() => {
      clearCart();
    }, 400);
  };

  if (!isOrderSubmitted && cart.length === 0) {
    return (
      <div className="container section">
        <h1 className="section-title">Checkout</h1>
        <p className="section-subtitle">Your bag is empty. Add something you love first.</p>
        <Link href="/products" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Browse products
        </Link>
      </div>
    );
  }

  if (isOrderSubmitted) {
    return (
      <div className="container section">
        <div className="success-order-card">
          <div className="success-icon-badge">
            <Check size={40} />
          </div>
          <h1 className="success-title">Order Confirmed!</h1>
          <p className="success-sub">
            Thank you for shopping with AuraStore. Your order <strong>#{orderId || "AURA-2026"}</strong> has been placed successfully.
          </p>
          <div className="order-summary-box">
            <div className="summary-line"><span>Order Total:</span> <strong>${totalAmount.toFixed(2)}</strong></div>
            <div className="summary-line"><span>Estimated Delivery:</span> <strong>August 24, 2026</strong></div>
            <div className="summary-line"><span>Shipping To:</span> <strong>{shippingInfo.address}, {shippingInfo.city}</strong></div>
          </div>
          <Link href="/track-order" className="btn btn-primary">
            Track this order
          </Link>
        </div>

        <style jsx>{`
          .success-order-card {
            background: #FFFFFF;
            border-radius: 24px;
            border: 1px solid var(--borders);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
            max-width: 600px;
            margin: 3rem auto;
            padding: 3.5rem 2.5rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.25rem;
          }
          .success-icon-badge {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: var(--success-light);
            color: var(--success);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .success-title { font-size: 2.2rem; font-weight: 900; color: var(--text); }
          .success-sub { color: var(--text-muted); font-size: 1rem; line-height: 1.6; }
          .order-summary-box {
            width: 100%;
            background: var(--background);
            border: 1px solid var(--borders);
            border-radius: 14px;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.65rem;
            text-align: left;
            margin: 1rem 0;
          }
          .summary-line { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-muted); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container section">
      {/* Header & Step Indicator Prompt Specs */}
      <div className="checkout-header">
        <h1 className="section-title">Checkout</h1>
        
        {/* Step Indicator & Progress Bar */}
        <div className="steps-indicator-container">
          <div className="steps-row">
            {[
              { step: 1, label: "Shipping Address", icon: MapPin },
              { step: 2, label: "Delivery Method", icon: Truck },
              { step: 3, label: "Payment Method", icon: CreditCard },
              { step: 4, label: "Review Order", icon: ShieldCheck },
            ].map((item) => (
              <div 
                key={item.step} 
                className={`step-item ${currentStep === item.step ? "active" : currentStep > item.step ? "completed" : ""}`}
                onClick={() => setCurrentStep(item.step)}
              >
                <div className="step-icon-circle">
                  {currentStep > item.step ? <Check size={16} /> : <item.icon size={16} />}
                </div>
                <span className="step-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${(currentStep / 4) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Main Checkout Layout */}
      <div className="checkout-grid-layout">
        {/* Left Column: Interactive Form Steps */}
        <div className="checkout-form-column">
          {/* Step 1: Shipping Address */}
          {currentStep === 1 && (
            <div className="step-card">
              <h2 className="step-card-title">1. Shipping Address</h2>
              <div className="form-grid-2">
                <div className="field-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                  />
                </div>
                <div className="field-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                />
              </div>

              <div className="form-grid-3">
                <div className="field-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  />
                </div>
                <div className="field-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                  />
                </div>
                <div className="field-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    value={shippingInfo.zip}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                  />
                </div>
              </div>

              <button className="btn btn-primary next-step-btn" onClick={() => setCurrentStep(2)}>
                Continue to Delivery <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Delivery Method */}
          {currentStep === 2 && (
            <div className="step-card">
              <h2 className="step-card-title">2. Delivery Method</h2>
              <div className="options-stack">
                <label 
                  className={`option-card ${deliveryMethod === "express" ? "selected" : ""}`}
                  onClick={() => setDeliveryMethod("express")}
                >
                  <input type="radio" checked={deliveryMethod === "express"} readOnly />
                  <div className="option-info">
                    <div className="option-title">Aura Express Air Shipping ($15.00)</div>
                    <div className="option-sub">Guaranteed delivery in 1-2 business days with live tracking.</div>
                  </div>
                </label>

                <label 
                  className={`option-card ${deliveryMethod === "standard" ? "selected" : ""}`}
                  onClick={() => setDeliveryMethod("standard")}
                >
                  <input type="radio" checked={deliveryMethod === "standard"} readOnly />
                  <div className="option-info">
                    <div className="option-title">Standard Ground Delivery (FREE)</div>
                    <div className="option-sub">Delivered in 3-5 business days.</div>
                  </div>
                </label>
              </div>

              <div className="step-btn-row">
                <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft size={18} /> Back
                </button>
                <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>
                  Continue to Payment <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === 3 && (
            <div className="step-card">
              <h2 className="step-card-title">3. Payment Method</h2>
              <div className="options-stack">
                <label 
                  className={`option-card ${paymentMethod === "card" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <input type="radio" checked={paymentMethod === "card"} readOnly />
                  <div className="option-info">
                    <div className="option-title">Credit or Debit Card</div>
                    <div className="option-sub">Visa, MasterCard, American Express, Discover</div>
                  </div>
                </label>

                <label 
                  className={`option-card ${paymentMethod === "apple" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("apple")}
                >
                  <input type="radio" checked={paymentMethod === "apple"} readOnly />
                  <div className="option-info">
                    <div className="option-title">Apple Pay</div>
                    <div className="option-sub">Express 1-Touch Checkout</div>
                  </div>
                </label>

                <label 
                  className={`option-card ${paymentMethod === "cod" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <input type="radio" checked={paymentMethod === "cod"} readOnly />
                  <div className="option-info">
                    <div className="option-title">Cash on Delivery (COD)</div>
                    <div className="option-sub">Pay upon package delivery at your doorstep</div>
                  </div>
                </label>
              </div>

              <div className="step-btn-row">
                <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft size={18} /> Back
                </button>
                <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>
                  Review Final Order <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Order Review & Confirmation */}
          {currentStep === 4 && (
            <div className="step-card">
              <h2 className="step-card-title">4. Review & Confirm Order</h2>
              
              <div className="review-summary-block">
                <div className="review-section">
                  <div className="review-label">Shipping Address</div>
                  <div className="review-val">{shippingInfo.firstName} {shippingInfo.lastName}</div>
                  <div className="review-sub">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</div>
                </div>

                <div className="review-section">
                  <div className="review-label">Delivery Method</div>
                  <div className="review-val">{deliveryMethod === "express" ? "Express Air ($15.00)" : "Standard Ground (Free)"}</div>
                </div>

                <div className="review-section">
                  <div className="review-label">Payment Method</div>
                  <div className="review-val">{paymentMethod === "card" ? "Credit / Debit Card" : paymentMethod === "apple" ? "Apple Pay" : "Cash on Delivery"}</div>
                </div>
              </div>

              <div className="step-btn-row">
                <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft size={18} /> Back
                </button>
                <button className="btn btn-primary place-order-btn" onClick={handlePlaceOrder}>
                  <Lock size={18} /> Place Order (${totalAmount.toFixed(2)})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Side Panel */}
        <aside className="checkout-summary-column">
          <div className="checkout-summary-card">
            <h3 className="summary-card-title">Order Items ({cart.length})</h3>

            <div className="items-list-scroll">
              {cart.map((item) => (
                <div key={item.product.id} className="checkout-item-row">
                  <img src={item.product.image} alt={item.product.title} className="checkout-item-img" />
                  <div className="checkout-item-info">
                    <div className="checkout-item-title">{item.product.title}</div>
                    <div className="checkout-item-qty">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</div>
                  </div>
                  <div className="checkout-item-total">${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="promo-mini">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code"
              />
              <button type="button" onClick={handleApplyPromo}>Apply</button>
            </div>
            {promoMsg && <div className="promo-hint">{promoMsg}</div>}

            <div className="summary-math-divider" />

            <div className="math-row"><span>Subtotal:</span> <strong>${subtotal.toFixed(2)}</strong></div>
            {discountAmount > 0 && (
              <div className="math-row"><span>Discount:</span> <strong>-${discountAmount.toFixed(2)}</strong></div>
            )}
            <div className="math-row"><span>Shipping:</span> <strong>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</strong></div>
            <div className="math-row"><span>Tax (8%):</span> <strong>${estimatedTax.toFixed(2)}</strong></div>

            <div className="summary-math-divider" />

            <div className="math-row total-row"><span>Total Amount:</span> <strong className="total-highlight">${totalAmount.toFixed(2)}</strong></div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .checkout-header {
          margin-bottom: 3rem;
        }

        .steps-indicator-container {
          margin-top: 1.5rem;
        }

        .steps-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          opacity: 0.5;
          transition: all 0.2s ease;
        }

        .step-item.active, .step-item.completed {
          opacity: 1;
        }

        .step-icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #E2E8F0;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .step-item.active .step-icon-circle {
          background: var(--primary);
          color: #FFFFFF;
        }

        .step-item.completed .step-icon-circle {
          background: var(--success);
          color: #FFFFFF;
        }

        .step-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text);
        }

        .progress-bar-track {
          height: 6px;
          background: #E2E8F0;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transition: width 0.4s ease;
        }

        .checkout-grid-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2.5rem;
          align-items: start;
        }

        .step-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid var(--borders);
          padding: 2.25rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .step-card-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text);
        }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .field-group label {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .field-group input {
          height: 48px;
          border-radius: 12px;
          background: var(--background);
          border: 1px solid var(--borders);
          padding: 0 1rem;
          font-size: 0.95rem;
          color: var(--text);
          outline: none;
        }

        .field-group input:focus {
          border-color: var(--primary);
        }

        .options-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .option-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: 14px;
          border: 2px solid var(--borders);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .option-card.selected {
          border-color: var(--primary);
          background: var(--primary-light);
        }

        .option-title { font-size: 1rem; font-weight: 800; color: var(--text); }
        .option-sub { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem; }

        .step-btn-row {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }

        .next-step-btn { margin-top: 1rem; }

        .place-order-btn {
          height: 52px;
          padding: 0 2rem;
          font-size: 1.05rem;
        }

        .review-summary-block {
          background: var(--background);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .review-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); }
        .review-val { font-size: 1rem; font-weight: 800; color: var(--text); }
        .review-sub { font-size: 0.875rem; color: var(--text-muted); }

        .checkout-summary-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid var(--borders);
          padding: 1.75rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 100px;
        }

        .summary-card-title { font-size: 1.2rem; font-weight: 800; color: var(--text); margin-bottom: 1.25rem; }

        .items-list-scroll {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 280px;
          overflow-y: auto;
        }

        .checkout-item-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .checkout-item-img {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          object-fit: cover;
          background: #F8FAFC;
        }

        .checkout-item-info { flex: 1; }
        .checkout-item-title { font-size: 0.85rem; font-weight: 700; color: var(--text); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .checkout-item-qty { font-size: 0.75rem; color: var(--text-muted); }
        .checkout-item-total { font-size: 0.9rem; font-weight: 800; color: var(--text); }

        .promo-mini {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .promo-mini input {
          flex: 1;
          height: 40px;
          border-radius: 8px;
          border: 1px solid var(--borders);
          padding: 0 0.75rem;
        }
        .promo-mini button {
          background: var(--primary);
          color: #fff;
          border-radius: 8px;
          padding: 0 0.9rem;
          font-weight: 700;
        }
        .promo-hint { font-size: 0.78rem; color: var(--success); font-weight: 700; }

        .summary-math-divider { height: 1px; background: var(--borders); margin: 1rem 0; }
        .math-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem; }
        .total-row { font-size: 1.1rem; color: var(--text); font-weight: 800; }
        .total-highlight { font-size: 1.4rem; color: var(--primary); }

        @media (max-width: 1024px) {
          .checkout-grid-layout { grid-template-columns: 1fr; }
          .steps-row { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
