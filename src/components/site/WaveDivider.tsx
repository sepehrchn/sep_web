interface WaveDividerProps {
    color?: string;
    flip?: boolean;
    height?: number;
}

export function WaveDivider({ color = "#FFFFFF", flip = false, height = 80 }: WaveDividerProps) {
    return (
        <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""}`} style={{ height }}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full">
                <path
                    d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
                    fill={color}
                />
            </svg>
        </div>
    );
}