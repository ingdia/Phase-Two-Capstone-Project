"use client";

import React, { useState } from "react";
import Link from "next/link";

const drafts = [
  { id: "1", title: "My First Draft", updatedAt: "2025-11-19T12:00:00Z", author: { name: "Diane" }, tags: ["Tech", "Coding"] },
  { id: "2", title: "Learning React 19", updatedAt: "2025-11-18T15:30:00Z", author: { name: "Diane" }, tags: ["React", "Programming"] },
];

const published = [
  { id: "3", title: "Design Patterns in 2025", updatedAt: "2025-11-17T09:20:00Z", author: { name: "Diane" }, tags: ["Design", "Architecture"] },
  { id: "4", title: "Next.js Tips", updatedAt: "2025-11-16T14:10:00Z", author: { name: "Diane" }, tags: ["Next.js", "WebDev"] },
];

export default function PostsPageUI() {
  const [activeTab, setActiveTab] = useState<"DRAFTS" | "PUBLISHED">("DRAFTS");

  const currentPosts = activeTab === "DRAFTS" ? drafts : published;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 min-h-screen ">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-8 text-pink-900">My Posts</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`mr-6 pb-2 font-semibold text-lg ${activeTab === "DRAFTS" ? "text-pink-900 border-b-4 border-pink-900" : "text-black/70"}`}
          onClick={() => setActiveTab("DRAFTS")}
        >
          Drafts
        </button>
        <button
          className={`pb-2 font-semibold text-lg ${activeTab === "PUBLISHED" ? "text-pink-900 border-b-4 border-pink-900" : "text-black/70"}`}
          onClick={() => setActiveTab("PUBLISHED")}
        >
          Published
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {currentPosts.map((post) => (
          <Link
            key={post.id}
            href="#"
            className="group relative block bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100"
          >
            {/* Author Info */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-pink-900 flex-shrink-0 mr-4"></div>
              <div>
                <p className="text-sm font-medium text-black">{post.author.name}</p>
                <p className="text-xs text-gray-500">
                  Updated: {new Date(post.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Post Title */}
            <h2 className="text-2xl font-bold mb-3 text-black group-hover:text-pink-900 transition">
              {post.title}
            </h2>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-pink-900/10 text-pink-900 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              {activeTab === "DRAFTS" ? (
                <button className="bg-pink-900 text-white px-3 py-1 rounded-full text-xs hover:bg-pink-800">
                  Edit
                </button>
              ) : (
                <button className="bg-pink-900 text-white px-3 py-1 rounded-full text-xs hover:bg-pink-800">
                  View
                </button>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
