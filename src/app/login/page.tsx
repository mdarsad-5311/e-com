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
  const { login, loginWithOtp, loginAsAdmin } = useAuth();

  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  const [step, setStep] = useState<"input" | "verify_otp">("input");
  const [inputVal, setInputVal] = useState<string>("9876543210");
  const [password, setPassword] = useState<string>("password123");
  const [otpDigits, setOtpDigits] = useState<string[]>(["1", "2", "3", "4", "5", "6"]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getRedirectTarget = (isAdmin: boolean) => {
    if (isAdmin) return "/admin";
    return redirectUrl;
  };

  const handleRequestOtp = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inputVal.trim()) {
      setError("Please enter a valid Mobile number or Email address.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify_otp");
    }, 600);
  };

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otpDigits.join("");

    if (code.length < 6) {
      setError("Please enter complete 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = loginWithOtp(inputVal, code);
      setIsLoading(false);
      if (success) {
        router.push(getRedirectTarget(inputVal.includes("admin")));
      } else {
        setError("Invalid OTP entered. (Use 123456)");
      }
    }, 700);
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

  const handleDemoUser = () => {
    setInputVal("testuser@example.com");
    setPassword("TestPassword123!");
  };

  const handleDemoAdmin = () => {
    setInputVal("admin@al-umaima.com");
    setPassword("AdminPassword123!");
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

          {/* Mode Switch: OTP vs Password */}
          {step === "input" && (
            <form 
              onSubmit={authMode === "otp" ? handleRequestOtp : handlePasswordLogin}
              className="al-umaima-auth-form"
            >
              <div className="al-umaima-input-group">
                <label htmlFor="login-identity-input" className="al-umaima-label">Enter Email / Mobile number</label>
                <input
                  id="login-identity-input"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  className="al-umaima-input"
                  placeholder="e.g. 9876543210 or user@example.com"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  required
                />
              </div>

              {authMode === "password" && (
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
              )}

              <p className="al-umaima-terms-text">
                By continuing, you agree to Al-Umaima&apos;s{" "}
                <Link href="/faq">Terms of Use</Link> and{" "}
                <Link href="/faq">Privacy Policy</Link>.
              </p>

              {authMode === "otp" ? (
                <button type="submit" className="al-umaima-btn-orange" disabled={isLoading}>
                  {isLoading ? "REQUESTING OTP..." : "REQUEST OTP"}
                </button>
              ) : (
                <button type="submit" className="al-umaima-btn-orange" disabled={isLoading}>
                  {isLoading ? "LOGGING IN..." : "LOGIN"}
                </button>
              )}

              {authMode === "otp" ? (
                <button
                  type="button"
                  className="al-umaima-btn-blue-outline"
                  onClick={() => setAuthMode("password")}
                >
                  LOGIN WITH PASSWORD
                </button>
              ) : (
                <button
                  type="button"
                  className="al-umaima-btn-blue-outline"
                  onClick={() => setAuthMode("otp")}
                >
                  REQUEST OTP INSTEAD
                </button>
              )}
            </form>
          )}

          {/* OTP Verification Step */}
          {step === "verify_otp" && (
            <form onSubmit={handleVerifyOtp} className="al-umaima-auth-form">
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>
                  Please enter the OTP sent to
                </h3>
                <div style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 700, marginTop: "0.2rem" }}>
                  {inputVal}{" "}
                  <button
                    type="button"
                    onClick={() => setStep("input")}
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "underline", marginLeft: "0.5rem", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="otp-box-group" role="group" aria-label="6-digit verification code">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-field-${idx}`}
                    name={`otp-digit-${idx}`}
                    aria-label={`Digit ${idx + 1} of 6`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="otp-digit-input"
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = [...otpDigits];
                      updated[idx] = val;
                      setOtpDigits(updated);
                      if (val && idx < 5) {
                        const nextField = document.getElementById(`otp-field-${idx + 1}`);
                        nextField?.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <p className="otp-timer-text">Demo OTP auto-filled: <strong>123456</strong></p>

              <button type="submit" className="al-umaima-btn-orange" disabled={isLoading}>
                {isLoading ? "VERIFYING..." : "VERIFY & LOGIN"}
              </button>

              <button
                type="button"
                className="al-umaima-btn-blue-outline"
                onClick={() => setStep("input")}
              >
                BACK TO LOGIN
              </button>
            </form>
          )}

          {/* Quick Demo Login Presets */}
          <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--borders)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.5rem" }}>
              QUICK DEMO ACCESS:
            </div>
            <div className="al-umaima-quick-logins">
              <button type="button" onClick={handleDemoUser} className="al-umaima-quick-btn">
                <UserCheck size={14} /> Demo Customer Login
              </button>
              <button type="button" onClick={handleDemoAdmin} className="al-umaima-quick-btn" style={{ color: "var(--secondary)" }}>
                <Shield size={14} /> Demo Admin Panel Login
              </button>
            </div>
          </div>

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

