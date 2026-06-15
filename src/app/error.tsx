"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, RotateCw, Home } from "lucide-react";
import LEDNavbar from "@/components/LEDNavbar";
import dataJson from "../../public/data.json";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Playback / Server error:", error);
  }, [error]);

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

      {/* 500 Center Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="max-w-[440px] w-full mx-6 p-10 bg-black/40 border border-white/10 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center relative z-10 flex flex-col items-center gap-6"
      >
        <div className="p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
          <AlertCircle size={36} className="stroke-1.5 animate-pulse" />
        </div>

        <div>
          <span className="text-[11px] tracking-[0.25em] font-black text-yellow-500 uppercase mb-2 block">
            Error Code 500
          </span>
          <h1 className="text-[32px] font-black uppercase tracking-tighter leading-none text-white mb-3">
            Projection Error
          </h1>
          <p className="text-white/50 text-[13px] leading-relaxed max-w-[320px] mx-auto font-light">
            A critical glitch occurred during the playback sequence. We are attempting to fix the projector.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <motion.button
            onClick={() => reset()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-full text-[13px] font-bold tracking-widest uppercase transition-colors hover:bg-gray-200 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.25)]"
          >
            <RotateCw size={14} /> Retry
          </motion.button>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Link
              href="/"
              className="w-full h-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-3 rounded-full text-[13px] font-bold tracking-widest uppercase hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer text-center"
            >
              <Home size={14} /> Lobby
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
