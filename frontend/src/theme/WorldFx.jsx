import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext.jsx";

export default function WorldFx() {
  const { theme } = useTheme();
  const [pulse, setPulse] = useState(null);
  useEffect(() => {
    let frame = 0;
    const onMove = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--vp-mx", `${event.clientX}px`);
        document.documentElement.style.setProperty("--vp-my", `${event.clientY}px`);
      });
    };
    const onClick = (event) => setPulse({ x: event.clientX, y: event.clientY, id: Date.now() });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", onMove); window.removeEventListener("click", onClick); };
  }, []);
  return (
    <div className={`vp-world-fx vp-world-fx-${theme}`} aria-hidden="true">
      <span className="vp-world-cursor" />
      {theme === "spider" && <span className="vp-web-trail" />}
      {theme === "f1" && <span className="vp-speed-trail" />}
      {theme === "cyber" && <span className="vp-scan-trail" />}
      {pulse && <span key={pulse.id} className="vp-world-pulse" style={{ left: pulse.x, top: pulse.y }} />}
    </div>
  );
}
