"use client";

import { TrendingUp, Heart } from "lucide-react";
import { Post } from "@/types/glob";

interface FeaturedStoriesProps {
  posts: Post[];
}

const FeaturedStories: React.FC<FeaturedStoriesProps> = ({ posts }) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-pink-900" />
        <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="relative h-80 overflow-hidden">
              <img
                src={post.cover}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                  Featured
                </span>
                <span className="text-xs text-white/80">{post.readTime}</span>
              </div>

              <h2 className="text-2xl font-bold mb-2 group-hover:text-pink-300 transition-colors">
                {post.title}
              </h2>

              <p className="text-sm text-white/90 mb-3">{post.excerpt}</p>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{post.author}</p>
                <div className="flex items-center gap-1 text-sm">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedStories;
