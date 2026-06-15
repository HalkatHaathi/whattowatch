"use server";

import dbConnect from "@/lib/mongodb";
import Media from "@/models/Media";
import { Mood, Time, ContentType, SortOption } from "@/utils/recommend";
import { MediaItem } from "@/types";

const MOOD_MAP: Record<Mood, string[]> = {
  Bored: ["Comedy", "Animation", "Family", "Adventure", "Fantasy"],
  Eating: ["Comedy", "Documentary", "Animation", "Sitcom", "Reality", "Talk"],
  Relaxing: ["Drama", "Romance", "Documentary", "History", "Family"],
  Hyped: ["Action", "Sci-Fi", "Thriller", "Horror", "Crime", "Mystery"]
};

// Ensures MediaItem is plain object (removes mongoose specific properties)
function toPlainObject(doc: any): MediaItem {
  return {
    id: doc.id,
    type: doc.type,
    title: doc.title,
    description: doc.description,
    runtime: doc.runtime,
    mood_tags: doc.mood_tags,
    genres: doc.genres,
    rating: doc.rating,
    popularity: doc.popularity,
    vote_count: doc.vote_count,
    release_date: doc.release_date,
    thumbnail: doc.thumbnail,
    link: doc.link,
  };
}

export async function getAllGenres(): Promise<string[]> {
  await dbConnect();
  const genres = await Media.distinct("genres");
  return genres.sort();
}

export async function searchMedia(query: string): Promise<MediaItem[]> {
  if (!query || query.trim().length < 2) return [];
  await dbConnect();
  
  // Basic regex search
  const results = await Media.find({ title: { $regex: query, $options: "i" } })
    .limit(8)
    .lean();
    
  return results.map(toPlainObject);
}

export async function getServerRecommendation(
  mood: Mood,
  time: Time,
  type: ContentType,
  history: string[],
  sort: SortOption = "recommended",
  genre: string | null = null
): Promise<MediaItem | null> {
  await dbConnect();

  let baseQuery: any = {};

  if (type !== "any") {
    baseQuery.type = type;
  }

  if (time === "<10 min") baseQuery.runtime = { $lte: 10 };
  else if (time === "10-30 min") baseQuery.runtime = { $gt: 10, $lte: 30 };
  else if (time === "30-60 min") baseQuery.runtime = { $gt: 30, $lte: 60 };
  else if (time === "60+ min") baseQuery.runtime = { $gt: 60 };

  // Try applying history constraint
  let queryWithHistory = { ...baseQuery, id: { $nin: history } };
  let count = await Media.countDocuments(queryWithHistory);
  
  // Relax history constraint if no matches
  let activeQuery = count > 0 ? queryWithHistory : baseQuery;

  // Try applying genre or mood
  let queryWithGenreOrMood = { ...activeQuery };
  if (genre && genre !== "All") {
    queryWithGenreOrMood.genres = genre;
  } else {
    const targetGenres = MOOD_MAP[mood] || [];
    queryWithGenreOrMood.mood_tags = { $in: targetGenres };
  }

  let finalQuery = queryWithGenreOrMood;
  let finalCount = await Media.countDocuments(finalQuery);
  
  if (finalCount === 0) {
    // Relax genre/mood constraint
    finalQuery = activeQuery;
  }

  // Fetch final list to apply random/sorting
  // (We fetch up to 100 to do local weighting/sorting efficiently)
  let candidates = await Media.find(finalQuery).limit(100).lean();

  if (candidates.length === 0) return null;

  if (sort === "recommended") {
    const weightedPool: any[] = [];
    candidates.forEach((item: any) => {
      weightedPool.push(item);
      if (item.rating >= 7.0) weightedPool.push(item);
      if (item.rating >= 8.0) weightedPool.push(item);
    });

    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    return toPlainObject(weightedPool[randomIndex]);
  } else {
    // Deterministic sort in DB would be better, but doing it on 100 candidates is fine
    candidates.sort((a: any, b: any) => {
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sort === "most watched") return (b.vote_count || 0) - (a.vote_count || 0);
      if (sort === "most viewed") return (b.popularity || 0) - (a.popularity || 0);
      if (sort === "newest") {
        const dateA = new Date(a.release_date || 0).getTime();
        const dateB = new Date(b.release_date || 0).getTime();
        return dateB - dateA;
      }
      return 0;
    });

    return toPlainObject(candidates[0]);
  }
}
