import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

const shapes = [
  { d: "M10,10 L90,10 L90,90 L10,90 Z", size: 110, top: "12%", left: "8%", dur: 28 },
  { d: "M50,5 L95,80 L5,80 Z", size: 90, top: "70%", left: "12%", dur: 34 },
  { d: "M50,5 A45,45 0 1,1 49.9,5 Z", size: 130, top: "20%", left: "78%", dur: 40 },
  { d: "M10,50 L50,10 L90,50 L50,90 Z", size: 100, top: "65%", left: "82%", dur: 32 },
  { d: "M20,20 L80,20 L80,80 L20,80 Z", size: 70, top: "40%", left: "45%", dur: 26 },
  { d: "M50,10 L90,90 L10,90 Z", size: 85, top: "8%", left: "55%", dur: 38 },
  { d: "M50,5 A45,45 0 1,1 49.9,5 Z", size: 60, top: "85%", left: "55%", dur: 30 },
  { d: "M10,10 L90,10 L90,90 L10,90 Z", size: 50, top: "50%", left: "20%", dur: 24 },
];

export function HeroParticles() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: 0.06 }}
          animate={visible ? {
            y: [0, -20, 0, 15, 0],
            x: [0, 12, -8, 6, 0],
            rotate: [0, 90, 180, 270, 360],
          } : {}}
          transition={{ duration: s.dur, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <path d={s.d} fill="none" stroke="var(--accent)" strokeWidth="1" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
