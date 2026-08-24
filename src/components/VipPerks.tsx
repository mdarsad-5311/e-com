"use client";

import Link from "next/link";
import { ShieldCheck, Truck, Headphones, RefreshCw, Sparkles, ArrowRight } from "lucide-react";
import "@/styles/vip-perks.css";

export default function VipPerks() {
  return (
    <section className="vip-perks-section section">
      <div className="container">
        <div className="vip-perks-card glass-card">
          <div className="vip-perks-header">
            <div className="vip-title-col">
              <span className="vip-badge">
                <Sparkles size={14} /> AL-UMAIMA VIP EXPERIENCE
              </span>
              <h2 className="vip-heading">Why Shoppers Choose Al-Umaima</h2>
              <p className="vip-sub">
                Designed for buyers who demand uncompromised product quality, rapid delivery, and lifetime support.
              </p>
            </div>

            <Link href="/register" className="btn btn-primary vip-join-btn">
              Become a VIP Member <ArrowRight size={16} />
            </Link>
          </div>

          <div className="perks-grid">
            <div className="perk-box">
              <div className="perk-icon-wrapper bg-indigo">
                <Truck size={22} />
              </div>
              <h4 className="perk-title">Worldwide Express Shipping</h4>
              <p className="perk-desc">
                Dispatched within 24 hours with real-time GPS tracking link delivered straight to your phone.
              </p>
            </div>

            <div className="perk-box">
              <div className="perk-icon-wrapper bg-emerald">
                <ShieldCheck size={22} />
              </div>
              <h4 className="perk-title">2-Year Full Coverage Warranty</h4>
              <p className="perk-desc">
                Every tech gadget and audio device comes standard with hassle-free hardware warranty protection.
              </p>
            </div>

            <div className="perk-box">
              <div className="perk-icon-wrapper bg-amber">
                <RefreshCw size={22} />
              </div>
              <h4 className="perk-title">30-Day Money Back Guarantee</h4>
              <p className="perk-desc">
                Try any product risk-free. If you aren&apos;t completely thrilled, return it for a 100% instant refund.
              </p>
            </div>

            <div className="perk-box">
              <div className="perk-icon-wrapper bg-purple">
                <Headphones size={22} />
              </div>
              <h4 className="perk-title">24/7 VIP Priority Support</h4>
              <p className="perk-desc">
                Our concierge team is available round-the-clock via live chat, email, or phone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
