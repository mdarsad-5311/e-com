"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ShoppingBag, 
  ShieldCheck, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sanitizeRedirect } from "@/lib/security";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirectUrl = searchParams.get("redirect") || searchParams.get("callbackUrl");
  const redirectUrl = sanitizeRedirect(rawRedirectUrl);
  const { register } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your Full Name.");
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setError("Please enter either Mobile number or Email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = register(name, email, phone, password);
      setIsLoading(false);
      if (success) {
        router.push(redirectUrl);
      } else {
        setError("Failed to create account. Please try again.");
      }
    }, 700);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="al-umaima-auth-card">
        {/* Left Blue Banner */}
        <div className="al-umaima-auth-left">
          <div>
            <div className="al-umaima-badge-pill">
              <ShieldCheck size={14} /> AL-UMAIMA SIGN UP
            </div>
            <h2 className="al-umaima-left-title">Looks like you&apos;re new here!</h2>
            <p className="al-umaima-left-sub">
              Sign up with your mobile number or email to get started with Al-Umaima
            </p>
          </div>

          <div className="al-umaima-left-illustration">
            <ShoppingBag size={120} strokeWidth={1} style={{ opacity: 0.8 }} />
          </div>
        </div>

        {/* Right Form Section */}
        <div className="al-umaima-auth-right">
          {error && (
            <div className="auth-error-alert" role="alert" style={{ marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="al-umaima-auth-form">
            <div className="al-umaima-input-group">
              <label htmlFor="reg-name-input" className="al-umaima-label">Full Name</label>
              <input
                id="reg-name-input"
                name="name"
                type="text"
                autoComplete="name"
                className="al-umaima-input"
                placeholder="Enter your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="al-umaima-input-group">
              <label htmlFor="reg-phone-input" className="al-umaima-label">Mobile Number</label>
              <input
                id="reg-phone-input"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="al-umaima-input"
                placeholder="10-digit Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
              />
            </div>

            <div className="al-umaima-input-group">
              <label htmlFor="reg-email-input" className="al-umaima-label">Email Address (Optional)</label>
              <input
                id="reg-email-input"
                name="email"
                type="email"
                autoComplete="email"
                className="al-umaima-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="al-umaima-input-group">
              <label htmlFor="reg-password-input" className="al-umaima-label">Set Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="reg-password-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="al-umaima-input"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 8, top: 10, color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <p className="al-umaima-terms-text">
              By continuing, you agree to Al-Umaima&apos;s{" "}
              <Link href="/faq">Terms of Use</Link> and{" "}
              <Link href="/faq">Privacy Policy</Link>.
            </p>

            <button type="submit" className="al-umaima-btn-orange" disabled={isLoading}>
              {isLoading ? "CREATING ACCOUNT..." : "CONTINUE & REGISTER"}
            </button>

            <Link href={redirectUrl !== "/profile" ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"} className="al-umaima-btn-blue-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              EXISTING USER? LOG IN
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="auth-page-wrapper" style={{ padding: "4rem 0", textAlign: "center" }}>Loading register...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

