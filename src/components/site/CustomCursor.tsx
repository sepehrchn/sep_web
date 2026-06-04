import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 400, damping: 30, mass: 0.5 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    setVisible(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 4);
      y.set(e.clientY - 4);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!visible) return null;
  return (
    <motion.div
      style={{ translateX: sx, translateY: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent-glow)]"
    />
  );
}
