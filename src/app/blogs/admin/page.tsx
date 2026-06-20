"use client";

import { useState } from "react";
import StaticPageLayout from "@/components/StaticPageLayout";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { createBlogPost } from "@/app/actions";

export default function BlogAdminPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Curation & Data");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(() => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  });
  const [passcode, setPasscode] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-slugify helper
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove non-word characters
      .replace(/[\s_-]+/g, "-") // replace spaces and underscores with a single dash
      .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const post = {
      id: slug,
      title,
      category,
      summary,
      content,
      date
    };

    try {
      const res = await createBlogPost(post, passcode);
      if (res.success) {
        setSuccess(true);
        // Clear fields except passcode/date
        setTitle("");
        setSlug("");
        setSummary("");
        setContent("");
      } else {
        setError(res.error || "Failed to publish article");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaticPageLayout title="Blog Admin" subtitle="Secure portal to upload and publish new articles.">
      <div className="w-full">
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 size={64} className="text-green-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2 mt-0">Article Published!</h3>
            <p className="text-white/60 mb-8 max-w-[400px]">
              Your blog post has been successfully written to the database and is now live.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all cursor-pointer text-white"
              >
                Write Another
              </button>
              <Link 
                href="/blogs"
                className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all text-center no-underline flex items-center justify-center"
              >
                View Blogs
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-[11px] font-bold uppercase tracking-widest text-white/50 pl-2">Title</label>
              <input 
                type="text" 
                id="title" 
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/20"
                placeholder="e.g. 5 Classic Sitcoms Worth Rewatching"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="slug" className="text-[11px] font-bold uppercase tracking-widest text-white/50 pl-2">URL Slug</label>
              <input 
                type="text" 
                id="slug" 
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/20"
                placeholder="e.g. classic-sitcoms-worth-rewatching"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-[11px] font-bold uppercase tracking-widest text-white/50 pl-2">Category</label>
                <select 
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-[#111] border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="Curation & Data">Curation & Data</option>
                  <option value="Binge Guides">Binge Guides</option>
                  <option value="Cinema History">Cinema History</option>
                  <option value="Product Updates">Product Updates</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-[11px] font-bold uppercase tracking-widest text-white/50 pl-2">Date</label>
                <input 
                  type="text" 
                  id="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="summary" className="text-[11px] font-bold uppercase tracking-widest text-white/50 pl-2">Summary</label>
              <textarea 
                id="summary" 
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/20 resize-none"
                placeholder="Brief meta description or summary of the article..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="content" className="text-[11px] font-bold uppercase tracking-widest text-white/50 pl-2">Article Content</label>
              <textarea 
                id="content" 
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/20 resize-y"
                placeholder="Write the full markdown or plain text article contents here..."
              />
            </div>

            <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
              <label htmlFor="passcode" className="text-[11px] font-bold uppercase tracking-widest text-red-400 pl-2">Security Passcode</label>
              <input 
                type="password" 
                id="passcode" 
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="bg-white/5 border border-red-500/20 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-500/40 focus:bg-white/10 transition-all placeholder:text-white/20"
                placeholder="Enter admin passcode"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl text-[14px] font-bold tracking-widest uppercase transition-all duration-300 shadow-xl hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Publishing..." : (
                <>Publish Article <Send size={16} /></>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Small back button at bottom left */}
      <div className="mt-16 flex justify-start">
        <Link 
          href="/blogs" 
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white px-5 py-2.5 rounded-full text-[13px] font-bold tracking-wider transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft size={14} /> back
        </Link>
      </div>
    </StaticPageLayout>
  );
}
