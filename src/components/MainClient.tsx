"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wand2, Dices, X, ExternalLink, RotateCw, Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { MediaItem } from "@/types";
import WizardForm from "./WizardForm";
import RecommendationCard from "./RecommendationCard";
import RouletteForm from "./RouletteForm";
import RouletteSpinner from "./RouletteSpinner";
import { useHistory } from "@/hooks/useHistory";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Mood, Time, ContentType, SortOption } from "@/utils/recommend";
import { getAllGenres, searchMedia, getServerRecommendation } from "@/app/actions";

const savedContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const savedItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 }
  }
};

export default function MainClient({ mode }: { mode: "wizard" | "roulette" | "saved" }) {
  const { history, addToHistory } = useHistory();
  const { watchlist, toggleSave, isSaved } = useWatchlist();

  // Wizard State
  const [mood, setMood] = useState<Mood>("Bored");
  const [time, setTime] = useState<Time>("30-60 min");
  const [type, setType] = useState<ContentType>("any");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [genres, setGenres] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("all");
  const [recommendation, setRecommendation] = useState<MediaItem | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);

  const [allGenres, setAllGenres] = useState<string[]>([]);

  useEffect(() => {
    getAllGenres().then(setAllGenres).catch(console.error);
  }, []);

  // Roulette State
  const [rouletteOptions, setRouletteOptions] = useState<MediaItem[] | null>(null);
  const [rouletteWinner, setRouletteWinner] = useState<MediaItem | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [slots, setSlots] = useState<(MediaItem | null)[]>(Array(6).fill(null));

  // Global keypress listener for search overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (globalSearchOpen) return;
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setGlobalSearchQuery(e.key);
        setGlobalSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [globalSearchOpen]);

  const [globalSearchResults, setGlobalSearchResults] = useState<MediaItem[]>([]);
  const [isGlobalSearching, setIsGlobalSearching] = useState(false);

  useEffect(() => {
    if (!globalSearchQuery.trim()) {
      setGlobalSearchResults([]);
      setIsGlobalSearching(false);
      return;
    }
    setIsGlobalSearching(true);
    const delayDebounceFn = setTimeout(() => {
      searchMedia(globalSearchQuery)
        .then(setGlobalSearchResults)
        .catch(console.error)
        .finally(() => setIsGlobalSearching(false));
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [globalSearchQuery]);

  const validSlots = slots.filter((val) => val !== null) as MediaItem[];
  const canSpin = validSlots.length >= 2;

  // Trigger recommendation whenever wizard filters change
  useEffect(() => {
    if (mode === "wizard") {
      setIsRecommending(true);
      getServerRecommendation(mood, time, type, history, sort, genres, language).then(result => {
        if (result) {
          setRecommendation(result);
          addToHistory(result.id);
        } else {
          setRecommendation(null);
        }
      }).catch(console.error).finally(() => setIsRecommending(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, time, type, sort, genres, language, mode]);

  const handleReroll = () => {
    setIsRecommending(true);
    getServerRecommendation(mood, time, type, history, sort, genres, language).then(result => {
      if (result) {
        setRecommendation(result);
        addToHistory(result.id);
      }
    }).catch(console.error).finally(() => setIsRecommending(false));
  };

  return (
    <>
      {/* Dynamic Ambient Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
        <AnimatePresence mode="wait">
          {mode === "wizard" && recommendation && (
            <motion.div
              key={`wizard-${recommendation.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "linear" }}
              className="absolute inset-[-20%] w-[140%] h-[140%] bg-cover bg-center blur-[80px] saturate-150 transform-gpu will-change-[opacity]"
              style={{ backgroundImage: `url(${recommendation.thumbnail})` }}
            />
          )}
          {mode === "roulette" && rouletteWinner && (
            <motion.div
              key={`roulette-${rouletteWinner.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "linear" }}
              className="absolute inset-[-20%] w-[140%] h-[140%] bg-cover bg-center blur-[80px] saturate-150 transform-gpu will-change-[opacity]"
              style={{ backgroundImage: `url(${rouletteWinner.thumbnail})` }}
            />
          )}
          {mode === "saved" && watchlist.length > 0 && (
            <motion.div
              key={`saved-${watchlist[0].id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "linear" }}
              className="absolute inset-[-20%] w-[140%] h-[140%] bg-cover bg-center blur-[80px] saturate-150 transform-gpu will-change-[opacity]"
              style={{ backgroundImage: `url(${watchlist[0].thumbnail})` }}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
      </div>

      {/* Left Center Mode Toggle */}
      <div className="absolute top-1/2 right-4 md:right-auto md:left-6 -translate-y-1/2 z-[100]">
        <div className="flex flex-col bg-[#111]/80 backdrop-blur-md p-[6px] rounded-full border border-white/10 shadow-2xl gap-2">
          <Link
            href="/"
            className={`p-3 md:p-4 rounded-full transition-all duration-300 flex items-center justify-center ${mode === "wizard"
              ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-100"
              : "text-white/40 hover:text-white hover:bg-white/10 scale-95"
              }`}
            title="Smart Recommender"
          >
            <Wand2 size={22} />
          </Link>
          <Link
            href="/gamble"
            className={`p-3 md:p-4 rounded-full transition-all duration-300 flex items-center justify-center ${mode === "roulette"
              ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-100"
              : "text-white/40 hover:text-white hover:bg-white/10 scale-95"
              }`}
            title="Roulette Gamble"
          >
            <Dices size={22} />
          </Link>
          <Link
            href="/saved"
            className={`relative p-3 md:p-4 rounded-full transition-all duration-300 flex items-center justify-center ${mode === "saved"
              ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-100"
              : "text-white/40 hover:text-white hover:bg-white/10 scale-95"
              }`}
            title="Saved Recommendations"
          >
            <Bookmark size={22} className={watchlist.length > 0 && mode !== "saved" ? "text-yellow-400 fill-yellow-400" : ""} />
            {watchlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-[#0a0a0a]">
                {watchlist.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="relative w-full h-full overflow-y-auto scrollbar-none">
        {mode === "saved" ? (
          <motion.div
            className="max-w-[1200px] w-full h-full mx-auto px-6 pt-8 pb-12 flex flex-col justify-start overflow-hidden z-10 relative"
            variants={savedContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div className="flex items-center justify-between mb-8 flex-shrink-0 mt-2" variants={savedItemVariants}>
              <h1 className="text-[24px] md:text-[32px] font-black uppercase tracking-tighter text-white"
                style={{ textShadow: "0 0 10px rgba(255,255,255,0.2)" }}>
                Saved Recommendations
              </h1>
              <span className="bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-white/80">
                {watchlist.length} <span className="hidden sm:inline">{watchlist.length === 1 ? "Item" : "Items"}</span>
              </span>
            </motion.div>

            {/* Grid Container */}
            <div className="flex-grow overflow-y-auto pb-24 pr-2 scrollbar-none">
              {watchlist.length === 0 ? (
                <motion.div className="h-full flex flex-col items-center justify-center text-center text-white/40 gap-4 max-w-[480px] mx-auto py-12" variants={savedItemVariants}>
                  <Bookmark size={48} className="stroke-1 text-white/20" />
                  <h2 className="text-[20px] font-semibold text-white">Your list is empty</h2>
                  <p className="text-[14px] leading-relaxed text-white/50">
                    Save movies using the bookmark button on cards or after roulette spins. They will appear here for you to watch later.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  <AnimatePresence mode="popLayout">
                    {watchlist.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        variants={savedItemVariants}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        className="group flex flex-col"
                      >
                        {/* Poster container */}
                        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-lg group-hover:border-white/20 transition-all duration-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
                            <div className="flex justify-end">
                              <button
                                onClick={() => toggleSave(item)}
                                className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full transition-all border border-red-500/30 hover:scale-105 active:scale-95 cursor-pointer"
                                title="Remove from watchlist"
                              >
                                <X size={14} />
                              </button>
                            </div>

                            <div className="flex flex-col gap-2">
                              <p className="text-[12px] text-white/80 line-clamp-3 leading-relaxed font-light mb-1">
                                {item.description || "No description available."}
                              </p>
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-1.5 bg-white text-black py-2 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors text-center animate-fade-in"
                              >
                                Watch Now <ExternalLink size={10} />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Metadata below poster */}
                        <div className="mt-3">
                          <h3 className="font-bold text-white text-[14px] truncate leading-snug group-hover:text-yellow-400 transition-colors" title={item.title}>
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-white/40 uppercase tracking-wider">
                            <span>{item.runtime} min</span>
                            <span>•</span>
                            <span>⭐ {item.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className={`max-w-[1200px] w-full min-h-[80dvh] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 ${mode === "roulette"
            ? "gap-6 lg:gap-16 items-stretch pt-[6vh] lg:pt-0"
            : "gap-16 lg:gap-16 items-start lg:items-center pt-[6vh] lg:pt-[12vh] pb-[12vh]"
            }`}>

            {/* Left Side: The Configurator */}
            <div className={`lg:col-span-7 w-full flex flex-col items-center z-50 relative ${mode === "roulette" ? "lg:items-center lg:justify-center lg:h-full lg:pr-0" : "lg:items-end lg:pr-8"
              }`}>

              <AnimatePresence mode="wait">
                {mode === "wizard" ? (
                  <div key="wizard-container" className="w-full flex justify-center lg:justify-end lg:min-h-[650px] lg:pt-[100px]">
                    <WizardForm
                      key="wizard"
                      mood={mood}
                      time={time}
                      type={type}
                      sort={sort}
                      genres={genres}
                      language={language}
                      availableGenres={allGenres}
                      onChangeMood={setMood}
                      onChangeTime={setTime}
                      onChangeType={setType}
                      onChangeSort={setSort}
                      onChangeGenres={setGenres}
                      onChangeLanguage={setLanguage}
                    />
                  </div>
                ) : (
                  <RouletteForm
                    key="roulette"
                    slots={slots}
                    setSlots={setSlots}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Right Side: Results or Spinner */}
            <div className={`lg:col-span-5 w-full flex z-10 relative lg:pl-8 ${mode === "roulette"
              ? "lg:h-full flex-col justify-start lg:justify-between mt-2 lg:mt-0"
              : "justify-center lg:justify-start items-center"
              }`}>
              {mode === "roulette" && (
                <div className="hidden lg:block h-[165px] flex-shrink-0" />
              )}

              <div className={mode === "roulette" ? "flex-grow flex items-center justify-center w-full" : "w-full flex justify-center"}>
                <AnimatePresence mode="wait">
                  {mode === "roulette" ? (
                    rouletteOptions ? (
                      <RouletteSpinner
                        key="spinner"
                        options={rouletteOptions}
                        onReset={() => {
                          setRouletteOptions(null);
                          setRouletteWinner(null);
                          setSelectedMovie(null);
                        }}
                        onFinished={(winner) => {
                          setRouletteWinner(winner);
                          setSelectedMovie(winner);
                        }}
                      />
                    ) : (
                      <motion.div
                        key="spin-trigger-container"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex items-center justify-center"
                      >
                        <motion.button
                          onClick={() => { if (canSpin) setRouletteOptions(validSlots); }}
                          disabled={!canSpin}
                          whileHover={canSpin ? { scale: 1.05 } : {}}
                          whileTap={canSpin ? { scale: 0.95 } : {}}
                          className={`flex items-center justify-center gap-2 px-12 py-4 rounded-full text-[15px] font-bold tracking-widest uppercase transition-all duration-300 shadow-2xl ${canSpin
                            ? "bg-white text-black hover:bg-gray-200 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                            : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                            }`}
                        >
                          <Dices size={18} />
                          {canSpin ? "SPIN" : "SELECT 2+"}
                        </motion.button>
                      </motion.div>
                    )
                  ) : isRecommending ? (
                    <motion.div
                      key="loading-wizard"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-start pt-12 w-full h-[400px]"
                    >
                      <div
                        className="w-full pb-8 flex justify-center items-center text-white text-[16px] md:text-[20px] font-black uppercase font-sans leading-none"
                        style={{
                          textShadow: "0 0 4px #fff, 0 0 10px #fff, 0 0 20px #0ff, 0 0 40px #0ff, 0 0 80px #0ff"
                        }}
                      >
                        {"COMING SOON".split("").map((char, index) => (
                          <span key={index} className="mx-[1px]">{char === " " ? "\u00A0\u00A0" : char}</span>
                        ))}
                      </div>
                      <div className="w-10 h-10 border-4 border-white/20 border-t-[#0ff] rounded-full animate-spin mt-16 shadow-[0_0_20px_#0ff]" />
                    </motion.div>
                  ) : recommendation ? (
                    <RecommendationCard
                      key={recommendation.id}
                      item={recommendation}
                      onReroll={handleReroll}
                      isSaved={isSaved(recommendation.id)}
                      onToggleSave={() => toggleSave(recommendation)}
                    />
                  ) : (
                    <motion.div
                      key="empty-wizard"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="text-center p-12 bg-white/5 rounded-[24px] backdrop-blur-xl border border-white/10 shadow-2xl w-full"
                    >
                      <h2 className="text-[28px] font-semibold tracking-tighter leading-[1.1] mb-2 text-white">
                        No matches found
                      </h2>
                      <p className="text-[17px] text-white/50">
                        Try relaxing your constraints.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {mode === "roulette" && (
                <div className="hidden lg:block h-[80px] flex-shrink-0" />
              )}
            </div>

          </div>
        )}

        {/* SEO Section (Below the fold) */}
        {mode === "wizard" && (
          <section className="w-full max-w-[800px] mx-auto md:py-12 px-6 md:px-12 text-white/70 font-sans">
            <header className="mb-12 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">Your Ultimate Guide for Entertainment</h2>
              <p className="text-lg leading-relaxed text-white/60">
                Never waste another evening scrolling aimlessly. Watch That Next is your definitive companion for deciding exactly what to watch.
              </p>
            </header>

            <div className="space-y-12 text-[15px] md:text-[16px] leading-relaxed">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Deciding What to Watch Just Got Easier</h3>
                <p className="mb-4">
                  Finding the perfect entertainment can often feel like searching for a needle in a haystack—an impossible task without the right tools. Whether you are looking for new movies to watch or trying to figure out where to watch the latest trending tv shows, the paradox of choice can be paralyzing. Our smart movie recommendation engine cuts through the noise, matching your exact mood, available time, and genre preferences to deliver guaranteed hits.
                </p>
                <p>
                  Gone are the days of endlessly flipping through media libraries. We act as your precision metric, your personal guide, ensuring that every minute you spend in front of the screen is time well spent. From thrilling blockbusters to indie gems, we categorize every movie so you don't have to.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Good Movies to Watch for Every Mood</h3>
                <p className="mb-4">
                  When you search for good movies to watch, you want results that resonate with how you feel right now. Need something to lift your spirits after a long day? Our curated selection of feel good movies will provide the exact comfort you need. Perhaps you are craving high-octane action, a mind-bending thriller, or a classic romance.
                </p>
                <p>
                  By leveraging our intuitive wizard, you bypass the overwhelming catalogs of major streaming services. We analyze the runtime, the critical reception, and the emotional impact of every film. This means when you ask us for a movie recommendation, we deliver a title that perfectly aligns with your current state of mind.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">The Best TV Shows and Webseries</h3>
                <p className="mb-4">
                  The golden age of television means there is an abundance of tv-shows and webseries competing for your attention. Finding good tv shows to watch requires sifting through hundreds of options across dozens of platforms. If you need a reliable tv show recommendation, Watch That Next acts as your ultimate guide.
                </p>
                <p>
                  Are you caught up in the reality TV craze and frantically searching where to watch love island? Or perhaps you want to dive deep into a complex, multi-season drama? We track the pulse of global entertainment, ensuring that whether you want a quick 20-minute sitcom bite or a marathon-worthy epic, your next binge is just one click away. We measure the hype, the quality, and the accessibility so you can sit back and press play.
                </p>
              </div>

              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mt-16">
                <h4 className="text-lg font-bold text-white mb-3">Why Trust Our Recommendations?</h4>
                <p className="text-sm md:text-base text-white/60">
                  Our algorithms are designed to respect your time. We know that picking what to watch is often harder than actually watching it. By blending precise filtering with a beautiful, distraction-free interface, we help you discover movies to watch and tv shows to watch faster than ever before. Stop scrolling, start watching.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Movie Details Modal */}
        <AnimatePresence>
          {selectedMovie && (
            <motion.div
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="flex flex-col md:flex-row items-center md:items-stretch gap-8 bg-[#0d0d0d] border border-white/10 p-8 md:p-10 rounded-[32px] shadow-2xl max-w-[720px] w-full relative"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setSelectedMovie(null);
                    if (mode === "roulette") {
                      setRouletteWinner(null);
                      setRouletteOptions(null);
                    }
                  }}
                  className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors z-10 cursor-pointer"
                >
                  <X size={24} />
                </button>

                {/* Left Column: Movie Poster */}
                <div className="w-[180px] sm:w-[220px] aspect-[2/3] relative flex-shrink-0 rounded-[16px] overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedMovie.thumbnail}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleSave(selectedMovie)}
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white backdrop-blur-md transition-all z-10 border border-white/10 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    title={isSaved(selectedMovie.id) ? "Remove from Watchlist" : "Save to Watchlist"}
                  >
                    <Bookmark className={isSaved(selectedMovie.id) ? "fill-yellow-400 text-yellow-400" : "text-white"} size={16} />
                  </button>
                </div>

                {/* Right Column: Detailed Info Stack */}
                <div className="flex flex-col justify-between flex-1 text-center md:text-left pt-2">
                  <div>
                    <span className="text-[11px] tracking-[0.2em] font-black text-yellow-400 uppercase mb-2 block">
                      {mode === "roulette" && rouletteWinner && selectedMovie.id === rouletteWinner.id
                        ? "Fate has decided"
                        : selectedMovie.type === "show"
                          ? "TV Show Details"
                          : "Movie Details"}
                    </span>

                    <h3 className="text-[24px] sm:text-[30px] font-bold tracking-tighter leading-tight text-white mb-2">
                      {selectedMovie.title}
                    </h3>

                    <p className="text-white/50 text-[12px] sm:text-[13px] uppercase mb-4 tracking-widest font-semibold">
                      {selectedMovie.runtime} min • ⭐ {selectedMovie.rating.toFixed(1)}
                    </p>

                    <p className="text-white/60 text-[13px] sm:text-[14px] leading-relaxed mb-6 font-light line-clamp-4 md:line-clamp-5">
                      {selectedMovie.description || "No description available for this recommendation."}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
                    <motion.a
                      href={selectedMovie.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-full text-[13px] font-bold tracking-widest uppercase transition-colors hover:bg-gray-200"
                    >
                      <ExternalLink size={16} /> Watch Now
                    </motion.a>
                    {mode === "roulette" && rouletteWinner && selectedMovie.id === rouletteWinner.id && (
                      <motion.button
                        onClick={() => {
                          setSelectedMovie(null);
                          setRouletteWinner(null);
                          setRouletteOptions(null);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-3 rounded-full text-[13px] font-bold tracking-widest uppercase transition-colors hover:bg-white/10 hover:border-white/20"
                      >
                        <RotateCw size={16} /> Spin Again
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Search Modal Overlay */}
        <AnimatePresence>
          {globalSearchOpen && (
            <motion.div
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setGlobalSearchOpen(false); setGlobalSearchQuery(""); }}
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
                    placeholder="Search movies & shows..."
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30 text-[16px]"
                  />
                  <button onClick={() => { setGlobalSearchOpen(false); setGlobalSearchQuery(""); }} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                    <X size={20} />
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto scrollbar-none">
                  {globalSearchResults.map((item, index) => (
                    <button
                      key={`${item.id}-${index}`}
                      onClick={() => {
                        setSelectedMovie(item);
                        setGlobalSearchOpen(false);
                        setGlobalSearchQuery("");
                      }}
                      className="w-full text-left p-4 hover:bg-white/5 flex gap-4 items-center transition-colors border-b border-[#222] last:border-none cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.thumbnail} alt={item.title} className="w-12 h-16 object-cover rounded shadow-md border border-white/10" />
                      <div>
                        <div className="font-bold text-white mb-1">{item.title}</div>
                        <div className="text-[12px] text-white/50">{item.runtime} min • ⭐ {item.rating.toFixed(1)}</div>
                      </div>
                    </button>
                  ))}
                  {isGlobalSearching ? (
                    <div className="p-8 text-center text-white/40 flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <>
                      {globalSearchQuery.length >= 2 && globalSearchResults.length === 0 && (
                        <div className="p-8 text-center text-white/40">No results found for &quot;{globalSearchQuery}&quot;</div>
                      )}
                      {globalSearchQuery.length < 2 && (
                        <div className="p-8 text-center text-white/40">Type to search...</div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="w-full max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 py-8 px-6 text-[12px] font-medium text-white/40 uppercase tracking-widest border-t border-white/5 mt-12 md:mt-24">
          <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
        </footer>
      </div>
    </>
  );
}
