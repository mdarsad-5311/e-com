"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Mail, Send, ShieldCheck, RefreshCw, CreditCard, Check } from "lucide-react";
import "@/styles/footer.css";

export default function Footer() {
  const [email, setEmail] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer-dark-root">
      {/* Top Value Assurance Bar */}
      <div className="value-bar">
        <div className="container value-grid">
          <div className="value-item">
            <ShieldCheck size={22} className="value-icon" />
            <div>
              <div className="value-title">100% Secure Payment</div>
              <div className="value-desc">256-Bit SSL Encryption</div>
            </div>
          </div>

          <div className="value-item">
            <RefreshCw size={22} className="value-icon" />
            <div>
              <div className="value-title">30-Day Money Back</div>
              <div className="value-desc">Hassle-free return policy</div>
            </div>
          </div>

          <div className="value-item">
            <CreditCard size={22} className="value-icon" />
            <div>
              <div className="value-title">Express Payment</div>
              <div className="value-desc">Apple Pay, Visa & PayPal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Content */}
      <div className="container footer-main">
        <div className="footer-grid-4">
          {/* Column 1: Company Info & Socials */}
          <div className="footer-col">
            <Link href="/" className="footer-brand">
              <div className="logo-box">
                <span className="logo-letter">a</span>
              </div>
              <span className="brand-name">al-umaima</span>
            </Link>

            <p className="company-desc">
              Al-Umaima is your one-stop online shopping destination for top electronics, fashion, smart home appliances, beauty, toys, and daily essentials.
            </p>

            <div className="social-pills-row">
              {["FB", "IG", "X", "YT", "LI"].map((net) => (
                <a key={net} href="#" className="social-pill" aria-label={net}>
                  {net}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="footer-col">
            <h4 className="col-title">Top Categories</h4>
            <Link href="/category/electronics" className="footer-link">Mobiles & Electronics</Link>
            <Link href="/category/fashion" className="footer-link">Fashion & Apparel</Link>
            <Link href="/category/home-living" className="footer-link">Home & Kitchen Furniture</Link>
            <Link href="/category/accessories" className="footer-link">Beauty, Toys & Accessories</Link>
            <Link href="/products?featured=true" className="footer-link">Al-Umaima Deals ⚡</Link>
          </div>

          {/* Column 3: Customer Support */}
          <div className="footer-col">
            <h4 className="col-title">Customer Care</h4>
            <Link href="/faq" className="footer-link">Help Center & 24x7 Support</Link>
            <Link href="/track-order" className="footer-link">Track Order Status</Link>
            <a href="#" className="footer-link">Cancellation & Returns</a>
            <a href="#" className="footer-link">Shipping Rates & Policy</a>
            <a href="#" className="footer-link">E-Waste Compliance</a>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col">
            <h4 className="col-title">Stay Connected</h4>
            <p className="newsletter-info">Subscribe to receive instant deal updates, sale alerts, and promo codes.</p>

            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-rel">
                <Mail size={16} className="mail-icon" />
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="send-btn" aria-label="Subscribe">
                  {subscribed ? <Check size={15} /> : <Send size={15} />}
                </button>
              </div>
              {subscribed && (
                <span className="sub-success">✓ Subscribed to Al-Umaima deals!</span>
              )}
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div className="copyright font-sub">
            © {new Date().getFullYear()} Al-Umaima Internet Private Limited. All rights reserved.
          </div>
          <div className="payment-tags-list">
            <span className="pay-tag">VISA</span>
            <span className="pay-tag">MASTERCARD</span>
            <span className="pay-tag">NETBANKING</span>
            <span className="pay-tag">UPI</span>
            <span className="pay-tag">CASH ON DELIVERY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}