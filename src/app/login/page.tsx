"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ShoppingBag, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  UserCheck,
  Shield
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sanitizeRedirect } from "@/lib/security";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirectUrl = searchParams.get("redirect") || searchParams.get("callbackUrl");
  const redirectUrl = sanitizeRedirect(rawRedirectUrl);
  const { login } = useAuth();

  const [inputVal, setInputVal] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getRedirectTarget = (isAdmin: boolean) => {
    if (isAdmin) return "/admin";
    return redirectUrl;
  };

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedInput = inputVal.trim();
    if (!trimmedInput || !password) {
      setError("Please fill out all credentials.");
      return;
    }

    // Django authentication uses email
    if (!trimmedInput.includes("@")) {
      setError("Login requires your registered email address. Please enter a valid email.");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(trimmedInput, password);
      if (success) {
        router.push(getRedirectTarget(trimmedInput.toLowerCase().includes("admin")));
      }
    } catch (err: any) {
      const msg =
        err?.data?.detail ||
        err?.message ||
        "Invalid email or password. Please check your credentials and try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="al-umaima-auth-card">
        {/* Left Blue Banner */}
        <div className="al-umaima-auth-left">
          <div>
            <div className="al-umaima-badge-pill">
              <ShieldCheck size={14} /> AL-UMAIMA SECURE AUTH
            </div>
            <h2 className="al-umaima-left-title">Login</h2>
            <p className="al-umaima-left-sub">
              Get access to your Orders, Wishlist and Recommendations
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

          <form 
            onSubmit={handlePasswordLogin}
            className="al-umaima-auth-form"
          >
            <div className="al-umaima-input-group">
              <label htmlFor="login-identity-input" className="al-umaima-label">Enter Email address</label>
              <input
                id="login-identity-input"
                name="identifier"
                type="email"
                autoComplete="username"
                className="al-umaima-input"
                placeholder="e.g. user@example.com"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                required
              />
            </div>

            <div className="al-umaima-input-group" style={{ marginTop: "0.5rem" }}>
              <label htmlFor="login-password-input" className="al-umaima-label">Enter Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="al-umaima-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </form>

          {/* Footer Register Link */}
          <div className="al-umaima-create-account-footer">
            <Link href={redirectUrl !== "/profile" ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"} className="al-umaima-create-link">
              New to Al-Umaima? Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page-wrapper" style={{ padding: "4rem 0", textAlign: "center" }}>Loading secure login...</div>}>
      <LoginContent />
    </Suspense>
  );
}

