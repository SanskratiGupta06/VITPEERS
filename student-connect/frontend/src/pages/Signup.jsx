import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { CAMPUS_OPTIONS, YEARS, getLevels, getProgrammes } from "../data/programs.js";
import api from "../api.js";

export default function Signup() {
  const { signup, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", campus: "Vellore",
    programmeLevel: "", programme: "", year: "1st Year"
  });
  const [step, setStep] = useState("details");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const levels = getLevels(form.campus);
  const programmes = getProgrammes(form.campus, form.programmeLevel);

  useEffect(() => {
    if (!levels.includes(form.programmeLevel)) {
      setForm((f) => ({ ...f, programmeLevel: levels[0] || "", programme: "" }));
    }
  }, [form.campus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!programmes.includes(form.programme)) {
      setForm((f) => ({ ...f, programme: programmes[0] || "" }));
    }
  }, [form.programmeLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const data = await signup({
        ...form,
        branch: form.programme,
        specialization: ""
      });
      setNotice(data.message || `We sent a 6-digit verification code to ${form.email}.`);
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyEmail(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-email", {
        email: form.email,
        code: verificationCode,
      });
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/discover");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please check the code.");
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    setError("");
    setNotice("");
    setResending(true);
    try {
      const { data } = await api.post("/auth/resend-verification", { email: form.email });
      setNotice(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend the verification code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="bg-white border border-line rounded-3xl p-6 sm:p-9 shadow-sm">
        <div className="mb-8">
          <span className="badge-chip text-[10px] uppercase tracking-[0.18em] text-orange">VITPEERS / Join</span>
          <h1 className="font-display text-3xl sm:text-4xl text-navy mt-2 mb-2">
            {step === "details" ? "Create your VITPEERS profile" : "Verify your VIT email"}
          </h1>
          <p className="text-sm text-ink/60 font-body">
            {step === "details"
              ? "Your VIT email must be verified before your account can be activated."
              : <>We sent a 6-digit code to <strong className="text-navy">{form.email}</strong>. Check your inbox and enter it below.</>}
          </p>
        </div>

        {step === "details" ? (
          <form onSubmit={handleSubmit} className="space-y-5 font-body">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-xs uppercase tracking-wide text-ink/50 badge-chip">Full name</label>
                <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)}
                  className="w-full mt-1 border border-line rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest" />
              </div>
              <div>
                <label htmlFor="email" className="text-xs uppercase tracking-wide text-ink/50 badge-chip">VIT college email</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
                  placeholder="you@vitbhopal.ac.in"
                  className="w-full mt-1 border border-line rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest" />
              </div>
            </div>

            <PasswordInput id="signup-password" label="Password" value={form.password}
              onChange={(e) => update("password", e.target.value)} />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="campus" className="text-xs uppercase tracking-wide text-ink/50 badge-chip">Campus</label>
                <select id="campus" value={form.campus} onChange={(e) => update("campus", e.target.value)}
                  className="w-full mt-1 border border-line rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest">
                  {CAMPUS_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="year" className="text-xs uppercase tracking-wide text-ink/50 badge-chip">Year</label>
                <select id="year" value={form.year} onChange={(e) => update("year", e.target.value)}
                  className="w-full mt-1 border border-line rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest">
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="programme-level" className="text-xs uppercase tracking-wide text-ink/50 badge-chip">Programme level</label>
                <select id="programme-level" value={form.programmeLevel} onChange={(e) => update("programmeLevel", e.target.value)}
                  className="w-full mt-1 border border-line rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest">
                  {levels.map((level) => <option key={level}>{level}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="programme" className="text-xs uppercase tracking-wide text-ink/50 badge-chip">Branch / programme</label>
                <select id="programme" value={form.programme} onChange={(e) => update("programme", e.target.value)}
                  className="w-full mt-1 border border-line rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest">
                  {programmes.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {error && <div className="rounded-xl bg-rose/10 border border-rose/20 px-3 py-2 text-sm text-rose">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-vm-warm text-white py-3 rounded-full hover:brightness-110 transition disabled:opacity-50 font-medium shadow-lg shadow-pink/20">
              {loading ? "Sending verification code..." : "Continue & verify email"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyEmail} className="space-y-5 font-body">
            {notice && <div className="rounded-xl bg-forest/10 border border-forest/20 px-3 py-2 text-sm text-forest">{notice}</div>}
            <div>
              <label htmlFor="verification-code" className="text-xs uppercase tracking-wide text-ink/50 badge-chip">6-digit verification code</label>
              <input
                id="verification-code"
                required
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full mt-1 border border-line rounded-xl px-3 py-3 text-center tracking-[0.45em] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            {error && <div className="rounded-xl bg-rose/10 border border-rose/20 px-3 py-2 text-sm text-rose">{error}</div>}

            <button type="submit" disabled={loading || verificationCode.length !== 6}
              className="w-full bg-vm-warm text-white py-3 rounded-full hover:brightness-110 transition disabled:opacity-50 font-medium shadow-lg shadow-pink/20">
              {loading ? "Verifying..." : "Verify email & join VITPEERS"}
            </button>

            <div className="flex items-center justify-between gap-3 text-sm">
              <button type="button" onClick={resendCode} disabled={resending} className="text-forest font-medium hover:underline disabled:opacity-50">
                {resending ? "Sending..." : "Resend code"}
              </button>
              <button type="button" onClick={() => { setStep("details"); setError(""); setNotice(""); }} className="text-ink/50 hover:text-navy">
                Change email
              </button>
            </div>
          </form>
        )}

        <p className="text-sm text-ink/60 mt-6 font-body">
          Already have an account? <Link to="/login" className="text-forest font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
