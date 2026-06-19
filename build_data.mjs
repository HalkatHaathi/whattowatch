import fs from 'fs';
import readline from 'readline';
import path from 'path';

const MOVIE_FILE = fs.existsSync('movies_data.jsonl') ? 'movies_data.jsonl' : 'top_500_movie_data.jsonl';
const TV_FILE = fs.existsSync('tv_data.jsonl') ? 'tv_data.jsonl' : 'top_500_tv_data.jsonl';
const OUTPUT_FILE = 'public/data.json';

const genreToMoodMap = {
  // Bored (Exciting/Fun)
  'Action': 'Bored',
  'Action & Adventure': 'Bored',
  'Adventure': 'Bored',
  'Comedy': 'Bored',
  'Science Fiction': 'Bored',
  'Sci-Fi & Fantasy': 'Bored',

  // Eating (Light/Easy to watch)
  // 'Comedy': 'Eating', (Handled in code, we will map multiple if needed)
  'Family': 'Eating',
  'Animation': 'Eating',
  'Reality': 'Eating',
  'Talk': 'Eating',
  'Kids': 'Eating',

  // Relaxing (Slow-paced, emotional, real)
  'Drama': 'Relaxing',
  'Romance': 'Relaxing',
  'Documentary': 'Relaxing',
  'Music': 'Relaxing',
  'History': 'Relaxing',

  // Hyped (Intense, thrilling, scary)
  'Thriller': 'Hyped',
  'Horror': 'Hyped',
  'Fantasy': 'Hyped',
  'Crime': 'Hyped',
  'Mystery': 'Hyped',
  'War': 'Hyped',
  'War & Politics': 'Hyped'
};

const mapGenresToMoods = (genres) => {
  const moods = new Set();
  
  if (!genres) return Array.from(moods);

  genres.forEach(g => {
    const name = g.name;
    if (genreToMoodMap[name]) {
      moods.add(genreToMoodMap[name]);
    }
    // Also explicitly add 'Eating' if it's Comedy
    if (name === 'Comedy') {
      moods.add('Eating');
    }
    // Action can be Hyped too
    if (name === 'Action' || name === 'Action & Adventure') {
      moods.add('Hyped');
    }
  });

  // If no mood found, add a fallback based on random or just 'Bored'
  if (moods.size === 0) {
    moods.add('Bored');
  }

  return Array.from(moods);
};

async function processJsonl(filename, type) {
  const results = [];
  
  if (!fs.existsSync(filename)) {
    console.log(`File not found: ${filename}`);
    return results;
  }

  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const item = JSON.parse(line);
      
      const id = `${type}_${item.id}`;
      const title = type === 'movie' ? item.title : item.name;
      
      let runtime = 0;
      if (type === 'movie') {
        runtime = item.runtime || 0;
      } else {
        runtime = (item.episode_run_time && item.episode_run_time.length > 0) ? item.episode_run_time[0] : 45; // default tv 45 mins
      }

      const mood_tags = mapGenresToMoods(item.genres);
      const genres = item.genres ? item.genres.map(g => g.name) : [];
      const rating = item.vote_average || 0;
      const popularity = item.popularity || 0;
      const vote_count = item.vote_count || 0;
      const release_date = item.release_date || item.first_air_date || "";
      const thumbnail = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '';
      const link = type === 'movie' ? `https://www.themoviedb.org/movie/${item.id}/watch` : `https://www.themoviedb.org/tv/${item.id}/watch`;

      // Only add items that have a poster and a rating
      if (thumbnail && rating > 0 && title) {
        results.push({
          id,
          type,
          title,
          description: item.overview || "",
          runtime,
          mood_tags,
          genres,
          rating,
          popularity,
          vote_count,
          release_date,
          thumbnail,
          link
        });
      }
    } catch (e) {
      console.error('Error parsing line:', e.message);
    }
  }
  return results;
}

async function main() {
  console.log('Processing movies...');
  const movies = await processJsonl(MOVIE_FILE, 'movie');
  
  console.log('Processing TV shows...');
  const tvShows = await processJsonl(TV_FILE, 'show');

  const combined = [...movies, ...tvShows];
  
  // Ensure public directory exists
  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(combined, null, 2));
  console.log(`Successfully generated ${OUTPUT_FILE} with ${combined.length} items.`);
}

main();
