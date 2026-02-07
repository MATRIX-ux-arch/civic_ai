import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
}

export function ProgressRing({ progress, size = 80 }: ProgressRingProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const isComplete = progress === 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isComplete ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={isComplete ? "drop-shadow-[0_0_8px_hsl(var(--neon)/0.6)]" : ""}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-base font-bold font-mono ${isComplete ? "neon-text" : "text-muted-foreground"}`}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      <span className={`text-sm ${isComplete ? "text-primary" : "text-muted-foreground"}`}>
        {isComplete ? "Ready!" : "Checklist"}
      </span>
    </div>
  );
}
