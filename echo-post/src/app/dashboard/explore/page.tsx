"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import LatestStories from "@/components/dash/overview/LatestArticles"; 
import { Post } from "@/types/glob";



const ALL_CATEGORIES = ["All", "Technology", "Design", "Lifestyle", "Coding", "Travel"];

const MOCK_STORIES: (Post & { category: string; cover: string; tags: string[] })[] = [
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
    cover: "/image/image.png",
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
    cover: "/image/image.png",
    author: "Claire U",
    likes: 89,
    time: "5 min read",
    category: "Lifestyle",
    tags: ["Health", "Wellness"],
  },

];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return MOCK_STORIES.filter((s) => {
      const catMatch = activeCategory === "All" || s.category === activeCategory;
      const q = query.trim().toLowerCase();
      const textMatch = !q || s.title.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q) || s.author.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [activeCategory, query]);

  return (
    <div className="min-h-screen font-serif text-gray-700 ">
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-pink-900">Explore</h1>

          <div className="flex items-center gap-3 w-2/5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stories, authors, tags..."
              className="w-full px-4 py-2 border rounded-full outline-none focus:border-pink-900"
            />
          </div>
        </div>

       
        <div className="mb-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-3">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === cat ? "bg-pink-900 text-white" : "bg-white text-black border border-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured hero */}
        <section className="mb-8">
          <div className="relative rounded-lg overflow-hidden">
            <img src="/image/image.png" alt="hero" className="w-full h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex items-end">
              <div>
                <p className="text-sm bg-pink-900/80 inline-block px-3 py-1 rounded-full text-white mb-2">Featured</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Stories worth your time</h2>
                <p className="text-white/90 mt-2">Hand-picked articles and trending topics.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((story) => (
            <Link key={story.id} href="#" className="group block rounded-lg overflow-hidden border bg-white hover:shadow-lg transition">
              <div className="relative h-44 md:h-56 overflow-hidden">
                <img src={story.cover} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">{story.author}</p>
                  <p className="text-xs text-gray-500">{story.time}</p>
                </div>

                <h3 className="text-xl font-semibold text-black group-hover:text-pink-900">{story.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{story.excerpt}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {story.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-full bg-pink-900/10 text-pink-900">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* If no results */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No stories found for that category/query.</div>
        )}
      </main>
    </div>
  );
}
