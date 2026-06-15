import { useState, useEffect } from "react";
import { MediaItem } from "@/types";

const SAVED_KEY = "wtw_saved_recommendations";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_KEY);
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse watchlist", e);
    }
  }, []);

  const toggleSave = (item: MediaItem) => {
    setWatchlist((prev) => {
      let next: MediaItem[];
      if (prev.some((i) => i.id === item.id)) {
        next = prev.filter((i) => i.id !== item.id);
      } else {
        next = [item, ...prev];
      }
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (id: string) => {
    setWatchlist((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (id: string) => {
    return watchlist.some((i) => i.id === id);
  };

  return { watchlist, toggleSave, removeItem, isSaved };
}
