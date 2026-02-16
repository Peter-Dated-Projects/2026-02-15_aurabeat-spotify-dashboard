"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  colSpan = 1,
  rowSpan = 1,
  delay = 0,
}: GlassCardProps) {
  const spanClasses = [
    colSpan === 2 ? "col-span-2" : "",
    colSpan === 3 ? "col-span-3" : "",
    colSpan === 4 ? "col-span-4" : "",
    rowSpan === 2 ? "row-span-2" : "",
    rowSpan === 3 ? "row-span-3" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, filter: "saturate(1.5)" }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/[0.07] backdrop-blur-xl
        border border-white/[0.12]
        p-6 transition-colors duration-300
        hover:bg-white/[0.1]
        ${spanClasses}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
