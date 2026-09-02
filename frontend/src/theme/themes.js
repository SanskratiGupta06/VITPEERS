// Central theme registry. Each theme is a small metadata object used by
// WorldSelector cards and the login intro sequence. The actual visual
// repaint of existing components happens via CSS variables + [data-theme]
// selectors in index.css — this file does NOT duplicate page markup.
export const THEMES = {
  minimal: {
    key: "minimal",
    label: "Minimal",
    emoji: "✨",
    tagline: "Simple. Focused. VITPEERS.",
    description: "Clean, professional, developer-platform feel.",
    accent: "#7028EF",
    bg: "#FFF9ED",
    identity: "soft editorial / glass paper",
  },
  spider: {
    key: "spider",
    label: "Spider",
    emoji: "🕷️",
    tagline: "Swing into your network",
    description: "Comic-inspired energy — navy, coral and web motion.",
    accent: "#FF3B3B",
    bg: "#0B0E1A",
    identity: "comic panels / web geometry",
  },
  f1: {
    key: "f1",
    label: "F1",
    emoji: "🏎️",
    tagline: "Built for speed",
    description: "Premium motorsport dashboard — carbon, red, telemetry.",
    accent: "#E10600",
    bg: "#0A0A0C",
    identity: "carbon fibre / telemetry",
  },
  cyber: {
    key: "cyber",
    label: "Cyber",
    emoji: "🧑‍💻",
    tagline: "Enter the network",
    description: "Futuristic terminal — neon purple, cyan, glass cards.",
    accent: "#B24BFF",
    bg: "#0A0714",
    identity: "neon grid / terminal glass",
  },
};

export const THEME_ORDER = ["minimal", "spider", "f1", "cyber"];

export const DEFAULT_THEME = "minimal";
