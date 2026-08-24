"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  UserCheck,
  Shield
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithOtp, loginAsAdmin } = useAuth();

  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  const [step, setStep] = useState<"input" | "verify_otp">("input");
  const [inputVal, setInputVal] = useState<string>("9876543210");
  const [password, setPassword] = useState<string>("password123");
  const [otpDigits, setOtpDigits] = useState<string[]>(["1", "2", "3", "4", "5", "6"]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        router.push(inputVal.includes("admin") ? "/admin" : "/profile");
      } else {
        setError("Invalid OTP entered. (Use 123456)");
      }
    }, 700);
  };

  const handlePasswordLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inputVal.trim() || !password) {
      setError("Please fill out all credentials.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(inputVal, password);
      setIsLoading(false);
      if (success) {
        router.push(inputVal.toLowerCase().includes("admin") ? "/admin" : "/profile");
      } else {
        setError("Invalid login credentials. Try demo logins below.");
      }
    }, 700);
  };

  const handleDemoUser = () => {
    setInputVal("alexander.vance@example.com");
    setPassword("password123");
    login("alexander.vance@example.com", "password123");
    router.push("/profile");
  };

  const handleDemoAdmin = () => {
    loginAsAdmin();
    router.push("/admin");
  };

  return (
    <div className="auth-page-wrapper">
          <div className="flipkart-auth-card">
            {/* Left Blue Flipkart Banner */}
            <div className="flipkart-auth-left">
              <div>
                <div className="flipkart-badge-pill">
                  <ShieldCheck size={14} /> FLIPKART SECURE AUTH
                </div>
                <h2 className="flipkart-left-title">Login</h2>
                <p className="flipkart-left-sub">
                  Get access to your Orders, Wishlist and Recommendations
                </p>
              </div>

              <div className="flipkart-left-illustration">
                <ShoppingBag size={120} strokeWidth={1} style={{ opacity: 0.8 }} />
              </div>
            </div>

            {/* Right Flipkart White Form Section */}
            <div className="flipkart-auth-right">
              {error && (
                <div className="auth-error-alert" style={{ marginBottom: "1rem" }}>
                  {error}
                </div>
              )}

              {/* Mode Switch: OTP vs Password */}
              {step === "input" && (
                <form 
                  onSubmit={authMode === "otp" ? handleRequestOtp : handlePasswordLogin}
                  className="flipkart-auth-form"
                >
                  <div className="flipkart-input-group">
                    <label className="flipkart-label">Enter Email / Mobile number</label>
                    <input
                      type="text"
                      className="flipkart-input"
                      placeholder="e.g. 9876543210 or user@example.com"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      required
                    />
                  </div>

                  {authMode === "password" && (
                    <div className="flipkart-input-group" style={{ marginTop: "0.5rem" }}>
                      <label className="flipkart-label">Enter Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="flipkart-input"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: "absolute", right: 8, top: 10, color: "#878787" }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="flipkart-terms-text">
                    By continuing, you agree to Flipkart&apos;s{" "}
                    <Link href="/faq">Terms of Use</Link> and{" "}
                    <Link href="/faq">Privacy Policy</Link>.
                  </p>

                  {authMode === "otp" ? (
                    <button type="submit" className="flipkart-btn-orange" disabled={isLoading}>
                      {isLoading ? "REQUESTING OTP..." : "REQUEST OTP"}
                    </button>
                  ) : (
                    <button type="submit" className="flipkart-btn-orange" disabled={isLoading}>
                      {isLoading ? "LOGGING IN..." : "LOGIN"}
                    </button>
                  )}

                  {authMode === "otp" ? (
                    <button
                      type="button"
                      className="flipkart-btn-blue-outline"
                      onClick={() => setAuthMode("password")}
                    >
                      LOGIN WITH PASSWORD
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flipkart-btn-blue-outline"
                      onClick={() => setAuthMode("otp")}
                    >
                      REQUEST OTP INSTEAD
                    </button>
                  )}
                </form>
              )}

              {/* OTP Verification Step */}
              {step === "verify_otp" && (
                <form onSubmit={handleVerifyOtp} className="flipkart-auth-form">
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#212121" }}>
                      Please enter the OTP sent to
                    </h3>
                    <div style={{ fontSize: "0.9rem", color: "#2874F0", fontWeight: 700, marginTop: "0.2rem" }}>
                      {inputVal}{" "}
                      <button
                        type="button"
                        onClick={() => setStep("input")}
                        style={{ fontSize: "0.75rem", color: "#878787", textDecoration: "underline", marginLeft: "0.5rem" }}
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="otp-box-group">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-field-${idx}`}
                        type="text"
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

                  <button type="submit" className="flipkart-btn-orange" disabled={isLoading}>
                    {isLoading ? "VERIFYING..." : "VERIFY & LOGIN"}
                  </button>

                  <button
                    type="button"
                    className="flipkart-btn-blue-outline"
                    onClick={() => setStep("input")}
                  >
                    BACK TO LOGIN
                  </button>
                </form>
              )}

              {/* Quick Demo Login Presets */}
              <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #E0E0E0" }}>
                <div style={{ fontSize: "0.75rem", color: "#878787", fontWeight: 700, marginBottom: "0.5rem" }}>
                  QUICK DEMO ACCESSS:
                </div>
                <div className="flipkart-quick-logins">
                  <button type="button" onClick={handleDemoUser} className="flipkart-quick-btn">
                    <UserCheck size={14} /> Demo Customer Login
                  </button>
                  <button type="button" onClick={handleDemoAdmin} className="flipkart-quick-btn" style={{ color: "#E5530B" }}>
                    <Shield size={14} /> Demo Admin Panel Login
                  </button>
                </div>
              </div>

              {/* Footer Register Link */}
              <div className="flipkart-create-account-footer">
                <Link href="/register" className="flipkart-create-link">
                  New to Flipkart? Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
  );
}
