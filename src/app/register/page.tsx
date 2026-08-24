"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
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
        router.push("/profile");
      } else {
        setError("Failed to create account. Please try again.");
      }
    }, 700);
  };

  return (
    <div className="auth-page-wrapper">
          <div className="flipkart-auth-card">
            {/* Left Blue Flipkart Banner */}
            <div className="flipkart-auth-left">
              <div>
                <div className="flipkart-badge-pill">
                  <ShieldCheck size={14} /> FLIPKART SIGN UP
                </div>
                <h2 className="flipkart-left-title">Looks like you&apos;re new here!</h2>
                <p className="flipkart-left-sub">
                  Sign up with your mobile number or email to get started with Flipkart
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

              <form onSubmit={handleSubmit} className="flipkart-auth-form">
                <div className="flipkart-input-group">
                  <label className="flipkart-label">Full Name</label>
                  <input
                    type="text"
                    className="flipkart-input"
                    placeholder="Enter your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="flipkart-input-group">
                  <label className="flipkart-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="flipkart-input"
                    placeholder="10-digit Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    maxLength={10}
                  />
                </div>

                <div className="flipkart-input-group">
                  <label className="flipkart-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    className="flipkart-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flipkart-input-group">
                  <label className="flipkart-label">Set Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="flipkart-input"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
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

                <p className="flipkart-terms-text">
                  By continuing, you agree to Flipkart&apos;s{" "}
                  <Link href="/faq">Terms of Use</Link> and{" "}
                  <Link href="/faq">Privacy Policy</Link>.
                </p>

                <button type="submit" className="flipkart-btn-orange" disabled={isLoading}>
                  {isLoading ? "CREATING ACCOUNT..." : "CONTINUE & REGISTER"}
                </button>

                <Link href="/login" className="flipkart-btn-blue-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  EXISTING USER? LOG IN
                </Link>
              </form>
            </div>
          </div>
        </div>
  );
}
