"use client";

import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";

interface DraggableItemProps {
  id: string;
  emoji: string;
  label: string;
  isPlaced: boolean;
}

export default function DraggableItem({ id, emoji, label, isPlaced }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  if (isPlaced) return null;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex flex-col items-center justify-center
        w-28 h-28 md:w-32 md:h-32
        bg-white rounded-2xl shadow-lg border-4 border-cakey-pink
        cursor-grab active:cursor-grabbing
        touch-none select-none
        ${isDragging ? "z-50 opacity-80 shadow-2xl" : "z-10"}
      `}
      whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }}
      whileTap={{ scale: 1.15 }}
      animate={
        isDragging
          ? { scale: 1.2, rotate: 5 }
          : { scale: 1, rotate: 0 }
      }
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <span className="text-5xl">{emoji}</span>
      <span
        className="text-sm font-bold text-cakey-red mt-1 text-center leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}
