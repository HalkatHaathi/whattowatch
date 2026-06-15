import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const MediaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  runtime: { type: Number, index: true },
  mood_tags: { type: [String], index: true },
  genres: { type: [String], index: true },
  rating: { type: Number, index: true },
  popularity: { type: Number, index: true },
  vote_count: { type: Number, index: true },
  release_date: { type: String },
  thumbnail: { type: String, required: true },
  link: { type: String, required: true }
}, { collection: 'media' });

MediaSchema.index({ title: 'text' });

const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema);

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  console.log('Reading data.json...');
  const dataPath = path.join(__dirname, '../public/data.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);
  
  console.log(`Parsed ${data.length} records. Clearing existing data...`);
  await Media.deleteMany({});
  
  console.log('Inserting data in batches...');
  const BATCH_SIZE = 5000;
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    await Media.insertMany(batch);
    console.log(`Inserted ${Math.min(i + BATCH_SIZE, data.length)} / ${data.length}`);
  }

  console.log('Seeding completed successfully!');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});
