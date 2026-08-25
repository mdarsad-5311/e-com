"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "@/styles/faq.css";

const faqs = [
  { q: "How fast is express delivery?", a: "Express air shipping arrives within 1-2 business days with live driver tracking in Dubai and worldwide." },
  { q: "What is your return policy?", a: "We offer a 30-day no-questions-asked return policy with prepaid shipping labels." },
  { q: "Are products authentic and backed by warranty?", a: "100% yes. Every item is manufacturer-sealed with valid serial numbers and full warranty coverage." },
  { q: "Which payment options do you support?", a: "We support Visa, Mastercard, Apple Pay, Google Pay, Tabby, Tamara, and cash on delivery in select regions." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="container section">
      <h1 className="section-title">Frequently Asked Questions</h1>
      <p className="section-subtitle">Find quick answers to common questions about orders, shipping, and returns.</p>

      <div className="faq-list">
        {faqs.map((item, idx) => (
          <button
            key={idx}
            type="button"
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
    </div>
  );
}
