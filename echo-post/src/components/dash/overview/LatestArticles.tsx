"use client";

import { Post } from "@/types/glob";
import { User, Clock, Heart, Bookmark } from "lucide-react";
import Link from "next/link";

interface LatestArticlesProps {
  latestPosts: Post[];
  bookmarked: Record<string, boolean>;
  liked: Record<string, boolean>;
  onBookmark: (id: string) => void;
  onLike: (id: string) => void;
}

const LatestArticles: React.FC<LatestArticlesProps> = ({
  latestPosts,
  bookmarked,
  liked,
  onBookmark,
  onLike,
}) => {
  if (latestPosts.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {latestPosts.map((post) => (
          <div
            key={post.id}
            className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 bg-white rounded-xl"
          >
            <Link href={`/dashboard/mypost/${(post as any).slug || post.id}`}>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.cover || "/image/image.png"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/image/image.png";
                  }}
                />
              </div>

              <div className="p-5">
                <h4 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-pink-600 transition-colors">
                  {post.title}
                </h4>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <User size={14} />
                    <span className="font-medium">{post.author}</span>
                    <span>•</span>
                    <Clock size={14} />
                    <span>{post.time || "Recently"}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onLike(post.id);
                      }}
                      className={`transition-colors ${
                        liked[post.id]
                          ? "text-pink-900"
                          : "text-gray-400 hover:text-pink-900"
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={liked[post.id] ? "currentColor" : "none"}
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onBookmark(post.id);
                      }}
                      className={`transition-colors ${
                        bookmarked[post.id]
                          ? "text-amber-500"
                          : "text-gray-400 hover:text-amber-500"
                      }`}
                    >
                      <Bookmark
                        size={18}
                        fill={bookmarked[post.id] ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestArticles;
