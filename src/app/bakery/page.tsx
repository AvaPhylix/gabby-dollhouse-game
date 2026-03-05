"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Image from "next/image";
import AnimatedBackground from "@/components/AnimatedBackground";
import HomeButton from "@/components/HomeButton";

const INGREDIENTS = [
  { id: "flour", emoji: "🌾", label: "Flour", color: "bg-amber-100" },
  { id: "sugar", emoji: "🍬", label: "Sugar", color: "bg-pink-100" },
  { id: "eggs", emoji: "🥚", label: "Eggs", color: "bg-yellow-100" },
  { id: "butter", emoji: "🧈", label: "Butter", color: "bg-yellow-200" },
  { id: "red-dye", emoji: "❤️", label: "Red Color!", color: "bg-red-200" },
  { id: "sprinkles", emoji: "✨", label: "Sprinkles", color: "bg-purple-100" },
];

const TOPPINGS = [
  { id: "cherry", emoji: "🍒", label: "Cherry" },
  { id: "strawberry", emoji: "🍓", label: "Strawberry" },
  { id: "heart", emoji: "❤️", label: "Heart" },
  { id: "star", emoji: "⭐", label: "Star" },
  { id: "rainbow", emoji: "🌈", label: "Rainbow" },
  { id: "cat", emoji: "🐱", label: "Cakey!" },
];

type BakeStage = "mix" | "bake" | "decorate" | "done";

