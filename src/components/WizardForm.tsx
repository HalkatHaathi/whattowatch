"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mood, Time, ContentType, SortOption } from "@/utils/recommend";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

interface WizardFormProps {
  mood: Mood;
  time: Time;
  type: ContentType;
  sort: SortOption;
  genre: string | null;
  availableGenres: string[];
  onChangeMood: (m: Mood) => void;
  onChangeTime: (t: Time) => void;
  onChangeType: (t: ContentType) => void;
  onChangeSort: (s: SortOption) => void;
  onChangeGenre: (g: string | null) => void;
}

const MOODS: Mood[] = ["Bored", "Eating", "Relaxing", "Hyped"];
const TIMES: Time[] = ["<10 min", "10-30 min", "30-60 min", "60+ min"];
const TYPES: { label: string; value: ContentType }[] = [
  { label: "Movie", value: "movie" },
  { label: "TV Show", value: "show" },
  { label: "Surprise Me", value: "any" }
];

const SORTS: { label: string; value: SortOption }[] = [
  { label: "Recommended", value: "recommended" },
  { label: "Rating", value: "rating" },
  { label: "Most Watched", value: "most watched" },
  { label: "Most Viewed", value: "most viewed" },
  { label: "Newest", value: "newest" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 100, damping: 20 } 
  }
};

export default function WizardForm({ 
  mood, time, type, sort, genre, availableGenres,
  onChangeMood, onChangeTime, onChangeType, onChangeSort, onChangeGenre 
}: WizardFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <motion.div 
      className="w-full max-w-[500px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-4 md:mb-6">
        <h1 className="text-[40px] md:text-[56px] font-black tracking-tighter leading-none mb-3 text-white">
          Configure.
        </h1>
        <p className="text-[18px] md:text-[20px] font-light tracking-tight text-white/60 leading-[1.5]">
          Tap a filter. See magic instantly.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Mood */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <label className="block text-[13px] uppercase tracking-[0.2em] font-bold text-white/40">
            01 — Mood
          </label>
          <div className="flex flex-wrap gap-3">
            {MOODS.map((m) => (
              <motion.button
                key={m}
                onClick={() => onChangeMood(m)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-[16px] py-[10px] rounded-full text-[14px] font-medium transition-colors duration-300 ${
                  mood === m
                    ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    : "bg-transparent text-white/80 border border-white/20 hover:border-white/50 hover:bg-white/10"
                }`}
              >
                {m}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Time */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <label className="block text-[13px] uppercase tracking-[0.2em] font-bold text-white/40">
            02 — Time
          </label>
          <div className="flex flex-wrap gap-3">
            {TIMES.map((t) => (
              <motion.button
                key={t}
                onClick={() => onChangeTime(t)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-[16px] py-[10px] rounded-full text-[14px] font-medium transition-colors duration-300 ${
                  time === t
                    ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    : "bg-transparent text-white/80 border border-white/20 hover:border-white/50 hover:bg-white/10"
                }`}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Type */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <label className="block text-[13px] uppercase tracking-[0.2em] font-bold text-white/40">
            03 — Content
          </label>
          <div className="flex flex-wrap gap-3">
            {TYPES.map((t) => (
              <motion.button
                key={t.value}
                onClick={() => onChangeType(t.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-[16px] py-[10px] rounded-full text-[14px] font-medium transition-colors duration-300 ${
                  type === t.value
                    ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    : "bg-transparent text-white/80 border border-white/20 hover:border-white/50 hover:bg-white/10"
                }`}
              >
                {t.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Advanced Features Toggle */}
        <motion.div variants={itemVariants} className="pt-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-[13px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            Advanced Features
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </motion.div>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-6 overflow-hidden"
            >
              {/* Sort By */}
              <div className="space-y-3 pt-2">
                <label className="block text-[13px] uppercase tracking-[0.2em] font-bold text-white/40">
                  Sort By
                </label>
                <div className="flex flex-wrap gap-2">
                  {SORTS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => onChangeSort(s.value)}
                      className={`px-[14px] py-[8px] rounded-full text-[13px] font-medium transition-colors duration-300 cursor-pointer ${
                        sort === s.value
                          ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                          : "bg-transparent text-white/60 border border-white/10 hover:border-white/30 hover:bg-white/5"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div className="space-y-3">
                <label className="block text-[13px] uppercase tracking-[0.2em] font-bold text-white/40">
                  Genre
                </label>
                <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto scrollbar-none pr-2">
                  <button
                    onClick={() => onChangeGenre(null)}
                    className={`px-[12px] py-[6px] rounded-full text-[12px] font-medium transition-colors duration-300 flex-shrink-0 cursor-pointer ${
                      genre === null
                        ? "bg-white text-black"
                        : "bg-transparent text-white/50 border border-white/10 hover:border-white/30 hover:bg-white/5"
                    }`}
                  >
                    Any
                  </button>
                  {availableGenres.map((g) => (
                    <button
                      key={g}
                      onClick={() => onChangeGenre(g)}
                      className={`px-[12px] py-[6px] rounded-full text-[12px] font-medium transition-colors duration-300 flex-shrink-0 cursor-pointer ${
                        genre === g
                          ? "bg-white text-black"
                          : "bg-transparent text-white/50 border border-white/10 hover:border-white/30 hover:bg-white/5"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

