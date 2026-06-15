"use client";

import { motion } from "framer-motion";
import { Play, RotateCw, Bookmark } from "lucide-react";
import { MediaItem } from "@/types";

interface RecommendationCardProps {
  item: MediaItem;
  onReroll: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 80, damping: 20, staggerChildren: 0.08, delayChildren: 0.1 }
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 20 } }
};

export default function RecommendationCard({ item, onReroll, isSaved, onToggleSave }: RecommendationCardProps) {
  return (
    <motion.div
      className="w-full flex flex-col items-center"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={item.id}
    >

      {/* Product Imagery */}
      <motion.div
        className="relative w-full max-w-[240px] mx-auto group flex flex-col items-center"
        variants={itemVariants}
      >
        {/* Glowing "NOW SHOWING" Header */}
        <div 
          className="w-full pb-4 flex justify-between items-center text-white text-[16px] md:text-[20px] font-black uppercase font-sans leading-none"
          style={{ 
            textShadow: "0 0 4px #fff, 0 0 10px #fff, 0 0 20px #0ff, 0 0 40px #0ff, 0 0 80px #0ff" 
          }}
        >
          {"NOW SHOWING".split("").map((char, index) => (
            <span key={index}>{char === " " ? "\u00A0\u00A0" : char}</span>
          ))}
        </div>

        <div className="relative aspect-[2/3] w-full overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {/* Bookmark Button */}
          <button 
            onClick={onToggleSave}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white backdrop-blur-md transition-all z-10 border border-white/10 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            title={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
          >
            <Bookmark className={isSaved ? "fill-yellow-400 text-yellow-400" : "text-white"} size={16} />
          </button>
          {/* Cinematic Glare Overlay (simulating backlit lightbox) */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen" />
        </div>
      </motion.div>

      {/* Tile Headline Stack */}
      <div className="text-center mt-5 w-full">
        <motion.h2
          className="text-[24px] md:text-[28px] font-bold tracking-tighter leading-[1.05] text-white mb-2 drop-shadow-xl"
          variants={itemVariants}
        >
          {item.title}
        </motion.h2>

        <motion.p
          className="text-[13px] md:text-[14px] font-medium tracking-wider text-white/60 mb-3 uppercase"
          variants={itemVariants}
        >
          {item.runtime} min <span className="mx-2 opacity-50">•</span> <span className="capitalize">{item.type}</span> <span className="mx-2 opacity-50">•</span> ⭐ {item.rating.toFixed(1)}
        </motion.p>

        <motion.p
          className="text-[13px] text-white/50 leading-[1.5] tracking-tight mb-4 max-w-[480px] mx-auto line-clamp-2 md:line-clamp-3"
          variants={itemVariants}
        >
          {item.description || "No description available."}
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          variants={itemVariants}
        >
          <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white text-black px-[18px] py-[8px] rounded-full text-[13px] font-bold tracking-tight transition-colors hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <Play size={14} fill="currentColor" /> Watch Now
          </motion.a>

          <motion.button
            onClick={onReroll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white/5 text-white border border-white/10 px-[18px] py-[8px] rounded-full text-[13px] font-medium tracking-tight transition-colors hover:bg-white/10 hover:border-white/30 backdrop-blur-md"
          >
            <RotateCw size={14} /> Not feeling it
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
