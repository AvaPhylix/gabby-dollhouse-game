"use client";

import { useDraggable } from "@dnd-kit/core";

interface DraggableItemProps {
  id: string;
  emoji: string;
  label: string;
  isPlaced: boolean;
}

export default function DraggableItem({ id, emoji, label, isPlaced }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  if (isPlaced) return null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex flex-col items-center justify-center
        w-28 h-28 md:w-32 md:h-32
        bg-white rounded-2xl shadow-lg border-4 border-cakey-pink
        cursor-grab active:cursor-grabbing
        touch-none select-none
        transition-transform duration-150
        hover:scale-110 active:scale-110
        ${isDragging ? "opacity-30" : "opacity-100"}
      `}
    >
      <span className="text-5xl">{emoji}</span>
      <span
        className="text-sm font-bold text-cakey-red mt-1 text-center leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </span>
    </div>
  );
}
