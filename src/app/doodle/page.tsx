"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Image from "next/image";
import AnimatedBackground from "@/components/AnimatedBackground";
import HomeButton from "@/components/HomeButton";
import { getFamilyMembers, FamilyMember } from "@/lib/supabase";

/* ── Magic Markers ─────────────────────────────────────── */
const MARKERS = [
  {
    id: "neon-red",
    color: "#FF1744",
    glow: "rgba(255,23,68,0.8)",
    label: "Glowing Neon Red",
    emoji: "🔴",
  },
  {
    id: "hot-pink",
    color: "#FF69B4",
    glow: "rgba(255,105,180,0.8)",
    label: "Hot Pink",
    emoji: "💗",
  },
  {
    id: "white",
    color: "#FFFFFF",
    glow: "rgba(255,255,255,0.6)",
    label: "White (Eraser)",
    emoji: "⚪",
  },
];

const BRUSH_SIZE = 12;

export default function DoodlePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMarker, setActiveMarker] = useState(MARKERS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [bgMember, setBgMember] = useState<FamilyMember | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: 800, h: 600 });
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    getFamilyMembers().then((members) => {
      setFamily(members);
      if (members.length > 0) {
        setBgMember(members[Math.floor(Math.random() * members.length)]);
      }
    });
  }, []);

  /* ── Canvas setup ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ── Drawing helpers ── */
  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    []
  );

  const startDraw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      lastPos.current = getPos(e);

      // Draw a dot at the start point
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !lastPos.current) return;
      ctx.beginPath();
      ctx.arc(lastPos.current.x, lastPos.current.y, BRUSH_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = activeMarker.color;
      ctx.fill();

      // Glow effect
      if (activeMarker.id !== "white") {
        ctx.shadowColor = activeMarker.glow;
        ctx.shadowBlur = 15;
      }
    },
    [activeMarker, getPos]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !lastPos.current) return;

      const pos = getPos(e);

      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = activeMarker.color;
      ctx.lineWidth = BRUSH_SIZE;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (activeMarker.id !== "white") {
        ctx.shadowColor = activeMarker.glow;
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }

      ctx.stroke();
      lastPos.current = pos;
    },
    [isDrawing, activeMarker, getPos]
  );

  const endDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }
  }, []);

  /* ── Clear with fade ── */
  const clearCanvas = () => {
    setClearing(true);
    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setClearing(false);
    }, 500);
  };

  /* ── Save with animation ── */
  const handleSave = () => {
    setSaved(true);
    setShowConfetti(true);

    // Download the composite image
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "cakey-doodle.png";
      link.href = canvas.toDataURL();
      link.click();
    }

    setTimeout(() => {
      setSaved(false);
      setShowConfetti(false);
    }, 4000);
  };

  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <HomeButton />

      {showConfetti && (
        <Confetti
          width={windowSize.w}
          height={windowSize.h}
          numberOfPieces={350}
          recycle={false}
          colors={["#E63946", "#FFD700", "#FFB3BA", "#FF69B4", "#FF1744"]}
        />
      )}

      <div className="relative z-10 pt-8 px-4 max-w-5xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-cakey-red text-center mb-4 pt-16 md:pt-8"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          🎨 Family Photo Doodle! 🎨
        </motion.h1>

        {/* Family photo selector */}
        {family.length > 0 && (
          <div className="flex gap-3 justify-center mb-4">
            {family.map((member) => (
              <motion.button
                key={member.id}
                className={`w-14 h-14 rounded-full overflow-hidden border-4 shadow-md ${
                  bgMember?.id === member.id
                    ? "border-cakey-gold scale-110"
                    : "border-cakey-pink"
                }`}
                onClick={() => setBgMember(member)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src={member.image_url}
                  alt={member.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}

        {/* Canvas area */}
        <motion.div
          ref={containerRef}
          className="relative bg-white rounded-3xl border-4 border-cakey-pink shadow-2xl overflow-hidden mx-auto"
          style={{ height: "min(60vh, 500px)" }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={
            saved
              ? { scale: [1, 0.3], opacity: [1, 0] }
              : { scale: 1, opacity: 1 }
          }
          transition={
            saved
              ? { duration: 0.8, ease: "easeIn" }
              : { type: "spring", bounce: 0.3 }
          }
        >
          {/* Background family photo */}
          {bgMember && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Image
                src={bgMember.image_url}
                alt={bgMember.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Canvas overlay — transparent, perfectly layered */}
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full touch-none z-10 transition-opacity duration-500 ${
              clearing ? "opacity-0" : "opacity-100"
            }`}
            style={{ cursor: "crosshair" }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />

          {/* Photo label */}
          {bgMember && (
            <motion.div
              className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold z-20 pointer-events-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {bgMember.name}
            </motion.div>
          )}
        </motion.div>

        {/* Save success overlay */}
        <AnimatePresence>
          {saved && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-cakey-gold text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <span className="text-6xl block mb-4">🖼️</span>
                <p
                  className="text-2xl font-bold text-cakey-red"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Saved to Gallery! ✨
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom Toolbar: Magic Markers ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mt-6 pb-8"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
        >
          {/* Markers */}
          {MARKERS.map((marker) => {
            const isActive = activeMarker.id === marker.id;
            return (
              <motion.button
                key={marker.id}
                className={`
                  flex flex-col items-center justify-center
                  w-20 h-24 md:w-24 md:h-28
                  rounded-2xl border-4 shadow-lg
                  ${
                    isActive
                      ? "border-cakey-gold bg-cakey-gold/20"
                      : "border-cakey-pink bg-white"
                  }
                `}
                onClick={() => setActiveMarker(marker)}
                animate={
                  isActive
                    ? {
                        scale: [1.1, 1.15, 1.1],
                        boxShadow: [
                          `0 0 0px ${marker.glow}`,
                          `0 0 20px ${marker.glow}`,
                          `0 0 0px ${marker.glow}`,
                        ],
                      }
                    : { scale: 1 }
                }
                transition={
                  isActive
                    ? { duration: 1.2, repeat: Infinity }
                    : {}
                }
                whileHover={{ scale: isActive ? 1.15 : 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-10 h-10 rounded-full border-2 border-gray-300 mb-1"
                  style={{
                    backgroundColor: marker.color,
                    boxShadow: isActive
                      ? `0 0 15px ${marker.glow}`
                      : "none",
                  }}
                />
                <span
                  className="text-xs font-bold text-cakey-dark text-center leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {marker.label}
                </span>
              </motion.button>
            );
          })}

          {/* Divider */}
          <div className="w-px h-16 bg-cakey-pink hidden md:block" />

          {/* Clear button */}
          <motion.button
            className="bg-cakey-pink text-cakey-dark text-lg font-bold py-4 px-6 rounded-full shadow-lg border-4 border-white"
            style={{ fontFamily: "var(--font-display)" }}
            onClick={clearCanvas}
            whileHover={{ scale: 1.1, rotate: [-3, 3, 0] }}
            whileTap={{ scale: 0.9 }}
          >
            🗑️ Clear
          </motion.button>

          {/* Save button */}
          <motion.button
            className="bg-cakey-red text-white text-lg font-bold py-4 px-8 rounded-full shadow-2xl border-4 border-cakey-gold"
            style={{ fontFamily: "var(--font-display)" }}
            onClick={handleSave}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(230,57,70,0.3)",
                "0 0 20px rgba(230,57,70,0.7)",
                "0 0 0px rgba(230,57,70,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💾 Save! ✨
          </motion.button>
        </motion.div>

        {/* Cakey helper */}
        <motion.div
          className="fixed bottom-4 right-4 z-40 w-20 h-20"
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="https://www.dreamworks.com/storage/cms-uploads/cakey-hero2.png"
            alt="Cakey"
            width={80}
            height={80}
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </motion.div>
      </div>
    </main>
  );
}
