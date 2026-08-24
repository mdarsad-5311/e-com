"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected runtime errors to monitoring console
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="error-page-container container section">
      <div className="error-card glass-card">
        <div className="icon-badge">
          <AlertTriangle size={36} className="alert-icon" />
        </div>

        <h1 className="error-heading">Something Went Wrong</h1>
        <p className="error-subtext">
          An unexpected server error occurred while processing your request. We have logged this diagnostic code.
        </p>

        {error.digest && (
          <div className="digest-code-box">
            <span>Diagnostic ID: <strong>{error.digest}</strong></span>
          </div>
        )}

        <div className="actions-row">
          <button onClick={() => reset()} className="btn btn-primary">
            <RotateCcw size={18} /> Try Again
          </button>
          <Link href="/" className="btn btn-secondary">
            <Home size={18} /> Return Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .error-page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }

        .error-card {
          max-width: 580px;
          width: 100%;
          padding: 3.5rem 2.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          background: #151D2F;
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: var(--radius-xl);
        }

        .icon-badge {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid rgba(244, 63, 94, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .alert-icon {
          color: #fb7185;
        }

        .error-heading {
          font-size: 2.2rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .error-subtext {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .digest-code-box {
          font-size: 0.8rem;
          color: var(--text-dim);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.4rem 0.9rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          font-family: monospace;
        }

        .actions-row {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        @media (max-width: 640px) {
          .actions-row {
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
