import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Node {
  cx: number;
  cy: number;
  r: number;
  label?: string;
}

const nodes: Node[] = [
  { cx: 20, cy: 20, r: 5, label: "AI" },
  { cx: 70, cy: 15, r: 3.5 },
  { cx: 45, cy: 45, r: 6, label: "ML" },
  { cx: 80, cy: 60, r: 4 },
  { cx: 25, cy: 70, r: 4.5, label: "API" },
  { cx: 10, cy: 50, r: 3 },
  { cx: 60, cy: 80, r: 3.5 },
  { cx: 90, cy: 35, r: 3 },
  { cx: 50, cy: 15, r: 2.5 },
  { cx: 35, cy: 85, r: 3 },
];

const edges = [
  { x1: 20, y1: 20, x2: 45, y2: 45 },
  { x1: 70, y1: 15, x2: 45, y2: 45 },
  { x1: 80, y1: 60, x2: 45, y2: 45 },
  { x1: 25, y1: 70, x2: 45, y2: 45 },
  { x1: 10, y1: 50, x2: 20, y2: 20 },
  { x1: 70, y1: 15, x2: 90, y2: 35 },
  { x1: 80, y1: 60, x2: 60, y2: 80 },
  { x1: 10, y1: 50, x2: 25, y2: 70 },
  { x1: 90, y1: 35, x2: 80, y2: 60 },
  { x1: 45, y1: 45, x2: 50, y2: 15 },
  { x1: 25, y1: 70, x2: 35, y2: 85 },
  { x1: 50, y1: 15, x2: 70, y2: 15 },
];

