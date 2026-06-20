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
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  views: { type: Number, default: 0 },
  image: { type: String, required: true },
  date: { type: String, required: true }
}, { collection: 'blogs' });

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

const BLOGS = [
  {
    id: "how-we-curated-top-500-movies",
    title: "How We Curated the Top 500 Movies List",
    summary: "An inside look at our curation criteria, from normalizing IMDb and Rotten Tomatoes ratings to weighting votes and filtering out noise.",
    content: "Our movie database curation process is designed to select only the highest-quality, critically acclaimed, and culturally significant movies. To do this, we collect rating data across major websites, balance popularity and rating weighting, and apply strict genre mapping so that your recommendations align perfectly with your mood. This detailed filtering separates cinematic masterworks from forgettable sequels, ensuring every recommendation feels fresh and worth your time.",
    category: "Curation & Data",
    views: 1245,
    image: "/blogs/curation.png",
    date: "June 19, 2026"
  },
  {
    id: "5-mind-bending-thrillers-hyped-mood",
    title: "5 Mind-Bending Thrillers for a Hyped Mood",
    summary: "Feeling hyped? Skip the search and dive straight into these top-rated psychological thrillers that will keep you on the edge of your seat.",
    content: "When you are hyped and seeking intensity, generic blockbusters won't cut it. You need movies that challenge your mind and present unexpected twists. Here are five mind-bending psychological thrillers in our database that are guaranteed hits. From dark detective stories to high-concept reality-shifting narratives, these films offer the ultimate high-adrenaline cinematic experience.",
    category: "Binge Guides",
    views: 980,
    image: "/blogs/thrillers.png",
    date: "June 18, 2026"
  },
  {
    id: "evolution-of-comfort-tv-sitcoms",
    title: "The Evolution of 'Comfort TV' and Sitcoms",
    summary: "Why do we keep rewatching the same sitcoms while eating? We dive into the science of nostalgic viewing and comfortable pacing.",
    content: "Sitcoms are the ultimate comfort food for your brain. Studies show that rewatching familiar television shows lowers stress, reduces decision fatigue, and provides a sense of comfort because we already know what happens next. Here's a look at how pacing makes sitcoms perfect for a quick snack or a dinner-time view, explaining why shows like Friends and The Office continue to dominate streaming charts years after their finales.",
    category: "Cinema History",
    views: 742,
    image: "/blogs/sitcoms.png",
    date: "June 15, 2026"
  },
  {
    id: "introducing-regional-streaming-providers",
    title: "Introducing Regional Streaming Providers",
    summary: "You can now choose your platform directly from our recommendations page. Learn about our integration with TMDb Watch Providers.",
    content: "We are thrilled to announce a major upgrade to Watch That Next! We have integrated with the TMDb Watch Providers API to fetch regional streaming availability dynamically. You can now view if a movie is on Netflix, Prime Video, or Disney+ directly on your recommendation card, select your favorite service, and jump straight to the platform. This completely solves the problem of finding a movie only to realize it isn't streaming on the subscriptions you own.",
    category: "Product Updates",
    views: 1420,
    image: "/blog_hero.png",
    date: "June 20, 2026"
  }
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  console.log('Clearing existing blog posts...');
  await BlogPost.deleteMany({});

  console.log('Inserting blog posts...');
  await BlogPost.insertMany(BLOGS);

  console.log('Seeding blogs completed successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
