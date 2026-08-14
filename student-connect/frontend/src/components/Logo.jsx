// A distinctive VITPEERS mark: two interlocking rings (peer-to-peer / connection
// motif) on a warm gradient badge, with a small spark accent. Used anywhere the
// brand mark appears so the logo stays consistent across the app.
export default function Logo({ size = 32, wordmark = false, wordmarkClass = "" }) {
  const badge = (
    <span
      className="relative inline-flex items-center justify-center rounded-2xl bg-vm-warm shadow-lg shadow-pink/25 flex-shrink-0"
      style={{ width: size, height: size }}
      aria-hidden={wordmark ? "true" : undefined}
    >
      <svg viewBox="0 0 32 32" width={size * 0.62} height={size * 0.62} fill="none">
        <circle cx="12.5" cy="16" r="7" stroke="white" strokeWidth="2.6" />
        <circle cx="19.5" cy="16" r="7" stroke="white" strokeWidth="2.6" fillOpacity="0" />
      </svg>
      <span
        className="absolute bg-white rounded-full"
        style={{
          width: Math.max(size * 0.16, 4),
          height: Math.max(size * 0.16, 4),
          top: -size * 0.05,
          right: -size * 0.05,
          boxShadow: "0 0 0 2px rgba(224,73,155,0.35)",
        }}
      />
    </span>
  );

  if (!wordmark) return badge;

  return (
    <span className="inline-flex items-center gap-2">
      {badge}
      <span className={`font-display font-semibold tracking-tight ${wordmarkClass}`}>
        VIT<span className="gradient-text-warm">PEERS</span>
      </span>
    </span>
  );
}
