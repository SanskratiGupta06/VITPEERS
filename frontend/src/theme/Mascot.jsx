import { useState } from "react";
import { useTheme } from "./ThemeContext.jsx";
import { THEMES } from "./themes.js";

const GREETINGS = {
  minimal: "Hey! Welcome to VITPEERS ✨",
  spider: "THWIP! Your friendly campus spider is here 🕸️",
  f1: "TELEMETRY OK — systems ready 🏎️",
  cyber: "> SYSTEM_ONLINE :: hello, peer.",
};

function MascotIcon({ world }) {
  if (world === "spider") {
    return (
      <svg width="30" height="30" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#FF3B3B" strokeWidth="1.2" opacity="0.55" />
        <path d="M20 2 L20 38 M2 20 L38 20 M7 7 L33 33 M33 7 L7 33" stroke="#FF3B3B" strokeWidth="1" opacity="0.35" />
        <circle cx="20" cy="20" r="7" fill="#FF3B3B" />
        <circle cx="17" cy="18" r="1.4" fill="#fff" />
        <circle cx="23" cy="18" r="1.4" fill="#fff" />
      </svg>
    );
  }
  if (world === "f1") {
    return (
      <svg width="30" height="30" viewBox="0 0 40 40">
        <rect x="4" y="17" width="32" height="7" rx="3" fill="#E10600" />
        <circle cx="12" cy="27" r="4.5" fill="#111" />
        <circle cx="28" cy="27" r="4.5" fill="#111" />
        <rect x="14" y="12" width="12" height="6" rx="2" fill="#fff" opacity="0.85" />
      </svg>
    );
  }
  if (world === "cyber") {
    return (
      <svg width="30" height="30" viewBox="0 0 40 40">
        <rect x="8" y="10" width="24" height="20" rx="6" fill="#170B2B" stroke="#B24BFF" strokeWidth="1.4" />
        <circle cx="16" cy="19" r="2.4" fill="#54D9FF" />
        <circle cx="24" cy="19" r="2.4" fill="#54D9FF" />
        <rect x="15" y="25" width="10" height="2" rx="1" fill="#B24BFF" />
        <rect x="17" y="4" width="6" height="7" rx="2" fill="#B24BFF" />
      </svg>
    );
  }
  // minimal — a small friendly spark, matches its understated design language
  return (
    <svg width="26" height="26" viewBox="0 0 40 40">
      <path d="M20 4 L23 17 L36 20 L23 23 L20 36 L17 23 L4 20 L17 17 Z" fill="#0969DA" />
    </svg>
  );
}

export default function Mascot() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const t = THEMES[theme];

  const bubbleClass =
    theme === "minimal" ? "tn-minimal" : theme === "spider" ? "tn-spider" : theme === "f1" ? "tn-f1" : "tn-cyber";

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-2">
      {open && (
        <div className={`${bubbleClass} px-4 py-3 max-w-[220px] shadow-lg reveal`}>
          <p className="text-sm leading-5">{GREETINGS[theme]}</p>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${t.label} mascot`}
        className="vp-mascot-idle w-14 h-14 rounded-full flex items-center justify-center shadow-lg border"
        style={{
          background: theme === "minimal" ? "#fff" : t.bg,
          borderColor: theme === "minimal" ? "#D0D7DE" : t.accent,
        }}
      >
        <MascotIcon world={theme} />
      </button>
    </div>
  );
}
