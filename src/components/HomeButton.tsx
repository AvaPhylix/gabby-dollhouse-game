"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home } from "lucide-react";

export default function HomeButton() {
  return (
    <Link href="/">
      <motion.div
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-20 h-20 bg-cakey-red rounded-2xl shadow-lg cursor-pointer border-4 border-cakey-gold"
        whileHover={{
          scale: 1.15,
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.4 },
        }}
        whileTap={{ scale: 0.9 }}
        style={{
          clipPath:
            "polygon(50% 0%, 100% 35%, 100% 100%, 65% 100%, 65% 65%, 35% 65%, 35% 100%, 0% 100%, 0% 35%)",
        }}
      >
        <Home className="text-white mt-4" size={32} strokeWidth={3} />
      </motion.div>
    </Link>
  );
}
