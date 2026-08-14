import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PasswordInput from "../components/PasswordInput.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/discover");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-vm-gradient text-white p-12 xl:p-20 items-end relative overflow-hidden">
        <span className="absolute top-16 left-16 text-pink/50 twinkle text-2xl">✦</span>
        <span className="absolute top-32 right-24 text-blue/50 twinkle text-lg" style={{ animationDelay: "0.9s" }}>✦</span>
        <div className="absolute -right-16 top-1/4 w-72 h-72 rounded-full bg-violet/20 blur-3xl" />
        <div className="max-w-lg relative">
          <span className="badge-chip text-[10px] uppercase tracking-[0.2em] text-white/60">VITPEERS / Welcome back</span>
          <h1 className="font-display text-5xl xl:text-6xl font-semibold leading-tight mt-3">
            Your VIT network is <span className="gradient-text">still here.</span>
          </h1>
          <p className="text-white/70 font-body mt-5 max-w-md">
            Pick up where you left off — discover students, continue conversations and keep building your VIT community.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <span className="badge-chip text-[10px] uppercase tracking-[0.18em] text-orange">VITPEERS / Login</span>
          <h2 className="font-display text-3xl sm:text-4xl text-navy mt-2 mb-2">Welcome back</h2>
          <p className="text-sm text-ink/60 font-body mb-8">Log in with your VIT college email.</p>

          <form onSubmit={handleSubmit} className="space-y-5 font-body">
            <div>
              <label htmlFor="login-email" className="text-xs uppercase tracking-wide text-ink/50 badge-chip">College email</label>
              <input id="login-email" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@vitbhopal.ac.in"
                className="w-full mt-1 border border-line rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest" />
            </div>

            <PasswordInput id="login-password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />

            <div className="flex justify-end -mt-2">
              <Link to="/forgot-password" className="text-sm text-forest hover:underline">Forgot password?</Link>
            </div>

            {error && <div className="rounded-xl bg-rose/10 border border-rose/20 px-3 py-2 text-sm text-rose">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-vm-warm text-white py-3 rounded-full hover:brightness-110 transition disabled:opacity-50 font-medium shadow-lg shadow-pink/20">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-ink/60 mt-6 font-body">
            New here? <Link to="/signup" className="text-forest font-medium hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