export default function BakeryPage() {
  const [stage, setStage] = useState<BakeStage>("mix");
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bowlShake, setBowlShake] = useState(false);

  const addIngredient = useCallback((id: string) => {
    if (addedIngredients.includes(id)) return;
    setAddedIngredients((prev) => [...prev, id]);
    setBowlShake(true);
    setTimeout(() => setBowlShake(false), 500);
  }, [addedIngredients]);

  const allIngredientsAdded = addedIngredients.length === INGREDIENTS.length;

  const handleBake = () => {
    setStage("bake");
    setTimeout(() => setStage("decorate"), 3000);
  };

  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleDone = () => {
    setStage("done");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const resetGame = () => {
    setStage("mix");
    setAddedIngredients([]);
    setSelectedToppings([]);
    setShowConfetti(false);
  };

  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <HomeButton />

      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 800}
          height={typeof window !== "undefined" ? window.innerHeight : 600}
          numberOfPieces={400}
          recycle={false}
          colors={["#E63946", "#FFD700", "#FFB3BA", "#FF69B4", "#FF1744"]}
        />
      )}

      <div className="relative z-10 pt-8 px-4 max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-cakey-red text-center mb-6 pt-16 md:pt-8"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          🧁 Red Velvet Bakery! 🧁
        </motion.h1>

        {/* Cakey assistant */}
        <motion.div
          className="fixed bottom-4 right-4 z-40 w-24 h-24"
          animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="https://www.dreamworks.com/storage/cms-uploads/cakey-hero2.png"
            alt="Cakey helper"
            width={96}
            height={96}
            className="w-full h-full object-contain drop-shadow-lg"
          />
          <motion.div
            className="absolute -top-12 -left-20 bg-white rounded-2xl px-3 py-1 text-sm font-bold text-cakey-red shadow-lg border-2 border-cakey-pink whitespace-nowrap"
            style={{ fontFamily: "var(--font-display)" }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {stage === "mix" && "Add ingredients! 🥣"}
            {stage === "bake" && "It's baking! 🔥"}
            {stage === "decorate" && "Decorate it! 🎀"}
            {stage === "done" && "Yummy! 😋"}
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* MIXING STAGE */}
          {stage === "mix" && (
            <motion.div
              key="mix"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Mixing bowl */}
              <motion.div
                className="relative w-48 h-48 md:w-64 md:h-64 bg-gradient-to-b from-red-300 to-cakey-red rounded-[50%] border-8 border-cakey-dark shadow-2xl flex items-center justify-center overflow-hidden"
                animate={bowlShake ? { rotate: [-5, 5, -3, 3, 0], scale: [1, 1.05, 1] } : {}}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
              >
                {/* Show added ingredients in bowl */}
                <div className="flex flex-wrap gap-1 justify-center p-4">
                  {addedIngredients.map((id) => {
                    const ing = INGREDIENTS.find((i) => i.id === id);
                    return (
                      <motion.span
                        key={id}
                        className="text-3xl"
                        initial={{ y: -60, opacity: 0, rotate: -180 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                      >
                        {ing?.emoji}
                      </motion.span>
                    );
                  })}
                </div>
                {addedIngredients.length === 0 && (
                  <span className="text-white/50 text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                    Tap to add! ⬇️
                  </span>
                )}
              </motion.div>

              {/* Ingredient buttons */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                {INGREDIENTS.map((ing, i) => (
                  <motion.button
                    key={ing.id}
                    className={`
                      ${ing.color} rounded-2xl p-4 text-center shadow-lg border-4
                      ${addedIngredients.includes(ing.id) ? "border-green-400 opacity-50" : "border-cakey-pink"}
                      min-h-[90px] flex flex-col items-center justify-center
                    `}
                    onClick={() => addIngredient(ing.id)}
                    disabled={addedIngredients.includes(ing.id)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: i * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-3xl">{ing.emoji}</span>
                    <span className="text-sm font-bold text-cakey-dark mt-1" style={{ fontFamily: "var(--font-display)" }}>
                      {ing.label}
                    </span>
                    {addedIngredients.includes(ing.id) && <span className="text-green-600">✓</span>}
                  </motion.button>
                ))}
              </div>

              {allIngredientsAdded && (
                <motion.button
                  className="bg-cakey-red text-white text-2xl font-bold py-5 px-10 rounded-full shadow-2xl border-4 border-cakey-gold"
                  style={{ fontFamily: "var(--font-display)" }}
                  onClick={handleBake}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0px rgba(230,57,70,0.5)",
                      "0 0 25px rgba(230,57,70,0.8)",
                      "0 0 0px rgba(230,57,70,0.5)",
                    ],
                  }}
                  transition={{
                    scale: { duration: 1, repeat: Infinity },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  🔥 Put in the Oven! 🔥
                </motion.button>
              )}
            </motion.div>
          )}

          {/* BAKING STAGE */}
          {stage === "bake" && (
            <motion.div
              key="bake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 py-12"
            >
              <motion.div
                className="relative w-64 h-48 bg-gradient-to-b from-gray-700 to-gray-900 rounded-3xl border-8 border-gray-600 shadow-2xl flex items-center justify-center overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,100,0,0.3)",
                    "0 0 60px rgba(255,100,0,0.8)",
                    "0 0 20px rgba(255,100,0,0.3)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.span
                  className="text-7xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🔥
                </motion.span>
              </motion.div>

              <motion.p
                className="text-3xl font-bold text-cakey-red"
                style={{ fontFamily: "var(--font-display)" }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                Baking... 🧁
              </motion.p>

              {/* Timer dots */}
              <div className="flex gap-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-6 h-6 bg-cakey-red rounded-full"
                    animate={{ scale: [0, 1, 0] }}
                    transition={{ duration: 1, delay: i * 0.3, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* DECORATE STAGE */}
          {stage === "decorate" && (
            <motion.div
              key="decorate"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Cupcake */}
              <motion.div
                className="relative w-48 h-56"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                {/* Cupcake base */}
                <div className="absolute bottom-0 w-full h-28 bg-gradient-to-b from-red-400 to-cakey-red rounded-b-3xl rounded-t-lg border-4 border-cakey-dark" />
                {/* Frosting */}
                <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-pink-200 to-pink-400 rounded-full border-4 border-pink-300" />
                {/* Selected toppings */}
                <div className="absolute top-2 w-full flex flex-wrap justify-center gap-1 px-4">
                  <AnimatePresence>
                    {selectedToppings.map((id) => {
                      const topping = TOPPINGS.find((t) => t.id === id);
                      return (
                        <motion.span
                          key={id}
                          className="text-3xl"
                          initial={{ y: -40, opacity: 0, scale: 0 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", bounce: 0.6 }}
                        >
                          {topping?.emoji}
                        </motion.span>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Topping buttons */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                {TOPPINGS.map((topping, i) => (
                  <motion.button
                    key={topping.id}
                    className={`
                      bg-white rounded-2xl p-4 text-center shadow-lg border-4
                      ${selectedToppings.includes(topping.id) ? "border-cakey-gold bg-cakey-gold/20" : "border-cakey-pink"}
                      min-h-[90px] flex flex-col items-center justify-center
                    `}
                    onClick={() => toggleTopping(topping.id)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: i * 0.08 }}
                    whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-3xl">{topping.emoji}</span>
                    <span className="text-sm font-bold text-cakey-dark mt-1" style={{ fontFamily: "var(--font-display)" }}>
                      {topping.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              <motion.button
                className="bg-cakey-red text-white text-2xl font-bold py-5 px-10 rounded-full shadow-2xl border-4 border-cakey-gold"
                style={{ fontFamily: "var(--font-display)" }}
                onClick={handleDone}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎉 All Done! 🎉
              </motion.button>
            </motion.div>
          )}

          {/* DONE STAGE */}
          {stage === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 py-12"
            >
              <motion.div
                className="text-8xl"
                animate={{
                  rotate: [0, -10, 10, -5, 5, 0],
                  scale: [1, 1.2, 1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🧁
              </motion.div>

              <motion.h2
                className="text-4xl font-bold text-cakey-red text-center"
                style={{ fontFamily: "var(--font-display)" }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Yummy! You made it! 🎀
              </motion.h2>

              <div className="flex gap-2 text-5xl">
                {selectedToppings.map((id) => {
                  const topping = TOPPINGS.find((t) => t.id === id);
                  return <span key={id}>{topping?.emoji}</span>;
                })}
              </div>

              <motion.button
                className="bg-cakey-pink text-cakey-dark text-2xl font-bold py-5 px-10 rounded-full shadow-2xl border-4 border-white"
                style={{ fontFamily: "var(--font-display)" }}
                onClick={resetGame}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                🔄 Bake Again!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
