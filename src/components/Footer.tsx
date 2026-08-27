"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import "@/styles/footer.css";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/checkout") {
    return null;
  }

  return (
    <footer className="al-footer">
      <div className="header-container">
        <div className="al-footer-grid-4">
          {/* Column 1: Brand & Tagline */}
          <div className="al-footer-col al-footer-brand-col">
            <Link href="/" className="al-footer-logo">
              Al-Umaima
            </Link>
            <p className="al-footer-tagline">
              Elevating commerce through precision, trust, and premium selection.
            </p>
          </div>

          {/* Column 2: Customer Service */}
          <div className="al-footer-col">
            <h4 className="al-footer-heading">Customer Service</h4>
            <ul className="al-footer-links">
              <li><Link href="/faq">Help Center</Link></li>
              <li><Link href="/faq">Return Policy</Link></li>
              <li><Link href="/faq">2-Year Warranty</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="al-footer-col">
            <h4 className="al-footer-heading">Legal</h4>
            <ul className="al-footer-links">
              <li><Link href="/faq">Terms of Service</Link></li>
              <li><Link href="/faq">Privacy Policy</Link></li>
              <li>
                <Link href="/faq" className="al-footer-secure-link">
                  <Lock size={13} />
                  <span>Secure Payment</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Copyright */}
          <div className="al-footer-col al-footer-copy-col">
            <p className="al-footer-copy-text">
              © 2024 Al-Umaima Commerce. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}