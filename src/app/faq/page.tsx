"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  Mail, 
  MessageSquare, 
  PhoneCall 
} from "lucide-react";
import "@/styles/faq.css";

const supportCategories = [
  {
    id: "track-order",
    title: "Track Order",
    icon: Truck,
    link: "/track-order",
  },
  {
    id: "return-policy",
    title: "Return Policy",
    icon: RotateCcw,
    link: "#return-policy",
  },
  {
    id: "warranty-info",
    title: "Warranty Info",
    icon: ShieldCheck,
    link: "#warranty-info",
  },
  {
    id: "shipping-faq",
    title: "Shipping FAQ",
    icon: HelpCircle,
    link: "#shipping-faq",
  },
];

const allFaqs = [
  { 
    category: "shipping", 
    q: "How fast is express delivery?", 
    a: "Express air shipping arrives within 1-2 business days with live driver tracking and SMS dispatch notifications worldwide." 
  },
  { 
    category: "shipping", 
    q: "Do you offer free shipping?", 
    a: "Yes! All orders over $50 automatically qualify for free standard shipping. Prime members receive free priority 1-day delivery on all eligible orders." 
  },
  { 
    category: "returns", 
    q: "What is your return and refund policy?", 
    a: "We offer a 30-day hassle-free return guarantee. Returns are completely free with our prepaid courier label, and refunds are processed within 3-5 business days of inspection." 
  },
  { 
    category: "warranty", 
    q: "Are products authentic and backed by manufacturer warranty?", 
    a: "100% yes. Every item is manufacturer-sealed with verified serial numbers and comes with our complimentary 2-year Al-Umaima Assured protection plan." 
  },
  { 
    category: "orders", 
    q: "Which payment options do you support?", 
    a: "We support Visa, Mastercard, American Express, Apple Pay, Google Pay, UPI / QR codes, Net Banking, and Cash on Delivery (COD) in select regions." 
  },
  { 
    category: "orders", 
    q: "Can I modify or cancel my order after placing it?", 
    a: "Orders can be modified or canceled within 1 hour of placement from your Profile > Orders dashboard before fulfillment begins." 
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return allFaqs;
    const q = searchQuery.toLowerCase();
    return allFaqs.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.category.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="al-support-page-wrapper">
      {/* 1. HERO BANNER (Dark Geometric Pattern Shader) */}
      <section className="al-support-hero">
        <div className="header-container">
          <div className="al-support-hero-content">
            <h1 className="al-support-hero-title">How can we help you?</h1>
            <p className="al-support-hero-subtitle">
              Search our knowledge base or browse categories below.
            </p>

            {/* Floating Search Bar matching Attachment 4 */}
            <div className="al-support-search-wrap">
              <div className="al-support-search-bar">
                <Search size={18} className="al-support-search-icon" />
                <input
                  type="text"
                  placeholder="Search for articles, tracking, returns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="al-support-search-input"
                  aria-label="Search support articles"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 QUICK ACTION SUPPORT CARDS (Attachment 4) */}
      <section className="al-support-cards-section">
        <div className="header-container">
          <div className="al-support-cards-grid">
            {supportCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={cat.link}
                  className="al-support-card-item"
                  onClick={() => {
                    if (cat.id === "return-policy") setSearchQuery("return");
                    if (cat.id === "warranty-info") setSearchQuery("warranty");
                    if (cat.id === "shipping-faq") setSearchQuery("shipping");
                  }}
                >
                  <div className="al-support-card-icon-wrap">
                    <IconComp size={28} strokeWidth={1.8} />
                  </div>
                  <span className="al-support-card-label">{cat.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section className="al-support-faqs-section">
        <div className="header-container">
          <div className="al-faq-container">
            <h2 className="al-faq-section-title">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Frequently Asked Questions"}
            </h2>
            <p className="al-faq-section-subtitle">
              {searchQuery ? `Found ${filteredFaqs.length} matching answers` : "Quick answers to help you with your orders and shopping experience."}
            </p>

            <div className="al-faq-items-list">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`al-faq-accordion-card ${isOpen ? "open" : ""}`}
                    >
                      <button
                        type="button"
                        className="al-faq-btn-trigger"
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                      >
                        <span className="al-faq-q-text">{item.q}</span>
                        <ChevronDown size={18} className="al-faq-chevron" />
                      </button>
                      {isOpen && (
                        <div className="al-faq-answer-body">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                  <p>No matching questions found. Contact our support team below for immediate help.</p>
                </div>
              )}
            </div>

            {/* 4. CONTACT SUPPORT */}
            <div className="al-support-contact-box">
              <h3 className="al-contact-box-title">Still have questions?</h3>
              <p className="al-contact-box-desc">
                Our customer experience team is available 24/7 to assist you.
              </p>
              <div className="al-contact-methods-row">
                <a href="mailto:support@al-umaima.com" className="al-btn-contact-action">
                  <Mail size={16} />
                  <span>Email Support</span>
                </a>
                <button type="button" className="al-btn-contact-action" onClick={() => alert("Live chat connecting with an agent...")}>
                  <MessageSquare size={16} />
                  <span>Live Chat</span>
                </button>
                <a href="tel:+18005550199" className="al-btn-contact-action">
                  <PhoneCall size={16} />
                  <span>+1 (800) 555-0199</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
