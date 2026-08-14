export default function Avatar({ name, src, size = 40 }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const style = { width: size, height: size };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={style}
        className="rounded-full object-cover border border-line flex-shrink-0"
      />
    );
  }

  return (
    <div
      style={style}
      className="rounded-full bg-forestLight text-forest flex items-center justify-center font-body font-semibold flex-shrink-0"
    >
      <span style={{ fontSize: size * 0.4 }}>{initials}</span>
    </div>
  );
}
