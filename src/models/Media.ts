import mongoose from 'mongoose';
import { MediaItem } from '@/types';

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
  link: { type: String, required: true },
  lang: { type: String, index: true }
}, { 
  collection: 'media',
  timestamps: true
});

// Create text index on title for searching
MediaSchema.index({ title: 'text' });

export default mongoose.models.Media || mongoose.model<MediaItem & mongoose.Document>('Media', MediaSchema);
