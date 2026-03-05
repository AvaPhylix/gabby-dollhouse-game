"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { getFamilyMembers, FamilyMember } from "@/lib/supabase";
import Image from "next/image";

const GAMES = [
  {
    title: "Chef Dress-Up",
    emoji: "👩‍🍳",
    description: "Dress up your family as silly chefs!",
    href: "/dress-up",
    color: "from-cakey-red to-red-700",
    delay: 0,
  },
  {
    title: "Red Velvet Bakery",
    emoji: "🧁",
    description: "Bake yummy red velvet treats!",
    href: "/bakery",
    color: "from-pink-500 to-cakey-red",
    delay: 0.15,
  },
  {
    title: "Family Doodle",
    emoji: "🎨",
    description: "Draw and doodle with family!",
    href: "/doodle",
    color: "from-cakey-gold to-orange-500",
    delay: 0.3,
  },
];

export default function HomePage() {
  const [family, setFamily] = useState<FamilyMember[]>([]);

  useEffect(() => {
    getFamilyMembers().then(setFamily);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <AnimatedBackground />

      {/* Floating family face bubbles in background */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        {family.map((member, i) => (
          <motion.div
            key={member.id}
            className="absolute w-16 h-16 rounded-full overflow-hidden border-4 border-cakey-pink shadow-lg opacity-40"
            style={{
              left: `${15 + i * 18}%`,
              top: `${10 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-15, 15, -15],
              rotate: [-10, 10, -10],
            }}
            transition={{
              duration: 5 + i,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={member.image_url}
              alt={member.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Title */}
      <motion.div
        className="relative z-10 text-center mb-8"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.6, duration: 1 }}
      >
        {/* Cakey character */}
        <motion.div
          className="mx-auto mb-4 w-40 h-40 relative"
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="https://www.dreamworks.com/storage/cms-uploads/cakey-hero2.png"
            alt="Cakey Cat"
            width={160}
            height={160}
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>

        <h1
          className="text-5xl md:text-7xl font-bold text-cakey-red drop-shadow-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Cakey&apos;s Playhouse!
        </h1>
        <motion.p
          className="text-2xl text-cakey-dark mt-2 font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨ Pick a game to play! ✨
        </motion.p>
      </motion.div>

      {/* Game cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
        {GAMES.map((game) => (
          <Link key={game.href} href={game.href}>
            <motion.div
              className={`bg-gradient-to-br ${game.color} rounded-3xl p-8 text-center text-white shadow-2xl cursor-pointer border-4 border-white/30 min-h-[220px] flex flex-col items-center justify-center`}
              initial={{ y: 80, opacity: 0, rotate: -5 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{
                type: "spring",
                bounce: 0.5,
                delay: game.delay,
                duration: 0.8,
              }}
              whileHover={{
                scale: 1.08,
                rotate: [0, -3, 3, -2, 0],
                transition: { rotate: { duration: 0.5 } },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="text-6xl mb-3 block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {game.emoji}
              </motion.span>
              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {game.title}
              </h2>
              <p className="text-lg opacity-90" style={{ fontFamily: "var(--font-body)" }}>
                {game.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Girl images as decorative elements */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around pointer-events-none z-[1] opacity-30">
        <motion.div
          className="w-24 h-32 relative"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Image
            src="https://media.gettyimages.com/id/182246934/photo/an-asian-girl-wearing-a-green-t-shirt.jpg?s=612x612&w=gi&k=20&c=Z6q5WCJjzZDUYy1AcuOOfNcqbFQ_pf3bgc-WF8_cj0Y="
            alt="Girl 1"
            width={96}
            height={128}
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
        <motion.div
          className="w-24 h-32 relative"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        >
          <Image
            src="https://www.shutterstock.com/image-photo/head-shot-portrait-6-7-260nw-1484884859.jpg"
            alt="Girl 2"
            width={96}
            height={128}
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
        <motion.div
          className="w-24 h-32 relative"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          <Image
            src="https://media.istockphoto.com/id/521200407/photo/cheerful-little-asian-chinese-girl-sitting-on-a-chair.jpg?s=1024x1024&w=is&k=20&c=kZfDGDJRv0oX4fWzW85E5-fSYyJ-4NSBotlMJLO2xuE="
            alt="Girl 3"
            width={96}
            height={128}
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
      </div>
    </main>
  );
}
