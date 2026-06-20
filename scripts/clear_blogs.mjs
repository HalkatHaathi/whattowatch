import path from 'path';
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

const BlogPostSchema = new mongoose.Schema({
  id: { type: String, required: true }
}, { collection: 'blogs' });

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  console.log('Clearing all blogs...');
  const res = await BlogPost.deleteMany({});
  console.log(`Deleted ${res.deletedCount} blogs.`);
  
  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(console.error);
