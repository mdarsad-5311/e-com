"use client";

import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react";
import "@/styles/brand-trust.css";

const PERKS = [
  { icon: Truck, title: "Free shipping over $100", sub: "Express worldwide delivery" },
  { icon: RefreshCw, title: "30-day returns", sub: "No questions asked" },
  { icon: ShieldCheck, title: "2-year warranty", sub: "Official brand coverage" },
  { icon: Headphones, title: "24/7 support", sub: "Live chat & email" },
];

export default function BrandTrust() {
  return (
    <section className="trust-strip">
      <div className="container trust-grid">
        {PERKS.map((perk) => (
          <div key={perk.title} className="trust-item">
            <perk.icon size={22} />
            <div>
              <strong>{perk.title}</strong>
              <span>{perk.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
