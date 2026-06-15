import { useState, useEffect } from "react";

const HISTORY_KEY = "wtw_history";

export function useHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse history", e);
    }
  }, []);

  const addToHistory = (id: string) => {
    setHistory((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id].slice(-100); // keep last 100 to avoid infinite bloat
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { history, addToHistory };
}
