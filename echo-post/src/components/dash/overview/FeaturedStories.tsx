"use client";

import { TrendingUp, Heart } from "lucide-react";
// Using any for legacy compatibility
type LegacyPost = any;
import Link from "next/link";

interface FeaturedStoriesProps {
  posts: LegacyPost[];
}

const FeaturedStories: React.FC<FeaturedStoriesProps> = ({ posts }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-pink-900" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Featured Stories</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/dashboard/post/${(post as any).slug || post.id}`}
            className="group relative rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
              <img
                src={post.cover || "/image/image.png"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/image/image.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                  Featured
                </span>
                <span className="text-xs text-white/80">{post.readTime || "5 min read"}</span>
              </div>

              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 group-hover:text-pink-300 transition-colors line-clamp-2">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3 line-clamp-2">{post.excerpt}</p>

              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium truncate">{post.author}</p>
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{post.likes || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedStories;
