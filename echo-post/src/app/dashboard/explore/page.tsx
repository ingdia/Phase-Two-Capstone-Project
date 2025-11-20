"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Post } from "@/types/glob";

const ALL_CATEGORIES = ["All", "Technology", "Design", "Lifestyle", "Coding", "Travel"] as const;
type Category = typeof ALL_CATEGORIES[number];

interface Story extends Post {
  category: Category;
  cover: string;
  tags: string[];
}

const MOCK_STORIES: Story[] = [
  {
    id: "s1",
    title: "Learning React 19",
    excerpt: "A practical guide to upgrading your stack and mental models.",
    cover: "/image/image.png",
    author: "Diane Ingire",
    likes: 120,
    time: "6 min read",
    category: "Coding",
    tags: ["React", "Frontend"],
  },
  {
    id: "s2",
    title: "Design Patterns in 2025",
    excerpt: "Modern patterns for modern teams.",
    cover: "/image/design.png",
    author: "Alex M",
    likes: 210,
    time: "8 min read",
    category: "Design",
    tags: ["Design", "Systems"],
  },
  {
    id: "s3",
    title: "Healthy Life Habits",
    excerpt: "Small routines that compound into big changes.",
    cover: "/image/healthy.png",
    author: "Claire U",
    likes: 89,
    time: "5 min read",
    category: "Lifestyle",
    tags: ["Health", "Wellness"],
  },
];

const TRENDING_TOPICS = ["React", "Next.js", "Design", "Travel", "Health", "Coding"];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return MOCK_STORIES.filter((s) => {
      const catMatch = activeCategory === "All" || s.category === activeCategory;
      const q = query.trim().toLowerCase();
      const textMatch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [activeCategory, query]);

  return (
    <div className="h-screen flex font-sans text-gray-800">
      
      <div className="flex-1 flex flex-col border-r  overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 ">
          <h1 className="text-3xl font-bold text-pink-900">Explore</h1>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, authors, tags..."
            className="w-80 px-4 py-2 border rounded-full outline-none focus:border-pink-900 focus:ring-1 focus:ring-pink-900"
          />
        </div>

        {/* Categories */}
        <div className="px-6 py-3 flex gap-3 overflow-x-auto no-scrollbar flex-shrink-0 bg-white border-b border-gray-200">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-pink-900 text-white shadow"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-pink-50 hover:text-pink-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {filtered.map((story) => (
            <Link
              key={story.id}
              href={`/posts/${story.id}`}
              className="flex flex-col md:flex-row gap-4 p-4  rounded-lg hover:shadow-lg transition cursor-pointer"
            >
              {story.cover && (
                <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={story.cover}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}

              <div className="flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span>{story.author}</span>
                  <span>•</span>
                  <span>{story.time}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-900 transition">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{story.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-pink-900/10 text-pink-900 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">No stories found.</div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <aside className="hidden lg:flex flex-col w-80 flex-shrink-0 gap-6 p-4">
        <div className=" p-4 ">
          <h4 className="font-bold text-lg mb-3 text-gray-900">Trending Topics</h4>
          <ul className="flex flex-col gap-2">
            {TRENDING_TOPICS.map((topic) => (
              <li
                key={topic}
                className="text-gray-700 hover:bg-pink-50 hover:text-pink-900 px-3 py-1 rounded-full cursor-pointer transition"
              >
                #{topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h4 className="font-bold text-lg mb-3 text-gray-900">Suggested Authors</h4>
          <ul className="flex flex-col gap-3">
            {["Diane Ingire", "Alex M", "Claire U"].map((author) => (
              <li
                key={author}
                className="flex items-center justify-between hover:bg-gray-50 px-3 py-2 rounded-lg transition"
              >
                <span>{author}</span>
                <button className="text-sm text-white bg-pink-900 px-3 py-1 rounded-full hover:bg-pink-700 transition">
                  Follow
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