export function HeroParticles() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Cursor position for particle reactivity
  const cursorX = useMotionValue(-999);
  const cursorY = useMotionValue(-999);

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

  // Track cursor position relative to this container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      cursorX.set(x);
      cursorY.set(y);
    };

    const onMouseLeave = () => {
      cursorX.set(-999);
      cursorY.set(-999);
    };

    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [cursorX, cursorY]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Main node-graph — right side */}
      <svg
        viewBox="0 0 100 100"
        className="absolute right-[2%] top-[10%] h-[80%] w-[50%] opacity-[0.15] md:opacity-[0.2]"
        preserveAspectRatio="xMidYMid meet"
      >
        {edges.map((e, i) => {
          const midX = (e.x1 + e.x2) / 2;
          const midY = (e.y1 + e.y2) / 2;
          return (
            <ParticleLine
              key={`edge-${i}`}
              x1={e.x1} y1={e.y1}
              x2={e.x2} y2={e.y2}
              midX={midX} midY={midY}
              cursorX={cursorX} cursorY={cursorY}
              index={i}
              visible={visible}
            />
          );
        })}
        {nodes.map((n, i) => (
          <ParticleNode
            key={`node-${i}`}
            cx={n.cx} cy={n.cy} r={n.r}
            label={n.label}
            cursorX={cursorX} cursorY={cursorY}
            index={i}
            visible={visible}
            isCool={n.label === "ML" || n.label === "API"}
          />
        ))}
      </svg>

      {/* Secondary small graph cluster — bottom left */}
      <svg
        viewBox="0 0 60 60"
        className="absolute bottom-[6%] left-[2%] h-[22%] w-[18%] opacity-[0.08] md:opacity-[0.12]"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.line x1="15" y1="12" x2="35" y2="10" stroke="var(--accent-cool)" strokeWidth="0.3"
          initial={{ pathLength: 0 }} animate={visible ? { pathLength: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.6 }} />
        <motion.line x1="35" y1="10" x2="48" y2="28" stroke="var(--accent)" strokeWidth="0.3"
          initial={{ pathLength: 0 }} animate={visible ? { pathLength: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.7 }} />
        <motion.line x1="15" y1="12" x2="22" y2="38" stroke="var(--accent)" strokeWidth="0.25"
          initial={{ pathLength: 0 }} animate={visible ? { pathLength: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }} />
        <motion.line x1="22" y1="38" x2="48" y2="28" stroke="var(--accent-cool)" strokeWidth="0.25"
          initial={{ pathLength: 0 }} animate={visible ? { pathLength: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.9 }} />
        {[
          { cx: 15, cy: 12, r: 2.5, color: "var(--accent)" },
          { cx: 35, cy: 10, r: 2, color: "var(--accent-cool)" },
          { cx: 48, cy: 28, r: 2.5, color: "var(--accent)" },
          { cx: 22, cy: 38, r: 2, color: "var(--accent-cool)" },
        ].map((dot, i) => (
          <motion.circle key={`sdot-${i}`} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.color}
            initial={{ scale: 0 }} animate={visible ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 1.0 + i * 0.1 }} />
        ))}
      </svg>

      {/* Ambient glow gradient — warm overlay */}
      <div
        className="absolute right-[-10%] top-[-10%] h-[70%] w-[60%] rounded-full opacity-[0.08]"
        style={{
          background: "radial-gradient(ellipse, var(--accent) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}

function ParticleNode({ cx, cy, r, label, cursorX, cursorY, index, visible, isCool }: {
  cx: number; cy: number; r: number; label?: string;
  cursorX: any; cursorY: any; index: number; visible: boolean; isCool?: boolean;
}) {
  const dx = useTransform(cursorX, (v: number) => {
    const d = v - cx;
    return Math.max(-8, Math.min(8, -d * 0.04));
  });
  const dy = useTransform(cursorY, (v: number) => {
    const d = v - cy;
    return Math.max(-8, Math.min(8, -d * 0.04));
  });
  const glowIntensity = useTransform([cursorX, cursorY], ([x, y]: number[]) => {
    const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    return d < 15 ? 1 : 0;
  });

  const fillColor = isCool ? "var(--accent-cool)" : "var(--accent)";
  const glowColor = isCool ? "var(--accent-cool-glow)" : "var(--accent-glow)";

  return (
    <g>
      <motion.circle
        cx={cx} cy={cy}
        r={label ? r + 2 : r}
        fill="none"
        stroke={fillColor}
        strokeWidth="0.5"
        style={{ x: dx, y: dy }}
        initial={{ scale: 0, opacity: 0 }}
        animate={visible ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 + index * 0.05, ease: "easeOut" }}
      />
      <motion.circle
        cx={cx} cy={cy}
        r={r * 0.5}
        fill={fillColor}
        style={{ x: dx, y: dy }}
        initial={{ scale: 0, opacity: 0 }}
        animate={visible ? { scale: 1, opacity: 0.8 } : {}}
        transition={{ duration: 0.4, delay: 0.35 + index * 0.05 }}
      />
      <motion.circle
        cx={cx} cy={cy}
        r={r * 2.5}
        fill={fillColor}
        style={{ x: dx, y: dy, opacity: glowIntensity }}
        initial={{ opacity: 0 }}
      />
      {label && (
        <motion.text
          x={cx} y={cy}
          textAnchor="middle" dominantBaseline="central"
          fill={fillColor}
          fontSize="4"
          fontWeight="600"
          fontFamily="JetBrains Mono, monospace"
          style={{ x: dx, y: dy, opacity: glowIntensity }}
          initial={{ opacity: 0 }}
        >
          {label}
        </motion.text>
      )}
    </g>
  );
}

function ParticleLine({ x1, y1, x2, y2, midX, midY, cursorX, cursorY, index, visible }: {
  x1: number; y1: number; x2: number; y2: number;
  midX: number; midY: number;
  cursorX: any; cursorY: any; index: number; visible: boolean;
}) {
  const brightness = useTransform([cursorX, cursorY], ([x, y]: number[]) => {
    const d = Math.sqrt((x - midX) ** 2 + (y - midY) ** 2);
    return d < 18 ? 1 : 0.3;
  });

  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="var(--accent)"
      strokeWidth="0.35"
      style={{ opacity: brightness }}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={visible ? { pathLength: 1, opacity: 0.5 } : {}}
      transition={{ duration: 1.5, delay: index * 0.06, ease: "easeOut" }}
    />
  );
}