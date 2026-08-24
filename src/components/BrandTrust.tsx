"use client";

import { Truck, ShieldCheck, Award, RotateCcw } from "lucide-react";
import "@/styles/brand-trust.css";

const TRUST_FEATURES = [
  { icon: Truck, label: "Free Express Shipping" },
  { icon: ShieldCheck, label: "2-Year Warranty" },
  { icon: Award, label: "Top Quality Gear" },
  { icon: RotateCcw, label: "30-day returns" },
];

export default function BrandTrust() {
  return (
    <section className="al-trust-bar">
      <div className="header-container">
        <div className="al-trust-grid">
          {TRUST_FEATURES.map((item) => {
            const IconComp = item.icon;
            return (
              <div key={item.label} className="al-trust-item">
                <IconComp size={19} className="al-trust-icon" />
                <span className="al-trust-label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
