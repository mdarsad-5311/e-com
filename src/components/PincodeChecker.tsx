"use client";

import { useState } from "react";
import { MapPin, CheckCircle2, Truck, RefreshCw, XCircle } from "lucide-react";
import "@/styles/pincode-checker.css";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [deliveryInfo, setDeliveryInfo] = useState<{ date: string; fee: string; cod: boolean } | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length < 3) return;

    setStatus("checking");

    // Simulate instant delivery calculation (Tomorrow or 2 business days)
    setTimeout(() => {
      if (cleanPin === "00000" || cleanPin === "99999") {
        setStatus("unavailable");
        setDeliveryInfo(null);
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDate = tomorrow.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        setStatus("available");
        setDeliveryInfo({
          date: `Tomorrow, ${formattedDate} by 9:00 PM`,
          fee: "FREE Express Delivery",
          cod: true,
        });
      }
    }, 450);
  };

  return (
    <div className="al-pincode-checker-card">
      <div className="al-pincode-header">
        <MapPin size={16} className="al-pin-icon" />
        <span className="al-pin-title">Delivery & Availability</span>
      </div>

      <form onSubmit={handleCheck} className="al-pincode-form">
        <div className="al-pincode-input-wrap">
          <input
            type="text"
            placeholder="Enter Zip / Postal Code"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="al-pincode-input"
            maxLength={10}
            aria-label="Enter zip or postal code for delivery estimation"
          />
        </div>
        <button
          type="submit"
          className="al-pincode-btn"
          disabled={status === "checking"}
        >
          {status === "checking" ? (
            <RefreshCw size={14} className="al-spin-icon" />
          ) : (
            "Check"
          )}
        </button>
      </form>

      {/* Result feedback */}
      {status === "available" && deliveryInfo && (
        <div className="al-pincode-result-success">
          <div className="al-pin-result-row">
            <CheckCircle2 size={15} className="al-icon-success" />
            <span>Delivery to <strong>{pincode}</strong>: Expected <strong>{deliveryInfo.date}</strong></span>
          </div>
          <div className="al-pin-sub-details">
            <span className="al-pin-free-tag">✓ {deliveryInfo.fee}</span>
            <span className="al-pin-cod-tag">✓ Cash on Delivery Available</span>
          </div>
        </div>
      )}

      {status === "unavailable" && (
        <div className="al-pincode-result-error">
          <XCircle size={15} className="al-icon-error" />
          <span>Sorry, express delivery is currently unavailable for postal code <strong>{pincode}</strong>.</span>
        </div>
      )}
    </div>
  );
}
