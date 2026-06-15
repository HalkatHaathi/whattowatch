"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { MediaItem } from "@/types";

interface RouletteSpinnerProps {
  options: MediaItem[];
  onReset: () => void;
  onFinished: (winner: MediaItem) => void;
}

const RARITIES = [
  "#4b69ff", // Mil-Spec Blue
  "#8847ff", // Restricted Purple
  "#d32ce6", // Classified Pink
  "#eb4b4b", // Covert Red
  "#ffd700", // Exceedingly Rare Gold
];

interface TrackItem extends MediaItem {
  rarity: string;
}

export default function RouletteSpinner({ options, onReset, onFinished }: RouletteSpinnerProps) {
  const [track, setTrack] = useState<TrackItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Stable references to prevent parent re-renders from re-triggering the useEffect
  const optionsRef = useRef(options);
  const onFinishedRef = useRef(onFinished);

  const TOTAL_ITEMS = 100;
  const CARD_WIDTH = 130; // Shrunk card width for standard vertical posters
  const GAP = 12;
  const ITEM_WIDTH = CARD_WIDTH + GAP; // 142px

  // Keep references up to date
  useEffect(() => {
    optionsRef.current = options;
    onFinishedRef.current = onFinished;
  });

  useEffect(() => {
    const opts = optionsRef.current;
    if (opts.length === 0) return;

    // Pick a winner at index 80
    const targetIndex = 80;
    const pickedWinner = opts[Math.floor(Math.random() * opts.length)];

    // Generate a random track of 100 items, placing the winner at index 80
    // and filtering out consecutive duplicates.
    const newTrack: TrackItem[] = [];
    let prevItem: MediaItem | null = null;

    for (let i = 0; i < TOTAL_ITEMS; i++) {
      let selectedItem: MediaItem;

      if (i === targetIndex) {
        selectedItem = pickedWinner;
      } else {
        // Exclude prevItem to avoid adjacent duplicates.
        // Also exclude pickedWinner if the next item (i+1) is the target index.
        const availableOptions = opts.filter(opt => {
          const isPrev = prevItem && opt.id === prevItem.id;
          const isNextTargetWinner = (i + 1 === targetIndex) && opt.id === pickedWinner.id;
          return !isPrev && !isNextTargetWinner;
        });

        const finalOptions = availableOptions.length > 0 ? availableOptions : opts;
        selectedItem = finalOptions[Math.floor(Math.random() * finalOptions.length)];
      }

      newTrack.push({
        ...selectedItem,
        rarity: RARITIES[Math.floor(Math.random() * RARITIES.length)],
      });
      prevItem = selectedItem;
    }

    setTrack(newTrack);

    // Measure layout and run animation after DOM renders
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const centerOffset = containerWidth / 2;

      // Position of target item relative to start of track
      const targetPosition = (targetIndex * ITEM_WIDTH) + (CARD_WIDTH / 2);

      // Random jitter so it doesn't land perfectly centered every time
      const jitter = (Math.random() - 0.5) * (CARD_WIDTH - 20); // Leave a margin of 10px on each side

      const finalTranslateX = centerOffset - targetPosition + jitter;

      controls.set({ x: 0 });
      controls.start({
        x: finalTranslateX,
        transition: {
          duration: 7.5,
          ease: [0.15, 0.95, 0.2, 1], // Heavy deceleration curve simulating inertia
        },
      }).then(() => {
        // Delay callback slightly to allow winner impact to settle
        setTimeout(() => {
          onFinishedRef.current(pickedWinner);
        }, 300);
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [controls, ITEM_WIDTH]); // Triggers ONLY ONCE on mount

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-center min-h-[400px]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-[800px] flex flex-col items-center gap-6">
        
        {/* Spinner Slider Box (Seamless & Wide) */}
        <div 
          ref={containerRef}
          className="relative w-full lg:w-[650px] lg:-ml-16 h-[240px] bg-transparent overflow-hidden flex items-center"
        >
          {/* Edge Gradient Mask - Left (Wider Fade) */}
          <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

          {/* Edge Gradient Mask - Right (Wider Fade) */}
          <div className="absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

          {/* CS:GO Yellow Needle Center Pointer (Fading ends) */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-1/2 h-[220px] w-[3px] z-20 -translate-x-1/2 shadow-[0_0_15px_rgba(250,204,21,0.8)] pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #facc15 15%, #facc15 85%, transparent)" }}
          />

          {/* Animated Carousel Track */}
          <motion.div 
            animate={controls}
            className="flex flex-row items-center absolute left-0"
            style={{ gap: `${GAP}px` }}
          >
            {track.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="w-[130px] h-[195px] relative bg-[#151515] rounded-[16px] border border-white/10 overflow-hidden flex-shrink-0 group shadow-2xl flex flex-col"
                style={{ boxShadow: `0 8px 30px rgba(0,0,0,0.6), inset 0 -4px 0 ${item.rarity}` }}
              >
                {/* Movie Poster Image (Full 2:3 Aspect) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Info Text */}
        <p className="text-[13px] tracking-wider text-white/30 uppercase font-medium">
          Spinning options... Fate is deciding.
        </p>
      </div>
    </motion.div>
  );
}
