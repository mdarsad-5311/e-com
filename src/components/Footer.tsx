"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
          {/* Column 1: Brand Info */}
          <div className="al-footer-col">
            <Link href="/" className="al-footer-logo">
              AL-UMAIMA
            </Link>
            <p className="al-footer-tagline">
              Premium Electronics & Lifestyle.<br />
              Upgrade your everyday.
            </p>
          </div>

          {/* Column 2: Navigation 1 */}
          <div className="al-footer-col">
            <ul className="al-footer-links">
              <li><Link href="/faq">About Us</Link></li>
              <li><Link href="/faq">Shipping Policy</Link></li>
              <li><Link href="/faq">Returns</Link></li>
            </ul>
          </div>

          {/* Column 3: Navigation 2 */}
          <div className="al-footer-col">
            <ul className="al-footer-links">
              <li><Link href="/faq">Privacy Policy</Link></li>
              <li><Link href="/faq">Contact Us</Link></li>
              <li><Link href="/faq" className="al-assured-footer-link">Al-Umaima Assured</Link></li>
            </ul>
          </div>

          {/* Column 4: Copyright */}
          <div className="al-footer-col al-footer-copy-col">
            <p className="al-footer-copy-text">
              © 2024 Al-Umaima Premium Electronics.<br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}