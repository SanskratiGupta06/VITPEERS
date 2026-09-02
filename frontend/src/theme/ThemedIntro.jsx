import { useEffect } from "react";

// A short, theme-specific entrance shown once right after login/signup
// succeeds. Purely presentational — auth has already completed by the
// time this renders. Auto-dismisses via onDone after ~700-900ms.
export default function ThemedIntro({ world, onDone }) {
  useEffect(() => {
    // Minimal world intentionally has no intro sequence — matches its
    // "no unnecessary animation" design principle, so it finishes instantly.
    const delay = world === "minimal" ? 0 : world === "f1" ? 1400 : 800;
    const t = setTimeout(onDone, delay);
    return () => clearTimeout(t);
  }, [world, onDone]);

  if (world === "minimal") return null;

  return (
    <div className={`vp-intro-overlay vp-intro-${world} fixed inset-0 z-[999] flex items-center justify-center`}>
      {world === "spider" && <SpiderIntro />}
      {world === "f1" && <F1Intro />}
      {world === "cyber" && <CyberIntro />}
    </div>
  );
}

function SpiderIntro() {
  return (
    <div className="vp-spider-swing text-center">
      <svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto mb-4">
        <circle cx="32" cy="32" r="30" fill="none" stroke="#FF3B3B" strokeWidth="1.5" opacity="0.5" />
        <path d="M32 2 L32 62 M2 32 L62 32 M10 10 L54 54 M54 10 L10 54" stroke="#FF3B3B" strokeWidth="1" opacity="0.35" />
        <circle cx="32" cy="32" r="8" fill="#FF3B3B" />
      </svg>
      <p style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fff", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em" }}>
        THWIP!
      </p>
      <p style={{ color: "rgba(255,255,255,.55)", fontSize: 13, marginTop: 4 }}>Welcome back to the network</p>
    </div>
  );
}

function F1Intro() {
  return (
    <div className="text-center" style={{ fontFamily: "Orbitron, sans-serif" }}>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 22 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="vp-f1-light"
            style={{
              width: 16, height: 16, borderRadius: "50%", display: "inline-block",
              background: "#2A0304", animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
      <p style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: "0.08em" }}>LIGHTS OUT</p>
      <div style={{ width: 180, height: 3, background: "rgba(255,255,255,.12)", margin: "16px auto 0", borderRadius: 4, overflow: "hidden" }}>
        <div className="vp-f1-bar-fill" style={{ height: "100%", background: "#E10600" }} />
      </div>
    </div>
  );
}

function CyberIntro() {
  const lines = ["BOOTING VITPEERS...", "CONNECTING NETWORK...", "IDENTITY VERIFIED", "ACCESS GRANTED"];
  return (
    <div style={{ fontFamily: "JetBrains Mono, monospace", color: "#54D9FF", fontSize: 14 }}>
      {lines.map((line, i) => (
        <p key={line} className="vp-cyber-type" style={{ marginBottom: 6, animationDelay: `${i * 0.22}s`, animationFillMode: "backwards" }}>
          {`> ${line}`}
        </p>
      ))}
    </div>
  );
}
