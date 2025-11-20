"use client";

import React, { useEffect, useRef, useState } from "react";
import { Heart, Bookmark, Share2, Clock } from "lucide-react";
import Link from "next/link";
import { Post } from "@/types/glob";

const mockPost: Post & { contentHtml: string } = {
  id: "post-1",
  title: "How to Build a Thoughtful Writing Habit",
  excerpt: "Small routines compound — here’s a practical system to write more often.",
  cover: "/images/post1.jpg",
  author: "Diane Ingire",
  readTime: "8 min read",
  likes: 420,
  time: "Nov 20, 2025",
  contentHtml: `
    <p>Writing is a craft and a habit. The best way to improve is to write consistently.</p>
    <h3>1. Block time</h3>
    <p>Schedule dedicated writing blocks and treat them like meetings.</p>
    <h3>2. Write for a reader</h3>
    <p>Imagine the person who will benefit from your words.</p>
    <blockquote>A small piece repeated daily will change your life.</blockquote>
    <p>...more content...</p>
  `,
};

export default function ReaderPage() {
  const [clapped, setClapped] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!articleRef.current) return;
      const rect = articleRef.current.getBoundingClientRect();
      const height = articleRef.current.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(window.scrollY - (articleRef.current.offsetTop - 80), 0), height || 1);
      const pct = height > 0 ? Math.floor((scrolled / height) * 100) : 0;
      setProgress(pct);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* floating progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/0 z-50">
        <div
          className="h-1 bg-pink-900 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Cover */}
        <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
          <img src={mockPost.cover} className="w-full h-80 object-cover" alt={mockPost.title} />
        </div>

        {/* Meta & actions */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-3">{mockPost.title}</h1>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-900 rounded-full flex items-center justify-center text-white font-semibold">
                {mockPost.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-black">{mockPost.author}</p>
                <p className="text-xs text-gray-500">
                  {mockPost.time} • <Clock className="inline w-3 h-3 mx-1" /> {mockPost.readTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setClapped((s) => !s)}
                className={`px-3 py-1 rounded-md border ${clapped ? "bg-pink-900 text-white border-pink-900" : "bg-white text-black border-gray-200"} transition`}
              >
                <Heart className="inline w-4 h-4 mr-2" /> {clapped ? mockPost.likes + 1 : mockPost.likes}
              </button>

              <button
                onClick={() => setBookmarked((s) => !s)}
                className={`px-3 py-1 rounded-md border ${bookmarked ? "bg-black text-white border-black" : "bg-white text-black border-gray-200"} transition`}
              >
                <Bookmark className="inline w-4 h-4 mr-2" /> {bookmarked ? "Saved" : "Save"}
              </button>

              <button className="px-3 py-1 rounded-md border bg-white text-black border-gray-200">
                <Share2 className="inline w-4 h-4 mr-2" /> Share
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article column */}
          <article className="lg:col-span-2 prose prose-lg max-w-none text-gray-800" ref={articleRef}>
            {/* Rendered HTML content (dangerouslySetInnerHTML since content is HTML) */}
            <div dangerouslySetInnerHTML={{ __html: mockPost.contentHtml }} />
          </article>

          {/* Right sidebar: recommended */}
          <aside className="hidden lg:block">
            <div className="bg-white border rounded-xl p-6 shadow-sm sticky top-24">
              <h4 className="text-lg font-semibold mb-4">More like this</h4>

              {/* Suggested items (mock) */}
              {new Array(4).fill(null).map((_, i) => (
                <Link key={i} href="#" className="flex items-start gap-3 py-3 border-b last:border-b-0">
                  <img src={`/images/post${(i % 4) + 1}.jpg`} className="w-20 h-12 object-cover rounded-md" alt="suggest" />
                  <div>
                    <p className="text-sm font-medium text-black">Suggested article title {i + 1}</p>
                    <p className="text-xs text-gray-500 mt-1">by Author • 5 min read</p>
                  </div>
                </Link>
              ))}

              <div className="mt-4">
                <button className="w-full py-2 rounded-full bg-pink-900 text-white hover:bg-pink-800 transition">Follow author</button>
              </div>
            </div>

            <div className="mt-6 bg-white border rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold mb-3">Claps</h4>
              <p className="text-sm text-gray-500">People clapped for this article {mockPost.likes} times</p>
            </div>
          </aside>
        </div>

        {/* Comments UI (simplified) */}
        <section className="max-w-5xl mx-auto mt-12">
          <h3 className="text-xl font-semibold mb-4">Responses</h3>

          <div className="space-y-4">
            <div className="bg-white border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-900 flex items-center justify-center text-white">A</div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-black">Ana Mwiza</p>
                    <p className="text-xs text-gray-500">Nov 20</p>
                  </div>
                  <p className="text-gray-700 mt-2">Great thoughts — really enjoyed your point about small habits.</p>
                </div>
              </div>
            </div>

            {/* Reply form */}
            <div className="bg-white border rounded-xl p-4">
              <textarea className="w-full border rounded-md p-3 resize-none" rows={4} placeholder="Write a response..." />
              <div className="flex justify-end mt-3">
                <button className="px-4 py-2 rounded-full bg-pink-900 text-white">Respond</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
