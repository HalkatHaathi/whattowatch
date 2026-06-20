import { Metadata } from "next";
import StaticPageLayout from "@/components/StaticPageLayout";
import { getBlogPost, getReadNextBlogs } from "@/app/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) return { title: "Blog Not Found" };

  return {
    title: `${post.title} | Watch That Next Blog`,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) {
    notFound();
  }

  const readNextBlogs = await getReadNextBlogs(id);

  return (
    <StaticPageLayout title={post.title} subtitle={`${post.category} • Published ${post.date}`}>
      <div className="prose prose-invert max-w-none text-white/80">
        <p className="lead text-xl text-white font-medium mb-8">
          {post.summary}
        </p>
        
        <p className="whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Read Next Section */}
      {readNextBlogs.length > 0 && (
        <div className="mt-20 pt-10 border-t border-white/10">
          <h3 className="text-xl font-bold tracking-tight text-white mb-6 uppercase tracking-widest text-[11px] text-white/50">
            Read Next
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {readNextBlogs.map((item) => (
              <Link
                key={item.id}
                href={`/blogs/${item.id}`}
                className="group p-5 bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 no-underline flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] uppercase tracking-wider text-yellow-400 font-bold">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-white/30 font-semibold">{item.date}</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-white leading-snug group-hover:text-yellow-400 transition-colors line-clamp-2 mt-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-white/50 mt-2 line-clamp-3">
                    {item.summary}
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

      {/* Small back button on the left */}
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
