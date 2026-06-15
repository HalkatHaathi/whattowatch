import fs from 'node:fs';
import zlib from 'node:zlib';
import readline from 'node:readline';
import { Readable } from 'node:stream';

// --- CONFIGURATION ---
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'YOUR_API_KEY_HERE';
const TARGET_TYPE = process.env.TARGET_TYPE || 'tv'; // 'tv' or 'movie'

// Default to fetching all items
const DEFAULT_TARGET_COUNT = Infinity;
const TARGET_COUNT = process.env.TARGET_COUNT ? parseInt(process.env.TARGET_COUNT) : DEFAULT_TARGET_COUNT;

// Output to movies_data.jsonl for movies, or tv_data.jsonl for TV
const DEFAULT_OUTPUT_FILE = TARGET_TYPE === 'movie' ? 'movies_data.jsonl' : 'tv_data.jsonl';
const OUTPUT_FILE = process.env.OUTPUT_FILE || DEFAULT_OUTPUT_FILE;

const MAX_CONCURRENT_REQUESTS = 40; // TMDB limit is 50/s
const BATCH_DELAY_MS = 800;

// Default popularity filter. Set to 0.0 to fetch all records listed in the daily export.
const DEFAULT_MIN_POPULARITY = 0.0;
const MIN_POPULARITY = process.env.MIN_POPULARITY ? parseFloat(process.env.MIN_POPULARITY) : DEFAULT_MIN_POPULARITY;

console.log(`Starting extraction for ${TARGET_COUNT === Infinity ? 'ALL' : TARGET_COUNT} popular ${TARGET_TYPE} items...`);
if (TARGET_COUNT === Infinity && MIN_POPULARITY > 0) {
  console.log(`Filtering for ${TARGET_TYPE} items with popularity >= ${MIN_POPULARITY}...`);
}

// --- HELPER: Get date strings for exports ---
function getFormattedDates() {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    dates.push(`${month}_${day}_${year}`);
  }
  return dates;
}

// --- HELPER: Fetch TMDB Details ---
async function fetchDetails(id, retries = 3) {
  const url = `https://api.themoviedb.org/3/${TARGET_TYPE}/${id}?api_key=${TMDB_API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) return null; // Not found
      if (res.status === 429) {
        // Rate limited
        console.warn(`[Rate Limited] Waiting 5 seconds before retrying ID ${id}...`);
        await new Promise(r => setTimeout(r, 5000));
        return fetchDetails(id, retries);
      }
      if (res.status >= 500 && retries > 0) {
        console.warn(`[Server Error ${res.status}] Retrying ID ${id} (${retries} retries left)...`);
        await new Promise(r => setTimeout(r, 2000));
        return fetchDetails(id, retries - 1);
      }
      console.error(`Error fetching ID ${id}: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`[Network Error] Request failed for ID ${id}: ${error.message}. Retrying (${retries} retries left)...`);
      await new Promise(r => setTimeout(r, 2000));
      return fetchDetails(id, retries - 1);
    }
    console.error(`Request failed for ID ${id} after retries:`, error.message);
    return null;
  }
}

// --- MAIN FUNCTION ---
async function main() {
  if (TMDB_API_KEY === 'YOUR_API_KEY_HERE') {
    console.error("Please set your TMDB API Key in the script or run with TMDB_API_KEY=xxx node fetch_tmdb.mjs");
    process.exit(1);
  }

  const dates = getFormattedDates();
  const exportName = TARGET_TYPE === 'movie' ? 'movie_ids' : 'tv_series_ids';
  let responseBody = null;
  let successDate = '';

  for (const dateStr of dates) {
    const url = `http://files.tmdb.org/p/exports/${exportName}_${dateStr}.json.gz`;
    console.log(`Attempting to fetch daily export from: ${url}...`);
    try {
      const response = await fetch(url);
      if (response.ok) {
        responseBody = response.body;
        successDate = dateStr;
        break;
      }
      console.warn(`Export for date ${dateStr} returned HTTP ${response.status}. Trying previous date...`);
    } catch (err) {
      console.error(`Connection failed for date ${dateStr}: ${err.message}`);
    }
  }

  if (!responseBody) {
    throw new Error("Unable to download daily export files from TMDb exports site.");
  }

  console.log(`Connected successfully! Downloading and unzipping export from ${successDate}...`);
  const nodeStream = Readable.fromWeb(responseBody);
  const gunzip = zlib.createGunzip();
  const decompressedStream = nodeStream.pipe(gunzip);

  const rl = readline.createInterface({
    input: decompressedStream,
    crlfDelay: Infinity
  });

  const ids = [];
  console.log("Parsing JSON lines from daily ID export file...");
  let lineCount = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    lineCount++;
    try {
      const parsed = JSON.parse(line);
      if (parsed && parsed.id) {
        ids.push({
          id: parsed.id,
          popularity: parsed.popularity || 0
        });
      }
    } catch (err) {
      // Ignore parse errors on corrupted lines
    }
    if (lineCount % 100000 === 0) {
      console.log(`Read ${lineCount} lines...`);
    }
  }

  console.log(`Finished parsing. Found total ${ids.length} records.`);

  let filteredIds = ids;
  if (MIN_POPULARITY > 0) {
    filteredIds = ids.filter(x => x.popularity >= MIN_POPULARITY);
    console.log(`Filtered to ${filteredIds.length} ${TARGET_TYPE} items with popularity >= ${MIN_POPULARITY}.`);
  }

  console.log("Sorting records by popularity descending...");
  filteredIds.sort((a, b) => b.popularity - a.popularity);

  const idsToProcess = TARGET_COUNT === Infinity
    ? filteredIds.map(x => x.id)
    : filteredIds.slice(0, TARGET_COUNT).map(x => x.id);

  console.log(`Selected top ${idsToProcess.length} IDs. Fetching full details for each...`);

  // Process IDs in batches to get full details
  const outStream = fs.createWriteStream(OUTPUT_FILE);

  for (let i = 0; i < idsToProcess.length; i += MAX_CONCURRENT_REQUESTS) {
    const batch = idsToProcess.slice(i, i + MAX_CONCURRENT_REQUESTS);

    // Fetch batch concurrently
    const promises = batch.map(id => fetchDetails(id));
    const results = await Promise.all(promises);

    // Write successful results to JSONL file
    let savedCount = 0;
    for (const data of results) {
      if (data) {
        outStream.write(JSON.stringify(data) + '\n');
        savedCount++;
      }
    }

    console.log(`Processed ${i + batch.length}/${idsToProcess.length} | Saved: ${savedCount} in this batch`);

    // Wait before next batch to respect rate limits
    if (i + MAX_CONCURRENT_REQUESTS < idsToProcess.length) {
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  outStream.end();
  console.log(`\nFinished! All data saved to ${OUTPUT_FILE}`);
}

main().catch(console.error);
