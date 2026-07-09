import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Main cursor springs
  const sx = useSpring(x, { stiffness: 300, damping: 25, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 25, mass: 0.5 });

  // Trailing glow springs (slower follow)
  const tx = useSpring(x, { stiffness: 200, damping: 40, mass: 1 });
  const ty = useSpring(y, { stiffness: 200, damping: 40, mass: 1 });

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    setVisible(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX - 4);
      y.set(e.clientY - 4);
    };

    window.addEventListener("mousemove", move);

    // Simple hover detection via mousemove
    let interval: any;
    const startHoverCheck = () => {
      interval = setInterval(() => {
        const el = document.elementFromPoint(x.get(), y.get());
        if (!el) { setHovering(false); return; }
        const tag = (el as HTMLElement).tagName;
        const cls = (el as HTMLElement).className || "";
        setHovering(
          tag === "BUTTON" || tag === "A" || tag === "INPUT" || tag === "TEXTAREA" ||
          tag === "SELECT" || cls.includes("cursor-pointer") || cls.includes("hover:")
        );
      }, 100);
    };
    startHoverCheck();

    return () => {
      window.removeEventListener("mousemove", move);
      clearInterval(interval);
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        style={{ translateX: sx, translateY: sy }}
        className="pointer-events-none fixed z-[9999]"
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: hovering ? 32 : 8,
            height: hovering ? 32 : 8,
            backgroundColor: "var(--accent)",
            opacity: hovering ? 0.2 : 0.6,
            border: hovering ? "1px solid var(--accent)" : "none",
            marginLeft: hovering ? -12 : 0,
            marginTop: hovering ? -12 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Trailing glow dot */}
      <motion.div
        style={{ translateX: tx, translateY: ty }}
        className="pointer-events-none fixed z-[9998]"
      >
        <div
          className="h-3 w-3 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            opacity: 0.3,
            filter: "blur(4px)",
          }}
        />
      </motion.div>

      {/* Interactive element hover ring */}
      <motion.div
        style={{ translateX: sx, translateY: sy }}
        className="pointer-events-none fixed z-[9997]"
        animate={{
          width: hovering ? 48 : 0,
          height: hovering ? 48 : 0,
          opacity: hovering ? 0.5 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{ border: "1px solid var(--accent)", opacity: 0.3 }}
        />
      </motion.div>
    </>
  );
}