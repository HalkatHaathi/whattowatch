export interface MediaItem {
  id: string;
  type: 'movie' | 'show';
  title: string;
  description: string;
  runtime: number;
  mood_tags: string[];
  genres?: string[];
  rating: number;
  popularity?: number;
  vote_count?: number;
  release_date?: string;
  thumbnail: string;
  link: string;
}
