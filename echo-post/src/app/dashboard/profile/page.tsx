"use client";

import React, { useState } from "react";
import Link from "next/link";

// Dummy Data
const drafts = [
  { id: "1", title: "My First Draft", updatedAt: "2025-11-19T12:00:00Z", tags: ["Tech", "Coding"] },
  { id: "2", title: "Learning React 19", updatedAt: "2025-11-18T15:30:00Z", tags: ["React", "Programming"] },
];

const published = [
  { id: "3", title: "Design Patterns in 2025", updatedAt: "2025-11-17T09:20:00Z", tags: ["Design", "Architecture"] },
  { id: "4", title: "Next.js Tips", updatedAt: "2025-11-16T14:10:00Z", tags: ["Next.js", "WebDev"] },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"DRAFTS" | "PUBLISHED">("PUBLISHED");
  const currentPosts = activeTab === "DRAFTS" ? drafts : published;

  return (
    <div className=" min-h-screen">
      {/* Banner */}
      <div className="h-48 w-full bg-gradient-to-r from-pink-900/20 to-pink-900/10 relative"></div>

      {/* Profile Info */}
      <div className="max-w-3xl mx-auto px-6 -mt-16 text-center">
        {/* Avatar */}
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-pink-900 mx-auto shadow-md"></div>
        </div>

        {/* Name & Bio */}
        <h1 className="text-3xl font-bold mt-4 text-black">Diane Ingire</h1>
        <p className="text-gray-600 mt-2">Front-End Developer | Tech Writer | React Enthusiast</p>

        {/* Stats */}
        <div className="flex justify-center mt-6 gap-10 text-black font-medium">
          <div className="text-center">
            <p className="text-lg text-pink-900 font-semibold">4</p>
            <p className="text-gray-500 text-sm">Drafts</p>
          </div>
          <div className="text-center">
            <p className="text-lg text-pink-900 font-semibold">12</p>
            <p className="text-gray-500 text-sm">Published</p>
          </div>
          <div className="text-center">
            <p className="text-lg text-black font-semibold">1.2k</p>
            <p className="text-gray-500 text-sm">Views</p>
          </div>
          <div className="text-center">
            <p className="text-lg text-black font-semibold">150</p>
            <p className="text-gray-500 text-sm">Likes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mt-8 border-b border-gray-200">
          <button
            className={`pb-2 font-semibold text-lg ${
              activeTab === "DRAFTS" ? "text-pink-900 border-b-2 border-pink-900" : "text-black/70"
            }`}
            onClick={() => setActiveTab("DRAFTS")}
          >
            Drafts
          </button>
          <button
            className={`pb-2 font-semibold text-lg ${
              activeTab === "PUBLISHED" ? "text-pink-900 border-b-2 border-pink-900" : "text-black/70"
            }`}
            onClick={() => setActiveTab("PUBLISHED")}
          >
            Published
          </button>
        </div>

        {/* Posts List */}
        <div className="mt-8 flex flex-col gap-6">
          {currentPosts.map((post) => (
            <Link
              key={post.id}
              href="#"
              className="group block p-6 border-b border-gray-200 hover:bg-gray-50 transition rounded-lg"
            >
              {/* Post Title */}
              <h2 className="text-2xl font-bold text-black group-hover:text-pink-900 transition">
                {post.title}
              </h2>

              {/* Updated Date */}
              <p className="text-gray-500 text-sm mt-1">
                Updated: {new Date(post.updatedAt).toLocaleDateString()}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-pink-900/10 text-pink-900 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
