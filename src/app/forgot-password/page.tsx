"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Mail, KeyRound, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      forgotPassword(email);
      setIsLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-container container section">
        <div className="auth-card">
          {/* Brand Header */}
          <div className="auth-header">
            <div className="logo-box">
              <KeyRound size={22} />
            </div>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">
              Enter your email address and we&apos;ll send you a password reset link
            </p>
          </div>

          {submitted ? (
            <div className="success-banner">
              <CheckCircle size={32} className="success-icon" />
              <h3 className="success-title">Reset Link Sent!</h3>
              <p className="success-desc">
                We&apos;ve sent a password reset email to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-secondary resend-btn"
              >
                Resend Link
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Registered Email</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
                {isLoading ? <>Sending Link...</> : <>Send Password Reset Link</>}
              </button>
            </form>
          )}

          <div className="auth-footer-link">
            <Link href="/login" className="highlight-link">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
