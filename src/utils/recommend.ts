import { MediaItem } from "@/types";

export type Mood = "Bored" | "Eating" | "Relaxing" | "Hyped";
export type Time = "<10 min" | "10-30 min" | "30-60 min" | "60+ min";
export type ContentType = "movie" | "show" | "any";
export type SortOption = "recommended" | "rating" | "most watched" | "most viewed" | "newest";

// Rough mapping from user Mood to standard Genres
const MOOD_MAP: Record<Mood, string[]> = {
  Bored: ["Comedy", "Animation", "Family", "Adventure", "Fantasy"],
  Eating: ["Comedy", "Documentary", "Animation", "Sitcom", "Reality", "Talk"],
  Relaxing: ["Drama", "Romance", "Documentary", "History", "Family"],
  Hyped: ["Action", "Sci-Fi", "Thriller", "Horror", "Crime", "Mystery"]
};

export function getRecommendation(
  data: MediaItem[],
  mood: Mood,
  time: Time,
  type: ContentType,
  history: string[],
  sort: SortOption = "recommended",
  genre: string | null = null
): MediaItem | null {
  // 1. Filter by type
  let pool = data.filter((item) => {
    if (type === "any") return true;
    return item.type === type;
  });

  // 2. Filter by time
  pool = pool.filter((item) => {
    // For tv shows, 'runtime' is usually episode runtime.
    if (time === "<10 min") return item.runtime <= 10;
    if (time === "10-30 min") return item.runtime > 10 && item.runtime <= 30;
    if (time === "30-60 min") return item.runtime > 30 && item.runtime <= 60;
    if (time === "60+ min") return item.runtime > 60;
    return true;
  });

  // 3. Exclude history
  let unshownPool = pool.filter((item) => !history.includes(item.id));

  // If we ran out of unshown items, relax the history constraint
  if (unshownPool.length === 0) {
    unshownPool = pool;
  }

  if (unshownPool.length === 0) return null;

  // 4. Filter by genre OR mood
  let filteredPool = unshownPool;
  
  if (genre && genre !== "All") {
    filteredPool = unshownPool.filter((item) =>
      item.genres && item.genres.includes(genre)
    );
    // If no exact genre match, fallback to unshown
    if (filteredPool.length === 0) {
      filteredPool = unshownPool;
    }
  } else {
    // progressive relaxation for mood
    const targetGenres = MOOD_MAP[mood] || [];
    let moodPool = unshownPool.filter((item) =>
      item.mood_tags.some((tag) => targetGenres.includes(tag))
    );
    if (moodPool.length === 0) {
      moodPool = unshownPool;
    }
    filteredPool = moodPool;
  }

  // 5. Apply sorting or random selection
  if (sort === "recommended") {
    // Weighted random selection (favor high ratings)
    const weightedPool: MediaItem[] = [];
    filteredPool.forEach((item) => {
      weightedPool.push(item);
      if (item.rating >= 7.0) weightedPool.push(item);
      if (item.rating >= 8.0) weightedPool.push(item);
    });

    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    return weightedPool[randomIndex] || null;
  } else {
    // Deterministic sorting
    const sortedPool = [...filteredPool].sort((a, b) => {
      if (sort === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sort === "most watched") {
        return (b.vote_count || 0) - (a.vote_count || 0);
      } else if (sort === "most viewed") {
        return (b.popularity || 0) - (a.popularity || 0);
      } else if (sort === "newest") {
        const dateA = new Date(a.release_date || 0).getTime();
        const dateB = new Date(b.release_date || 0).getTime();
        return dateB - dateA;
      }
      return 0;
    });

    return sortedPool[0] || null;
  }
}
