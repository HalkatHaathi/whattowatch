import fs from 'fs';
import path from 'path';
import readline from 'readline';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

const MediaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  lang: { type: String }
}, { strict: false, collection: 'media' });

const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema);

async function migrateFile(filename, type) {
  if (!fs.existsSync(filename)) {
    console.log(`File not found: ${filename}`);
    return;
  }
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let count = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const item = JSON.parse(line);
      const id = `${type}_${item.id}`;
      const language = item.original_language || 'en';
      
      const result = await Media.updateOne({ id }, { $set: { lang: language }, $unset: { language: "" } });
      if (result.modifiedCount > 0 || result.matchedCount > 0) {
        count++;
      }
    } catch (e) {
      console.error(`Error processing line: ${e.message}`);
    }
  }
  console.log(`Migrated ${count} ${type} items from ${filename}`);
}

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  console.log("Migrating movies...");
  const movieFile = fs.existsSync('movies_data.jsonl') ? 'movies_data.jsonl' : 'top_500_movie_data.jsonl';
  await migrateFile(movieFile, 'movie');

  console.log("Migrating TV shows...");
  const tvFile = fs.existsSync('tv_data.jsonl') ? 'tv_data.jsonl' : 'top_500_tv_data.jsonl';
  await migrateFile(tvFile, 'show');

  console.log("Migration completed!");
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
