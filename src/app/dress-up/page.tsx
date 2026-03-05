"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Image from "next/image";
import AnimatedBackground from "@/components/AnimatedBackground";
import HomeButton from "@/components/HomeButton";
import DraggableItem from "@/components/DraggableItem";
import DropZone from "@/components/DropZone";
import { getFamilyMembers, FamilyMember } from "@/lib/supabase";

const WARDROBE_ITEMS = [
  { id: "chef-hat", emoji: "👨‍🍳", label: "Red Chef Hat", zone: "head" },
  { id: "cakey-ears", emoji: "🐱", label: "Cakey Ears", zone: "head" },
  { id: "apron", emoji: "🎀", label: "Sprinkle Apron", zone: "body" },
  { id: "mitts", emoji: "🧤", label: "Oven Mitts", zone: "hands" },
];

const DROP_ZONES = [
  { id: "head", label: "Head", className: "absolute top-2 left-1/2 -translate-x-1/2" },
  { id: "body", label: "Body", className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  { id: "hands", label: "Hands", className: "absolute bottom-8 left-1/2 -translate-x-1/2" },
];

/* Floating overlay shown while dragging */
function OverlayItem({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 bg-white rounded-2xl shadow-2xl border-4 border-cakey-gold scale-110 opacity-90"
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

export default function DressUpPage() {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: 800, h: 600 });
  const [activeId, setActiveId] = useState<string | null>(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    getFamilyMembers().then((members) => {
      setFamily(members);
      if (members.length > 0) {
        setCurrentMember(members[Math.floor(Math.random() * members.length)]);
      }
    });
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const item = WARDROBE_ITEMS.find((w) => w.id === active.id);
    if (!item) return;
    if (item.zone === over.id) {
      setPlacements((prev) => ({ ...prev, [over.id as string]: item.emoji }));
    }
  }, []);

  const handleTaDa = () => {
    setShowConfetti(true);
    setIsSpinning(true);
    setTimeout(() => { setIsSpinning(false); setShowConfetti(false); }, 4000);
  };

  const handleNewModel = () => {
    if (family.length === 0) return;
    setCurrentMember(family[Math.floor(Math.random() * family.length)]);
    setPlacements({});
    setShowConfetti(false);
    setIsSpinning(false);
  };

  const allPlaced = WARDROBE_ITEMS.every((item) => placements[item.zone] !== undefined);
  const activeItem = WARDROBE_ITEMS.find((w) => w.id === activeId);

  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <HomeButton />

      {showConfetti && (
        <Confetti width={windowSize.w} height={windowSize.h} numberOfPieces={300} recycle={false}
          colors={["#E63946", "#FFD700", "#FFB3BA", "#FF69B4", "#FF1744"]} />
      )}

      <div className="relative z-10 pt-8 px-4 max-w-6xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-cakey-red text-center mb-6 pt-16 md:pt-8"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          👩‍🍳 Cat-Tastic Chef Dress-Up! 👩‍🍳
        </motion.h1>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
            {/* Mannequin */}
            <motion.div
              className="relative bg-white/70 rounded-[40px] border-4 border-cakey-pink shadow-2xl w-72 h-96 flex flex-col items-center justify-center"
              animate={isSpinning ? { rotateY: [0, 360, 720] } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              {currentMember && (
                <motion.div className="absolute top-16 w-28 h-28 rounded-full overflow-hidden border-4 border-cakey-gold shadow-lg z-20"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6, delay: 0.3 }}>
                  <Image src={currentMember.image_url} alt={currentMember.name} width={112} height={112} className="w-full h-full object-cover" />
                </motion.div>
              )}
              {currentMember && (
                <motion.div className="absolute top-48 bg-cakey-red text-white px-4 py-1 rounded-full text-lg font-bold shadow-md z-20"
                  style={{ fontFamily: "var(--font-display)" }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.5 }}>
                  {currentMember.name}
                </motion.div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <svg viewBox="0 0 200 350" className="w-48 h-72">
                  <circle cx="100" cy="50" r="40" fill="#FFB3BA" />
                  <ellipse cx="100" cy="180" rx="60" ry="90" fill="#FFB3BA" />
                  <rect x="30" y="270" width="30" height="70" rx="15" fill="#FFB3BA" />
                  <rect x="140" y="270" width="30" height="70" rx="15" fill="#FFB3BA" />
                </svg>
              </div>
              {DROP_ZONES.map((zone) => (
                <DropZone key={zone.id} id={zone.id} label={zone.label} placedEmoji={placements[zone.id]} className={zone.className} />
              ))}
            </motion.div>

            {/* Wardrobe */}
            <div className="flex flex-col items-center gap-4">
              <motion.h2 className="text-2xl font-bold text-cakey-dark" style={{ fontFamily: "var(--font-display)" }}
                initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                🎀 Wardrobe 🎀
              </motion.h2>
              <div className="grid grid-cols-2 gap-4">
                {WARDROBE_ITEMS.map((item, i) => (
                  <motion.div key={item.id} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4, delay: 0.3 + i * 0.1 }}>
                    <DraggableItem id={item.id} emoji={item.emoji} label={item.label} isPlaced={placements[item.zone] === item.emoji} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* This is the floating element that follows the cursor */}
          <DragOverlay dropAnimation={{ duration: 300, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
            {activeItem ? <OverlayItem emoji={activeItem.emoji} label={activeItem.label} /> : null}
          </DragOverlay>
        </DndContext>

        <div className="flex flex-wrap gap-4 justify-center mt-8 pb-8">
          <AnimatePresence>
            {allPlaced && (
              <motion.button
                className="bg-cakey-red text-white text-3xl font-bold py-5 px-12 rounded-full shadow-2xl border-4 border-cakey-gold"
                style={{ fontFamily: "var(--font-display)" }} onClick={handleTaDa}
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(230,57,70,0.5)", "0 0 30px rgba(230,57,70,0.8)", "0 0 0px rgba(230,57,70,0.5)"] }}
                exit={{ scale: 0 }} transition={{ scale: { duration: 1, repeat: Infinity }, boxShadow: { duration: 1, repeat: Infinity } }}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                ✨ Ta-Da! ✨
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            className="bg-cakey-pink text-cakey-dark text-xl font-bold py-4 px-8 rounded-full shadow-lg border-4 border-white"
            style={{ fontFamily: "var(--font-display)" }} onClick={handleNewModel}
            whileHover={{ scale: 1.08, rotate: [-3, 3, 0] }} whileTap={{ scale: 0.95 }}>
            🔄 New Model!
          </motion.button>
        </div>
      </div>
    </main>
  );
}
