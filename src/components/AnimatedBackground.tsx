"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const STAR_COUNT = 20;
const SHAPES = ["⭐", "🌟", "✨", "🎀", "🧁", "🎂", "❤️", "🍰"];

export default function AnimatedBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        id: i,
        shape: SHAPES[i % SHAPES.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 16 + Math.random() * 24,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 6,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cakey-cream via-cakey-bg to-cakey-light opacity-80" />

      {/* Floating shapes */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute select-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontSize: star.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [-15, 15, -15],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {star.shape}
        </motion.div>
      ))}
    </div>
  );
}
