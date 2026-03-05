"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";

interface DropZoneProps {
  id: string;
  label: string;
  placedEmoji?: string;
  className?: string;
}

export default function DropZone({ id, label, placedEmoji, className = "" }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      className={`
        relative flex items-center justify-center
        w-20 h-20 md:w-24 md:h-24
        rounded-full border-4 border-dashed
        ${isOver ? "border-cakey-gold bg-cakey-gold/30 scale-110" : "border-cakey-pink bg-white/50"}
        transition-colors duration-200
        ${className}
      `}
      animate={isOver ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 12 }}
    >
      <AnimatePresence mode="wait">
        {placedEmoji ? (
          <motion.span
            key="placed"
            className="text-4xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", bounce: 0.6 }}
          >
            {placedEmoji}
          </motion.span>
        ) : (
          <motion.span
            key="label"
            className="text-xs font-bold text-cakey-pink text-center px-1"
            style={{ fontFamily: "var(--font-display)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
