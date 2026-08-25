"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Share2, ThumbsUp, Mail } from "lucide-react";
import "@/styles/footer.css";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/checkout") {
    return null;
  }

  if (pathname === "/cart") {
    return (
      <footer className="al-cart-secure-footer">
        <div className="header-container al-cart-footer-inner">
          <p className="al-cart-copy-text">
            © 2026 Al-Umaima Internet Private Limited. All rights reserved.
          </p>
          <div className="al-cart-payment-methods">
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>APPLE PAY</span>
            <span>PAYPAL</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="al-footer">
      <div className="header-container">
        {/* Main 4-Column Footer Grid */}
        <div className="al-footer-grid">
          {/* Column 1: About Al-Umaima */}
          <div className="al-footer-col">
            <h4 className="al-footer-heading">About Al-Umaima</h4>
            <ul className="al-footer-links">
              <li><Link href="/faq">About Us</Link></li>
              <li><Link href="/faq">Careers</Link></li>
              <li><Link href="/faq">Press Releases</Link></li>
              <li><Link href="/faq">Al-Umaima Assured</Link></li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div className="al-footer-col">
            <h4 className="al-footer-heading">Help</h4>
            <ul className="al-footer-links">
              <li><Link href="/faq">Payments</Link></li>
              <li><Link href="/faq">Shipping</Link></li>
              <li><Link href="/orders">Cancellation & Returns</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Policy */}
          <div className="al-footer-col">
            <h4 className="al-footer-heading">Policy</h4>
            <ul className="al-footer-links">
              <li><Link href="/faq">Return Policy</Link></li>
              <li><Link href="/faq">Terms of Use</Link></li>
              <li><Link href="/faq">Security</Link></li>
              <li><Link href="/faq">Privacy</Link></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div className="al-footer-col">
            <h4 className="al-footer-heading">Social</h4>
            <div className="al-social-icons-row">
              <button type="button" className="social-icon-btn" aria-label="Share" title="Share">
                <Share2 size={18} />
              </button>
              <button type="button" className="social-icon-btn" aria-label="Like" title="Like">
                <ThumbsUp size={18} />
              </button>
              <button type="button" className="social-icon-btn" aria-label="Email" title="Email">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Logo on Left, Copyright on Right */}
        <div className="al-footer-bottom">
          <Link href="/" className="al-footer-brand-logo">
            Al-Umaima
          </Link>

          <div className="al-footer-copy">
            © 2026 Al-Umaima Internet Private Limited. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}