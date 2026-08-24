"use client";

import Link from "next/link";
import { Search, Home, ArrowLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found-container container section">
      <div className="not-found-card glass-card">
        <div className="error-badge-wrapper">
          <span className="error-code-pill">ERROR 404</span>
        </div>

        <h1 className="error-title">Page Not Found</h1>
        <p className="error-description">
          The product, category, or page you are searching for might have been moved, renamed, or is temporarily unavailable.
        </p>

        <div className="error-actions-group">
          <Link href="/products" className="btn btn-primary">
            <Search size={18} /> Browse Product Catalog
          </Link>
          <Link href="/" className="btn btn-secondary">
            <Home size={18} /> Return to Homepage
          </Link>
        </div>

        <div className="quick-links-section">
          <span className="quick-links-label">Popular Destinations:</span>
          <div className="quick-links-row">
            <Link href="/category/electronics" className="quick-chip">Electronics</Link>
            <Link href="/category/fashion" className="quick-chip">Fashion</Link>
            <Link href="/cart" className="quick-chip">Cart</Link>
            <Link href="/profile" className="quick-chip">My Account</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .not-found-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }

        .not-found-card {
          max-width: 620px;
          width: 100%;
          padding: 3.5rem 2.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          background: #151D2F;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
        }

        .error-badge-wrapper {
          margin-bottom: 0.5rem;
        }

        .error-code-pill {
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid rgba(244, 63, 94, 0.35);
          color: #fb7185;
          font-size: 0.82rem;
          font-weight: 800;
          padding: 0.35rem 0.9rem;
          border-radius: var(--radius-full);
          letter-spacing: 0.08em;
        }

        .error-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .error-description {
          font-size: 1rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 480px;
        }

        .error-actions-group {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .quick-links-section {
          margin-top: 2rem;
          padding-top: 1.8rem;
          border-top: 1px solid var(--border-subtle);
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .quick-links-label {
          font-size: 0.8rem;
          color: var(--text-dim);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .quick-links-row {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .quick-chip {
          font-size: 0.82rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          transition: var(--transition);
        }

        .quick-chip:hover {
          background: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }

        @media (max-width: 640px) {
          .not-found-card {
            padding: 2.5rem 1.5rem;
          }
          .error-title {
            font-size: 1.8rem;
          }
          .error-actions-group {
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
