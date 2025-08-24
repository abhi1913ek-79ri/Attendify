import React from "react";
import { motion } from "framer-motion";

export default function AttendifyLoader({ label = "Loading...", size = 80, color = "#2563eb" }) {
  const barWidth = size * 0.15;
  const barHeight = size * 0.6;

  return (
    <div className="flex flex-col items-center justify-center gap-3 min-h-[65vh]" role="status" aria-live="polite" aria-label={label}>
      {/* Wave bars */}
      <div className="flex items-end justify-center gap-2" style={{ height: `${barHeight}px` }}>
        {[0, 0.2, 0.4, 0.6].map((delay, i) => (
          <motion.span
            key={i}
            className="rounded-md"
            style={{ width: `${barWidth}px`, background: color }}
            animate={{ height: [barHeight * 0.3, barHeight, barHeight * 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay }}
          />
        ))}
      </div>

      {/* Text */}
      <span className="text-sm font-medium text-gray-600 select-none" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
