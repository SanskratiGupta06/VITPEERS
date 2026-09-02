import React from "react";
import { Check, Sparkles, Zap, Shield, Terminal } from "lucide-react";
import { THEMES, THEME_ORDER } from "./themes.js";
import { useTheme } from "./ThemeContext.jsx";

const ICONS = { minimal: Sparkles, spider: Shield, f1: Zap, cyber: Terminal };

export default function WorldSelector() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="vp-world-selector">
      <div className="mb-7 max-w-2xl">
        <span className="section-kicker">Visual identity</span>
        <h2 className="font-display text-3xl sm:text-4xl mt-2 vp-selector-heading">Choose your VITPEERS world</h2>
        <p className="text-sm sm:text-base opacity-70 font-body mt-3 vp-selector-sub">Same VITPEERS. Same features. A completely different visual world — choose the one that feels like you.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {THEME_ORDER.map((key) => {
          const t = THEMES[key];
          const active = theme === key;
          const Icon = ICONS[key];
          return (
            <button key={key} type="button" onClick={() => setTheme(key)} className={`vp-world-card vp-world-card-${key} text-left border-2 transition-all relative overflow-hidden ${active ? "is-active" : ""}`} data-world={key} aria-pressed={active}>
              <div className="vp-world-card-art" aria-hidden="true">
                <span className="vp-world-card-art-core"><Icon size={22} /></span>
                <span className="vp-world-card-art-line one" /><span className="vp-world-card-art-line two" /><span className="vp-world-card-art-line three" />
              </div>
              <div className="relative z-10 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="vp-world-emoji" aria-hidden="true">{t.emoji}</span>
                    <div><h3 className="font-display text-xl font-semibold">{t.label}</h3><p className="text-sm font-semibold mt-0.5" style={{ color: t.accent }}>{t.tagline}</p></div>
                  </div>
                  {active && <span className="vp-world-check" style={{ background: t.accent }}><Check size={15} color="#fff" /></span>}
                </div>
                <p className="text-sm opacity-70 mt-4 leading-6">{t.description}</p>
                <div className="flex items-center justify-between mt-6"><span className="vp-world-identity text-[9px] uppercase tracking-[0.14em] opacity-60">{t.identity}</span><span className="text-xs font-semibold opacity-70">{active ? "Active world" : "Enter world →"}</span></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
