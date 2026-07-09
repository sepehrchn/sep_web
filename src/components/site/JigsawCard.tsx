import { type ReactNode } from "react";

interface JigsawCardProps {
    color?: string;
    filled?: boolean;
    className?: string;
    children: ReactNode;
}

const PALETTE = [
    "#1B4D3E",
    "#2A7B8C",
    "#C17A54",
    "#1B1B4A",
    "#5C6B3C",
    "#6B4E8D",
    "#B8860B",
];

const NOTCH = 28;

export function JigsawCard({ color, filled = false, className = "", children }: JigsawCardProps) {
    const resolved = color || PALETTE[Math.floor(Math.random() * PALETTE.length)];

    const clip = `polygon(
    ${NOTCH}px 0, calc(100% - ${NOTCH}px) 0,
    100% ${NOTCH}px, 100% calc(100% - ${NOTCH}px),
    calc(100% - ${NOTCH}px) 100%, ${NOTCH}px 100%,
    0 calc(100% - ${NOTCH}px), 0 ${NOTCH}px
  )`;

    return (
        <div
            className={["relative bg-white border border-[var(--border)] shadow-md transition-all duration-300", className].join(" ")}
            style={{ clipPath: clip }}
        >
            <div
                className={filled ? "h-full w-full" : "h-full w-full bg-[var(--bg-card)]"}
                style={filled ? { backgroundColor: resolved } : undefined}
            >
                {children}
            </div>
        </div>
    );
}