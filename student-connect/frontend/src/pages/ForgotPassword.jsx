import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import PasswordInput from "../components/PasswordInput.jsx";
import api from "../api.js";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendCode() {
    setLoading(true); setError(""); setMessage("");
    try {
      await api.post("/auth/forgot-password", { email });
      setStep(2);
      setMessage("If an account exists for that email, a verification code has been sent.");
      setCooldown(60);
      const timer = setInterval(() => setCooldown((v) => {
        if (v <= 1) { clearInterval(timer); return 0; }
        return v - 1;
      }), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send the verification code.");
    } finally { setLoading(false); }
  }

  async function verifyCode() {
    setLoading(true); setError(""); setMessage("");
    try {
      await api.post("/auth/verify-reset-code", { email, code });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired verification code.");
    } finally { setLoading(false); }
  }

  async function resetPassword() {
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      await api.post("/auth/reset-password", { email, code, password });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset your password.");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-violetLight via-paper to-blueLight">
      <div className="w-full max-w-md bg-white border border-line rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
        <span className="absolute top-6 right-10 text-pink/50 twinkle text-lg">✦</span>
        <span className="absolute bottom-10 left-6 text-blue/40 twinkle text-base" style={{ animationDelay: "0.7s" }}>✦</span>

        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-ink/55 hover:text-navy mb-7 relative">
          <ArrowLeft size={16} /> Back to login
        </Link>

        {step < 4 && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-vm-warm text-white flex items-center justify-center mb-4 shadow-lg shadow-pink/20 relative">
              <Mail size={22} />
            </div>
            <h1 className="font-display text-3xl text-navy mb-2 relative">
              {step === 1 && <>Forgot your <span className="gradient-text">password?</span></>}
              {step === 2 && "Check your email"}
              {step === 3 && "Create a new password"}
            </h1>
            <p className="text-sm text-ink/60 font-body mb-7">
              {step === 1 && "Enter your VIT email and we'll send you a verification code."}
              {step === 2 && `Enter the 6-digit code sent to ${email}.`}
              {step === 3 && "Choose a new password for your VITPEERS account."}
            </p>
          </>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@vitbhopal.ac.in"
              className="w-full border border-line rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-forest" />
            <button disabled={loading || !email} onClick={sendCode}
              className="w-full bg-vm-warm text-white py-3 rounded-full disabled:opacity-50 hover:brightness-110 transition">
              {loading ? "Sending..." : "Send verification code"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input inputMode="numeric" maxLength={6} value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit code"
              className="w-full tracking-[0.5em] text-center text-xl border border-line rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-forest" />
            <button disabled={loading || code.length !== 6} onClick={verifyCode}
              className="w-full bg-vm-warm text-white py-3 rounded-full disabled:opacity-50 hover:brightness-110 transition">
              {loading ? "Verifying..." : "Verify code"}
            </button>
            <button disabled={loading || cooldown > 0} onClick={sendCode}
              className="w-full text-sm text-forest disabled:text-ink/30">
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <PasswordInput id="reset-password" label="New password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <PasswordInput id="reset-confirm" label="Confirm new password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)} />
            <button disabled={loading} onClick={resetPassword}
              className="w-full bg-vm-warm text-white py-3 rounded-full disabled:opacity-50 hover:brightness-110 transition">
              {loading ? "Updating..." : "Reset password"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-forestLight text-forest flex items-center justify-center mx-auto mb-4 text-xl">✓</div>
            <h1 className="font-display text-3xl text-navy">Password updated</h1>
            <p className="text-sm text-ink/60 mt-2 mb-6">Your password has been changed successfully.</p>
            <button onClick={() => navigate("/login")} className="w-full bg-orange text-white py-3 rounded-full">Continue to login</button>
          </div>
        )}

        {message && <p className="mt-5 text-sm text-forest bg-forestLight rounded-xl p-3">{message}</p>}
        {error && <p className="mt-5 text-sm text-rose bg-rose/10 rounded-xl p-3">{error}</p>}
      </div>
    </div>
  );
}
