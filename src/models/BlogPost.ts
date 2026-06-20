import mongoose from 'mongoose';
import { BlogPostItem } from '@/types';

const BlogPostSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true, index: true },
  views: { type: Number, default: 0, index: true },
  date: { type: String, required: true }
}, { 
  collection: 'blogs',
  timestamps: true
});

// Create text indexes to support full-text search
BlogPostSchema.index({ title: 'text', summary: 'text', content: 'text' });

if (mongoose.models.BlogPost) {
  delete (mongoose.models as any).BlogPost;
}

export default mongoose.model<BlogPostItem & mongoose.Document>('BlogPost', BlogPostSchema);
