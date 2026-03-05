"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import Image from "next/image";
import AnimatedBackground from "@/components/AnimatedBackground";
import HomeButton from "@/components/HomeButton";
import { getFamilyMembers, FamilyMember } from "@/lib/supabase";

const COLORS = [
  { id: "red", hex: "#E63946", label: "Red" },
  { id: "pink", hex: "#FF69B4", label: "Pink" },
  { id: "gold", hex: "#FFD700", label: "Gold" },
  { id: "purple", hex: "#9C27B0", label: "Purple" },
  { id: "blue", hex: "#2196F3", label: "Blue" },
  { id: "green", hex: "#4CAF50", label: "Green" },
  { id: "orange", hex: "#FF9800", label: "Orange" },
  { id: "white", hex: "#FFFFFF", label: "Eraser" },
];

const BRUSH_SIZES = [8, 16, 28, 40];

const STICKERS = ["⭐", "❤️", "🐱", "🧁", "🎀", "✨", "🌈", "🎂", "🍰", "🎉"];

export default function DoodlePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#E63946");
  const [brushSize, setBrushSize] = useState(16);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stickers, setStickers] = useState<{ emoji: string; x: number; y: number; id: number }[]>([]);
  const [stickerMode, setStickerMode] = useState<string | null>(null);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [bgMember, setBgMember] = useState<FamilyMember | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const stickerIdRef = useRef(0);

  useEffect(() => {
    getFamilyMembers().then((members) => {
      setFamily(members);
      if (members.length > 0) {
        setBgMember(members[Math.floor(Math.random() * members.length)]);
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#FFF5F5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
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
  }, []);

  const startDraw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (stickerMode) {
        const pos = getPos(e);
        stickerIdRef.current += 1;
        setStickers((prev) => [
          ...prev,
          { emoji: stickerMode, x: pos.x, y: pos.y, id: stickerIdRef.current },
        ]);
        return;
      }
      setIsDrawing(true);
      lastPos.current = getPos(e);
    },
    [stickerMode, getPos]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || stickerMode) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !lastPos.current) return;

      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      lastPos.current = pos;
    },
    [isDrawing, stickerMode, color, brushSize, getPos]
  );

  const endDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.fillStyle = "#FFF5F5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setStickers([]);
  };

  const celebrate = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <HomeButton />

      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 800}
          height={typeof window !== "undefined" ? window.innerHeight : 600}
          numberOfPieces={300}
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
          🎨 Family Doodle! 🎨
        </motion.h1>

        {/* Background family member selector */}
        {family.length > 0 && (
          <div className="flex gap-2 justify-center mb-4">
            {family.map((member) => (
              <motion.button
                key={member.id}
                className={`w-12 h-12 rounded-full overflow-hidden border-4 ${
                  bgMember?.id === member.id ? "border-cakey-gold" : "border-cakey-pink"
                }`}
                onClick={() => setBgMember(member)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src={member.image_url}
                  alt={member.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          {/* Canvas area */}
          <motion.div
            className="relative flex-1 bg-white rounded-3xl border-4 border-cakey-pink shadow-2xl overflow-hidden"
            style={{ minHeight: 400 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            {/* Background family face (faded) */}
            {bgMember && (
              <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                <Image
                  src={bgMember.image_url}
                  alt={bgMember.name}
                  width={300}
                  height={300}
                  className="w-64 h-64 object-cover rounded-full"
                />
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="w-full h-full min-h-[400px] touch-none cursor-crosshair"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />

            {/* Stickers overlay */}
            {stickers.map((s) => (
              <motion.span
                key={s.id}
                className="absolute text-3xl pointer-events-none select-none"
                style={{ left: s.x - 16, top: s.y - 16 }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6 }}
              >
                {s.emoji}
              </motion.span>
            ))}
          </motion.div>

          {/* Tool palette */}
          <div className="flex md:flex-col gap-3 flex-wrap justify-center">
            {/* Colors */}
            <div className="flex md:flex-col gap-2">
              {COLORS.map((c) => (
                <motion.button
                  key={c.id}
                  className={`w-12 h-12 rounded-full border-4 ${
                    color === c.hex && !stickerMode ? "border-cakey-dark scale-110" : "border-white"
                  } shadow-lg`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => {
                    setColor(c.hex);
                    setStickerMode(null);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title={c.label}
                />
              ))}
            </div>

            {/* Brush sizes */}
            <div className="flex md:flex-col gap-2 items-center">
              {BRUSH_SIZES.map((size) => (
                <motion.button
                  key={size}
                  className={`rounded-full bg-cakey-dark ${
                    brushSize === size ? "ring-4 ring-cakey-gold" : ""
                  }`}
                  style={{ width: size + 12, height: size + 12 }}
                  onClick={() => {
                    setBrushSize(size);
                    setStickerMode(null);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Stickers */}
            <div className="flex md:flex-col gap-1 flex-wrap">
              {STICKERS.map((emoji) => (
                <motion.button
                  key={emoji}
                  className={`text-2xl w-10 h-10 rounded-lg flex items-center justify-center ${
                    stickerMode === emoji ? "bg-cakey-gold border-2 border-cakey-dark" : "bg-white border-2 border-cakey-pink"
                  }`}
                  onClick={() => setStickerMode(stickerMode === emoji ? null : emoji)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center mt-6 pb-8">
          <motion.button
            className="bg-cakey-red text-white text-xl font-bold py-4 px-8 rounded-full shadow-lg border-4 border-cakey-gold"
            style={{ fontFamily: "var(--font-display)" }}
            onClick={celebrate}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✨ Ta-Da! ✨
          </motion.button>

          <motion.button
            className="bg-cakey-pink text-cakey-dark text-xl font-bold py-4 px-8 rounded-full shadow-lg border-4 border-white"
            style={{ fontFamily: "var(--font-display)" }}
            onClick={clearCanvas}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🗑️ Clear
          </motion.button>
        </div>
      </div>
    </main>
  );
}
