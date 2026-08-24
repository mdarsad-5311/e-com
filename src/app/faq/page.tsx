"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How long does shipping take?",
    a: "Express arrives in 1–2 business days. Standard ground is 3–5 days and free on orders over $100.",
  },
  {
    q: "What is your return policy?",
    a: "You have 30 days from delivery for a full refund. Items should be unused with original packaging.",
  },
  {
    q: "Which promo codes work?",
    a: "Use AURA2026 for 15% off, or WELCOME10 for $10 off your first order.",
  },
  {
    q: "Is checkout secure?",
    a: "Yes. Payments run over 256-bit SSL. We never store full card numbers on this demo storefront.",
  },
  {
    q: "Can I track my package?",
    a: "Yes. Open Track Order and enter your order ID, such as ORD-94821.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="container section">
      <h1 className="section-title">Help Center</h1>
      <p className="section-subtitle">Answers to the questions shoppers ask most.</p>
      <div className="faq-list">
        {FAQS.map((item, idx) => (
          <button
            key={item.q}
            className={`faq-item ${open === idx ? "open" : ""}`}
            onClick={() => setOpen(open === idx ? -1 : idx)}
          >
            <div className="faq-q">
              <span>{item.q}</span>
              <ChevronDown size={18} />
            </div>
            {open === idx && <p className="faq-a">{item.a}</p>}
          </button>
        ))}
      </div>
      <style jsx>{`
        .faq-list {
          margin-top: 1.5rem;
          max-width: 760px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .faq-item {
          text-align: left;
          background: #fff;
          border: 1px solid var(--borders);
          border-radius: 12px;
          padding: 1rem 1.15rem;
        }
        .faq-q {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 800;
          gap: 1rem;
        }
        .faq-a {
          margin-top: 0.7rem;
          font-size: 0.92rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
