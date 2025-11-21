"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import TrendingAuthors from "@/components/dash/overview/TrendingAuthors";
import { Heart, MessageCircle } from "lucide-react";

type Tag = {
  name: string;
  slug: string;
};

type Author = {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl?: string | null;
};

type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  coverImage?: string | null;
  createdAt: string;
  updatedAt: string;
  author: Author;
  tags: Tag[];
  _count?: {
    comments: number;
    likes: number;
  };
};

const TRENDING_TOPICS = ["react", "nextjs", "design", "travel", "health", "coding", "technology", "lifestyle"];

export default function ExplorePage() {
  const { token, initializing, user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
      return;
    }

    if (user) {
      fetchAllPosts();
    }
  }, [user, initializing, router, selectedTag]);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params - only fetch PUBLISHED posts from all users
      const params = new URLSearchParams({
        status: "PUBLISHED",
        limit: "20",
      });

      if (selectedTag) {
        params.append("tag", selectedTag);
      }

      if (query.trim()) {
        params.append("q", query.trim());
      }

      const res = await fetch(`/post?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      setPosts(data.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        fetchAllPosts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const filtered = useMemo(() => {
    return posts;
  }, [posts]);

  if (loading && posts.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex font-sans text-gray-800">
      <div className="flex-1 flex flex-col border-r overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-pink-900">Explore</h1>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, authors, tags..."
            className="w-80 px-4 py-2 border rounded-full outline-none focus:border-pink-900 focus:ring-1 focus:ring-pink-900"
          />
        </div>

        {/* Trending Topics / Tags */}
        <div className="px-6 py-3 flex gap-3 overflow-x-auto no-scrollbar flex-shrink-0 bg-white border-b border-gray-200">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !selectedTag
                ? "bg-pink-900 text-white shadow"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-pink-50 hover:text-pink-900"
            }`}
          >
            All
          </button>
          {TRENDING_TOPICS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedTag === tag
                  ? "bg-pink-900 text-white shadow"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-pink-50 hover:text-pink-900"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {error && (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          )}

          {!error && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No posts found.</p>
              <p className="text-sm">Try searching for something else or check back later.</p>
            </div>
          )}

          {filtered.map((post) => {
            const excerpt = post.content.substring(0, 150).replace(/[#*`]/g, "").trim() + "...";
            const readTime = Math.ceil(post.content.length / 1000);
            const authorName = post.author.name || post.author.username || "Anonymous";

            return (
              <Link
                key={post.id}
                href={`/dashboard/mypost/${post.slug}`}
                className="group flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg hover:shadow-lg transition cursor-pointer border border-gray-100"
              >
                {post.coverImage && (
                  <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      {post.author.avatarUrl ? (
                        <img
                          src={post.author.avatarUrl}
                          alt={authorName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-pink-900 flex items-center justify-center text-white text-xs">
                          {authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{authorName}</span>
                      <span>•</span>
                      <span>{readTime} min read</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-900 transition mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{excerpt}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.slug}
                          className="text-xs bg-pink-900/10 text-pink-900 px-2 py-0.5 rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart size={14} /> {post._count?.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} /> {post._count?.comments || 0}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right Panel */}
      <aside className="hidden lg:flex flex-col w-80 flex-shrink-0 gap-6 p-4">
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <h4 className="font-bold text-lg mb-3 text-gray-900">Trending Topics</h4>
          <ul className="flex flex-col gap-2">
            {TRENDING_TOPICS.map((topic) => (
              <li
                key={topic}
                onClick={() => setSelectedTag(topic)}
                className={`text-gray-700 hover:bg-pink-50 hover:text-pink-900 px-3 py-1 rounded-full cursor-pointer transition ${
                  selectedTag === topic ? "bg-pink-50 text-pink-900" : ""
                }`}
              >
                #{topic}
              </li>
            ))}
          </ul>
        </div>

        {/* Trending Authors */}
        <TrendingAuthors limit={3} />
      </aside>
    </div>
  );
}
