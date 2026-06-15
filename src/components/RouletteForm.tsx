"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus } from "lucide-react";
import { MediaItem } from "@/types";

import { searchMedia } from "@/app/actions";

interface RouletteFormProps {
  slots: (MediaItem | null)[];
  setSlots: (slots: (MediaItem | null)[]) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
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

export default function RouletteForm({ slots, setSlots }: RouletteFormProps) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);

  const handleSelect = (item: MediaItem) => {
    if (activeSlot !== null) {
      const newSlots = [...slots];
      newSlots[activeSlot] = item;
      setSlots(newSlots);
      setActiveSlot(null);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
  };

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
      searchMedia(searchQuery)
        .then(setSearchResults)
        .catch(console.error)
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <motion.div
      className="w-full max-w-[480px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
    >
      {/* Search Modal Overlay */}
      <AnimatePresence>
        {activeSlot !== null && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setActiveSlot(null); setSearchQuery(""); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0a0a0a] border border-[#222] rounded-[24px] shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-[#222] flex items-center gap-3">
                <Search size={20} className="text-white/40" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for a movie or show..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30 text-[16px]"
                />
                <button onClick={() => { setActiveSlot(null); setSearchQuery(""); setSearchResults([]); }} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto scrollbar-none">
                {searchResults.map((item, index) => (
                  <button
                    key={`${item.id}-${index}`}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left p-4 hover:bg-white/5 flex gap-4 items-center transition-colors border-b border-[#222] last:border-none"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.thumbnail} alt={item.title} className="w-12 h-16 object-cover rounded shadow-md" />
                    <div>
                      <div className="font-bold text-white mb-1">{item.title}</div>
                      <div className="text-[12px] text-white/50">{item.runtime} min • ⭐ {item.rating.toFixed(1)}</div>
                    </div>
                  </button>
                ))}
                {isSearching ? (
                  <div className="p-8 text-center text-white/40 flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  <>
                    {searchQuery.length >= 2 && searchResults.length === 0 && (
                      <div className="p-8 text-center text-white/40">No results found for &quot;{searchQuery}&quot;</div>
                    )}
                    {searchQuery.length < 2 && (
                      <div className="p-8 text-center text-white/40">Type to search our database...</div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="mb-12 md:mb-8" variants={itemVariants}>
        <h1 className="text-[48px] md:text-[56px] font-bold tracking-tighter leading-[0.9] mb-2 text-white drop-shadow-2xl">
          Gamble.
        </h1>
        <p className="text-[18px] md:text-[20px] font-light tracking-tight text-white/60 leading-[1.5]">
          Select up to 6 options. Let fate decide.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-4">
        <h3 className="text-[13px] font-bold tracking-[0.2em] text-white/40 uppercase">
          01 &mdash; YOUR PICKS
        </h3>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        {slots.map((item, i) => (
          <motion.div key={i} variants={itemVariants} className="relative aspect-[3/4]">
            {item ? (
              <div className="w-full h-full relative rounded-[12px] overflow-hidden group border border-white/20 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                <button
                  onClick={(e) => handleRemove(e, i)}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500/80 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-md"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveSlot(i)}
                className="w-full h-full border border-white/20 bg-black/40 rounded-[12px] flex flex-col items-center justify-center gap-1.5 hover:bg-white/5 hover:border-white/40 transition-colors group"
              >
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-white/20 transition-colors">
                  <Plus size={14} />
                </div>
                <span className="text-white/30 text-[9px] sm:text-[10px] font-medium group-hover:text-white/60 uppercase tracking-widest">
                  Add
                </span>
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
