"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Home } from "lucide-react";
import LEDNavbar from "@/components/LEDNavbar";
import dataJson from "../../public/data.json";

export default function NotFound() {
  // Select first movie (Severance) for a beautiful cinematic poster background
  const sampleMovie = dataJson[0];

  return (
    <main className="w-full h-screen pt-20 overflow-hidden relative bg-[#0a0a0a] text-white flex items-center justify-center">
      <LEDNavbar />

      {/* Dynamic Ambient Cinematic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
        {sampleMovie && (
          <div 
            className="absolute inset-[-20%] w-[140%] h-[140%] bg-cover bg-center blur-[80px] saturate-150 transform-gpu opacity-40"
            style={{ backgroundImage: `url(${sampleMovie.thumbnail})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
      </div>

      {/* 404 Center Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="max-w-[440px] w-full mx-6 p-10 bg-black/40 border border-white/10 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center relative z-10 flex flex-col items-center gap-6"
      >
        <div 
          className="text-red-500 text-[96px] md:text-[110px] tracking-[0.1em] drop-shadow-[0_0_15px_rgba(239,68,68,0.85)] uppercase leading-none font-black animate-pulse select-none mb-2"
          style={{ fontFamily: "var(--font-led)" }}
        >
          404
        </div>

        <div>
          <h1 className="text-[28px] font-black uppercase tracking-tighter leading-none text-white mb-3">
            Scene Not Found
          </h1>
          <p className="text-white/50 text-[13px] leading-relaxed max-w-[320px] mx-auto font-light">
            The page you are looking for has been cut from the final release or moved to another reel.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-2"
        >
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-full text-[13px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.25)] cursor-pointer"
          >
            <Home size={15} /> Return to lobby
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
