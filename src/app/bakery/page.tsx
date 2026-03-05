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
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Image from "next/image";
import AnimatedBackground from "@/components/AnimatedBackground";
import HomeButton from "@/components/HomeButton";
import { getFamilyMembers, FamilyMember } from "@/lib/supabase";

/* ── Draggable Topping ─────────────────────────────────── */
function DraggableTopping({
  id,
  emoji,
  label,
  isPlaced,
}: {
  id: string;
  emoji: string;
  label: string;
  isPlaced: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

  if (isPlaced) return null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex flex-col items-center justify-center
        w-24 h-24 md:w-28 md:h-28
        bg-white rounded-2xl shadow-lg border-4 border-cakey-pink
        cursor-grab active:cursor-grabbing touch-none select-none
        transition-transform duration-150 hover:scale-110
        ${isDragging ? "opacity-30" : "opacity-100"}
      `}
    >
      <span className="text-4xl">{emoji}</span>
      <span className="text-xs font-bold text-cakey-red mt-1 text-center leading-tight"
        style={{ fontFamily: "var(--font-display)" }}>{label}</span>
    </div>
  );
}

/* ── Overlay shown while dragging ── */
function ToppingOverlay({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl shadow-2xl border-4 border-cakey-gold scale-115 opacity-90">
      <span className="text-4xl">{emoji}</span>
      <span className="text-xs font-bold text-cakey-red mt-1 text-center leading-tight"
        style={{ fontFamily: "var(--font-display)" }}>{label}</span>
    </div>
  );
}

/* ── Cupcake Drop Zone ─────────────────────────────────── */
function CupcakeDropZone({ placedToppings }: { placedToppings: string[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: "cupcake" });

  return (
    <motion.div ref={setNodeRef}
      className="relative w-56 h-72 md:w-72 md:h-80 flex flex-col items-center justify-end"
      animate={isOver ? { scale: 1.08 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300 }}>
      <div className={`absolute top-0 w-full h-40 rounded-full border-4 transition-colors duration-300 ${
        isOver ? "bg-cakey-gold/40 border-cakey-gold" : "bg-gradient-to-b from-pink-100 to-pink-200 border-pink-300"
      }`}>
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-4">
          <AnimatePresence>
            {placedToppings.map((emoji, i) => (
              <motion.span key={`${emoji}-${i}`} className="text-3xl md:text-4xl"
                initial={{ y: -50, opacity: 0, scale: 0, rotate: -180 }}
                animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6 }}>
                {emoji}
              </motion.span>
            ))}
          </AnimatePresence>
          {placedToppings.length === 0 && (
            <motion.span className="text-pink-400 text-sm font-bold text-center"
              style={{ fontFamily: "var(--font-display)" }}
              animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
              Drop toppings here! ⬇️
            </motion.span>
          )}
        </div>
      </div>
      <div className="relative w-48 h-36 md:w-56 md:h-40">
        <svg viewBox="0 0 200 140" className="w-full h-full">
          <path d="M20,0 L180,0 L160,140 L40,140 Z" fill="#E63946" stroke="#C62828" strokeWidth="4" />
          {[0,1,2,3,4,5,6,7].map((i) => (
            <line key={i} x1={30+i*20} y1="0" x2={45+i*15} y2="140" stroke="#C62828" strokeWidth="1.5" opacity="0.3" />
          ))}
        </svg>
      </div>
    </motion.div>
  );
}

/* ── Toppings Data ─── */
const TOPPINGS = [
  { id: "red-frosting", emoji: "❤️", label: "Red Frosting" },
  { id: "strawberries", emoji: "🍓", label: "Strawberries" },
  { id: "cakey-sprinkles", emoji: "✨", label: "Cakey Sprinkles" },
  { id: "cherry", emoji: "🍒", label: "Cherry on Top" },
  { id: "chocolate", emoji: "🍫", label: "Chocolate" },
  { id: "whipped-cream", emoji: "🍦", label: "Whipped Cream" },
];

/* ── Main ─── */
export default function BakeryPage() {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [queueIdx, setQueueIdx] = useState(0);
  const [placedToppings, setPlacedToppings] = useState<string[]>([]);
  const [placedIds, setPlacedIds] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [serving, setServing] = useState(false);
  const [happyFace, setHappyFace] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: 800, h: 600 });
  const [activeId, setActiveId] = useState<string | null>(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    getFamilyMembers().then(setFamily);
  }, []);

  const currentCustomer = family[queueIdx % family.length] || null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || over.id !== "cupcake") return;
    const topping = TOPPINGS.find((t) => t.id === active.id);
    if (!topping || placedIds.has(topping.id)) return;
    setPlacedToppings((prev) => [...prev, topping.emoji]);
    setPlacedIds((prev) => new Set(prev).add(topping.id));
  }, [placedIds]);

  const handleServe = () => {
    if (serving) return;
    setServing(true);
    setTimeout(() => { setHappyFace(true); setShowConfetti(true); }, 1200);
    setTimeout(() => {
      setServing(false); setHappyFace(false); setShowConfetti(false);
      setPlacedToppings([]); setPlacedIds(new Set()); setQueueIdx((p) => p + 1);
    }, 4000);
  };

  const hasToppings = placedToppings.length > 0;
  const activeTopping = TOPPINGS.find((t) => t.id === activeId);

  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <HomeButton />

      {showConfetti && (
        <Confetti width={windowSize.w} height={windowSize.h} numberOfPieces={350} recycle={false}
          colors={["#E63946", "#FFD700", "#FFB3BA", "#FF69B4", "#FF1744"]} />
      )}

      <div className="relative z-10 pt-8 px-4 max-w-6xl mx-auto">
        <motion.h1 className="text-4xl md:text-5xl font-bold text-cakey-red text-center mb-4 pt-16 md:pt-8"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}>
          🧁 Cakey&apos;s Red Velvet Bakery! 🧁
        </motion.h1>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-center">
            {/* LEFT: Decorating station */}
            <div className="flex flex-col items-center gap-4">
              <motion.h2 className="text-xl font-bold text-cakey-dark" style={{ fontFamily: "var(--font-display)" }}>
                🎀 Decorating Station
              </motion.h2>
              <AnimatePresence>
                {!serving ? (
                  <motion.div key="cupcake-stationary" initial={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0, scale: 0.5, rotate: 15 }} transition={{ duration: 1, ease: "easeIn" }}>
                    <CupcakeDropZone placedToppings={placedToppings} />
                  </motion.div>
                ) : (
                  <motion.div key="cupcake-placeholder" className="w-56 h-72 md:w-72 md:h-80 flex items-center justify-center"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.span className="text-6xl" animate={{ rotate: [0, 360] }} transition={{ duration: 1, repeat: Infinity }}>
                      🧁
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-3 gap-3">
                {TOPPINGS.map((topping, i) => (
                  <motion.div key={topping.id} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.2 + i * 0.08 }}>
                    <DraggableTopping id={topping.id} emoji={topping.emoji} label={topping.label} isPlaced={placedIds.has(topping.id)} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT: Customer queue */}
            <div className="flex flex-col items-center gap-6">
              <motion.h2 className="text-xl font-bold text-cakey-dark" style={{ fontFamily: "var(--font-display)" }}>
                🧑‍🤝‍🧑 Customer Queue
              </motion.h2>
              {currentCustomer && (
                <motion.div className="flex flex-col items-center gap-4"
                  key={currentCustomer.id + queueIdx} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}>
                  <motion.div className="bg-white rounded-3xl px-6 py-3 shadow-lg border-4 border-cakey-pink relative"
                    animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <span className="text-lg font-bold text-cakey-red" style={{ fontFamily: "var(--font-display)" }}>
                      {happyFace ? "YUM! So yummy! 😋" : "I'm hungry! 🧁"}
                    </span>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white" />
                  </motion.div>
                  <motion.div className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-[6px] shadow-2xl ${
                    happyFace ? "border-cakey-gold" : "border-cakey-pink"}`}
                    animate={happyFace ? { scale: [1, 1.3, 1.2], rotate: [0, -10, 10, 0] } : { scale: 1 }}
                    transition={happyFace ? { duration: 0.8 } : {}}>
                    <Image src={currentCustomer.image_url} alt={currentCustomer.name} width={176} height={176} className="w-full h-full object-cover" />
                    {happyFace && (
                      <motion.div className="absolute inset-0 flex items-center justify-center bg-cakey-gold/30"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <span className="text-6xl">😋</span>
                      </motion.div>
                    )}
                  </motion.div>
                  <motion.div className="bg-cakey-red text-white px-5 py-2 rounded-full text-lg font-bold shadow-md"
                    style={{ fontFamily: "var(--font-display)" }}>
                    {currentCustomer.name}
                  </motion.div>
                  <p className="text-sm text-cakey-dark/60 font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    Customer #{queueIdx + 1}
                  </p>
                </motion.div>
              )}

              <AnimatePresence>
                {hasToppings && !serving && (
                  <motion.button
                    className="bg-cakey-red text-white text-2xl md:text-3xl font-bold py-5 px-10 rounded-full shadow-2xl border-4 border-cakey-gold"
                    style={{ fontFamily: "var(--font-display)" }} onClick={handleServe}
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.06, 1], boxShadow: ["0 0 0px rgba(230,57,70,0.4)", "0 0 30px rgba(230,57,70,0.8)", "0 0 0px rgba(230,57,70,0.4)"] }}
                    exit={{ scale: 0 }}
                    transition={{ scale: { duration: 1.2, repeat: Infinity }, boxShadow: { duration: 1.2, repeat: Infinity } }}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    🍽️ Serve! 🍽️
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Floating overlay that follows the cursor/finger */}
          <DragOverlay dropAnimation={{ duration: 300, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
            {activeTopping ? <ToppingOverlay emoji={activeTopping.emoji} label={activeTopping.label} /> : null}
          </DragOverlay>
        </DndContext>

        <motion.div className="fixed bottom-4 right-4 z-40 w-20 h-20"
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <Image src="https://www.dreamworks.com/storage/cms-uploads/cakey-hero2.png" alt="Cakey"
            width={80} height={80} className="w-full h-full object-contain drop-shadow-lg" />
        </motion.div>
      </div>
    </main>
  );
}
