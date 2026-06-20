"use client";

import { useState, useEffect } from "react";
import StaticPageLayout from "@/components/StaticPageLayout";
import Link from "next/link";
import { ArrowLeft, Search, X } from "lucide-react";
import { getBlogs, getPopularBlogs } from "@/app/actions";
import { BlogPostItem } from "@/types";

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [popularBlogs, setPopularBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of popular blogs
    getPopularBlogs()
      .then(setPopularBlogs)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      getBlogs(searchQuery)
        .then(setBlogs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 200); // 200ms debounce
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <StaticPageLayout title="Blogs" subtitle="Cinematic insights, curation stories, and lists.">
      {/* Search Bar Component */}
      <div className="relative w-full mb-12">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-white/40" />
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-full py-3 pl-12 pr-12 text-[14px] text-white placeholder:text-white/30 outline-none transition-all"
        />
        {searchQuery.length > 0 && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Popular Blogs Section (only show when not searching) */}
      {searchQuery.trim().length === 0 && popularBlogs.length > 0 && (
        <div className="mb-16">
          <h2 className="text-xl font-bold tracking-tight text-white mb-6 uppercase tracking-widest text-[11px] text-white/50">
            Popular Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularBlogs.map((post) => (
              <Link
                key={post.id}
                href={`/blogs/${post.id}`}
                className="group p-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] uppercase tracking-wider text-yellow-400 font-bold">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-white/30 font-semibold">{post.date}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-white mt-2 mb-3 leading-snug group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[12px] text-white/50 line-clamp-3">
                    {post.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] uppercase tracking-wider text-white group-hover:underline font-bold">
                    Read Article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Articles List Section */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white mb-6 uppercase tracking-widest text-[11px] text-white/50">
          {searchQuery.trim().length > 0 ? "Search Results" : "All Articles"}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-32 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
            <div className="h-32 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((post) => (
              <Link
                key={post.id}
                href={`/blogs/${post.id}`}
                className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] uppercase tracking-wider text-yellow-400 font-bold">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-white/30 font-semibold">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2 mb-3 leading-snug group-hover:text-yellow-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-white/60 mb-4 line-clamp-2">
                    {post.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white group-hover:underline">
                    Read Article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 text-white/40">
            No articles found matching
          </div>
        )}
      </div>

      {/* Small back button at bottom left */}
      <div className="mt-16 flex justify-start">
        <Link
          href="/"
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white px-5 py-2.5 rounded-full text-[13px] font-bold tracking-wider transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft size={14} /> back
        </Link>
      </div>
    </StaticPageLayout>
  );
}
