// A hand-built flat-illustration scene of VIT students networking — evokes the
// same playful, colorful spirit as photo/illustration hero art, without using
// any copyrighted or externally sourced image.
export default function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none" aria-hidden="true">
      {/* decorative sparkles */}
      <span className="absolute -top-4 left-6 text-pink twinkle text-2xl">✦</span>
      <span className="absolute top-10 right-2 text-blue twinkle text-lg" style={{ animationDelay: "0.6s" }}>✦</span>
      <span className="absolute bottom-16 -left-3 text-orange twinkle text-xl" style={{ animationDelay: "1.2s" }}>✦</span>

      {/* sticky note */}
      <div className="absolute -right-3 sm:right-2 top-6 sm:top-10 bg-orangeLight text-navy text-xs font-display font-semibold px-3 py-2 rounded-lg shadow-lg rotate-6 float-slower z-20 hidden sm:block">
        You got this! 🎓
      </div>

      <svg viewBox="0 0 560 420" className="w-full h-auto relative z-10">
        <defs>
          <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7028EF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF5A60" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <ellipse cx="280" cy="330" rx="230" ry="34" fill="url(#glow)" />

        {/* dashed connection trail (paper-plane path) */}
        <path
          d="M60 90 C 160 40, 260 40, 340 90 S 480 150, 500 60"
          fill="none"
          stroke="#6F7BFF"
          strokeWidth="2"
          className="dash-flow"
          opacity="0.55"
        />
        <g transform="translate(486,44) rotate(28)">
          <path d="M0 10 L22 0 L4 22 L2 14 Z" fill="#6F7BFF" />
        </g>

        {/* Student 1 — violet hoodie, laptop */}
        <g transform="translate(60,190)">
          <ellipse cx="45" cy="182" rx="52" ry="10" fill="#21153F" opacity="0.08" />
          <path d="M0 150 Q45 200 90 150 L90 120 Q45 100 0 120 Z" fill="#7028EF" />
          <circle cx="45" cy="90" r="34" fill="#F2C29A" />
          <path d="M11 78 Q45 40 79 78 Q79 55 45 50 Q11 55 11 78Z" fill="#43218A" />
          <rect x="14" y="150" width="62" height="30" rx="6" fill="#F0E8FF" stroke="#7028EF" strokeWidth="2" />
          <rect x="22" y="156" width="46" height="6" rx="2" fill="#7028EF" />
          <text x="45" y="169" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="9" fill="#7028EF">VP</text>
        </g>

        {/* Student 2 — orange top, book */}
        <g transform="translate(165,175)">
          <ellipse cx="45" cy="197" rx="55" ry="10" fill="#21153F" opacity="0.08" />
          <path d="M-4 165 Q45 215 94 165 L94 130 Q45 108 -4 130 Z" fill="#FF7A5A" />
          <circle cx="45" cy="98" r="36" fill="#D99B6C" />
          <path d="M8 84 Q45 46 82 84 Q82 60 45 55 Q8 60 8 84Z" fill="#201A32" />
          <rect x="10" y="150" width="70" height="46" rx="4" fill="white" stroke="#FF7A5A" strokeWidth="2" />
          <line x1="45" y1="150" x2="45" y2="196" stroke="#FF7A5A" strokeWidth="1.5" />
        </g>

        {/* Student 3 — blue hoodie, "VIT" text, tablet */}
        <g transform="translate(285,182)">
          <ellipse cx="55" cy="190" rx="60" ry="10" fill="#21153F" opacity="0.08" />
          <path d="M-6 158 Q55 210 116 158 L116 122 Q55 100 -6 122 Z" fill="#6F7BFF" />
          <text x="55" y="150" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="13" fill="white" opacity="0.85">VIT</text>
          <circle cx="55" cy="92" r="37" fill="#F2C29A" />
          <path d="M15 78 Q55 36 95 78 Q95 52 55 47 Q15 52 15 78Z" fill="#3B2314" />
          <rect x="24" y="152" width="62" height="42" rx="6" fill="#ECEEFF" stroke="#6F7BFF" strokeWidth="2" />
          <text x="55" y="177" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="10" fill="#6F7BFF">VP</text>
        </g>

        {/* Student 4 — pink top, headphones */}
        <g transform="translate(415,195)">
          <ellipse cx="42" cy="175" rx="50" ry="9" fill="#21153F" opacity="0.08" />
          <path d="M-4 148 Q42 195 88 148 L88 116 Q42 96 -4 116 Z" fill="#FF5A60" />
          <circle cx="42" cy="86" r="32" fill="#E8B48A" />
          <path d="M12 74 Q42 40 72 74 Q72 52 42 47 Q12 52 12 74Z" fill="#201A32" />
          <path d="M8 80 A34 34 0 0 1 76 80" fill="none" stroke="#201A32" strokeWidth="5" />
          <circle cx="9" cy="84" r="6" fill="#201A32" />
          <circle cx="75" cy="84" r="6" fill="#201A32" />
        </g>

        {/* floating heart / speech bubble between students 2 & 3 */}
        <g transform="translate(238,110)">
          <rect x="0" y="0" width="34" height="24" rx="8" fill="white" stroke="#FF5A60" strokeWidth="2" />
          <path d="M8 24 L14 24 L8 32 Z" fill="white" stroke="#FF5A60" strokeWidth="2" />
          <path d="M17 15 C13 8, 6 12, 9 17 C11 20, 17 23, 17 23 C17 23, 23 20, 25 17 C28 12, 21 8, 17 15Z" fill="#FF5A60" />
        </g>
      </svg>
    </div>
  );
}
