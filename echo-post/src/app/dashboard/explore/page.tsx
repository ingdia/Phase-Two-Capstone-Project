"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import TrendingAuthors from "@/components/dash/overview/TrendingAuthors";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SearchBar from "@/components/ui/SearchBar";
import TagFilter from "@/components/ui/TagFilter";
import PostList from "@/components/posts/PostList";
import { usePosts } from "@/hooks/usePosts";

const TRENDING_TOPICS = ["react", "nextjs", "design", "travel", "health", "coding", "technology", "lifestyle"];

export default function ExplorePage() {
  const { token, initializing, user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { data: postsData, isLoading, error, refetch } = usePosts('PUBLISHED');
  const posts = postsData?.items || [];

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
      return;
    }
  }, [user, initializing, router]);

  const filtered = posts;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row font-sans text-gray-800">
        <div className="flex-1 flex flex-col overflow-hidden">
          <LoadingSpinner size="lg" text="Loading posts..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row font-sans text-gray-800">
        <div className="flex-1 flex flex-col overflow-hidden">
          <ErrorMessage 
            message="Failed to load posts. Please try again." 
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans text-gray-800">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore</h1>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search stories, authors, tags..."
          />
        </div>

        <TagFilter
          tags={TRENDING_TOPICS}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {error && (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          )}
          {!error && <PostList posts={filtered} />}
        </div>
      </div>

      {/* Right Panel */}
      <aside className="hidden xl:flex flex-col w-80 flex-shrink-0 gap-6 p-4">
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <h4 className="font-bold text-lg mb-3 text-gray-900">Trending Topics</h4>
          <ul className="flex flex-col gap-2">
            {TRENDING_TOPICS.map((topic) => (
              <li
                key={topic}
                onClick={() => setSelectedTag(topic)}
                className={`text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-1 rounded-full cursor-pointer transition ${
                  selectedTag === topic ? "bg-gray-100 text-gray-900" : ""
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
