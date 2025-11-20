"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Banner from "@/components/dash/overview/Banner";
import Categories from "@/components//dash/overview/Categories";
import FeaturedStories from "@/components/dash/overview/FeaturedStories";
import LatestArticles from "@/components/dash/overview/LatestArticles";
import TrendingAuthors from "@/components/dash/overview/TrendingAuthors";
import TrendingStories from "@/components/dash/overview/TrendingStories";
import { Post, Category, Author } from "@/types/glob";

export default function HomePage() {
  const { user, isFirstTime, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
    }
  }, [initializing, user, router]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;


  const categories: Category[] = [
    { name: "Technology", color: "bg-pink-900 text-white" },
    { name: "Design", color: "bg-gray-800 text-white" },
    { name: "Lifestyle", color: "bg-black text-white" },
    { name: "Coding", color: "bg-gray-200 text-black" },
  ];

  const featuredPosts: Post[] = [
    {
      id: "1",
      title: "Mastering the Art of Digital Writing",
      excerpt: "Learn how to create engaging, relevant, and impactful content.",
      cover: "/image/image.png",
      author: "Jane Doe",
      readTime: "5 min read",
      likes: 320,
    },
    {
      id: "2",
      title: "The Rise of AI in Creative Industries",
      excerpt: "AI is changing how we create. Here's what you should know.",
      cover: "/image/image.png",
      author: "Alice Green",
      readTime: "7 min read",
      likes: 210,
    },
  ];

  const latestPosts: Post[] = [
    {
      id: "3",
      title: "The Psychology Behind Great Design",
      excerpt: "Understanding users at a deeper level can improve UI/UX.",
      cover: "/image/image.png",
      author: "Mark Philips",
      time: "2h ago",
      likes: 12,
    },
    {
      id: "4",
      title: "Top 10 Tools Every Developer Should Know in 2025",
      excerpt: "These tools will boost your productivity instantly.",
      cover: "/image/image.png",
      author: "Clara Nduwimana",
      time: "4h ago",
      likes: 98,
    },
  ];

  const authors: Author[] = [
    {
      id: "a1",
      name: "John Amos",
      avatar: "/image/image.png",
      followers: "12.4k followers",
    },
    {
      id: "a2",
      name: "Linda K.",
      avatar: "/image/image.png",
      followers: "9.1k followers",
    },
     {
      id: "a3",
      name: "Linda K.",
      avatar: "/image/image.png",
      followers: "9.1k followers",
    },
  ];



  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLike = (id: string) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFollow = (id: string) => {
    setFollowed((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  const displayName = user.name || user.username || user.email?.split("@")[0] || "Writer";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-gray-800">
      {/* Welcome Banner for First-Time Users */}
      {isFirstTime && (
        <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                 Welcome, {displayName}!
              </h2>
              <p className="text-gray-700 mb-4">
                Get started by completing your profile and writing your first story.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/dashboard/profile"
                  className="px-4 py-2 bg-pink-900 text-white rounded-full hover:bg-pink-800 transition font-medium"
                >
                  Complete Profile
                </Link>
                <Link
                  href="/dashboard/createPost"
                  className="px-4 py-2 bg-white border border-pink-900 text-pink-900 rounded-full hover:bg-pink-50 transition font-medium"
                >
                  Write Your First Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Banner for Returning Users */}
      {!isFirstTime && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {displayName}! 
          </h1>
          <p className="text-gray-600">
            You have {user.stats?.drafts || 0} draft{user.stats?.drafts !== 1 ? "s" : ""} and{" "}
            {user.stats?.published || 0} published{" "}
            {user.stats?.published !== 1 ? "stories" : "story"}.
          </p>
        </div>
      )}
      
      <Banner />

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

       
        <div className="lg:col-span-2 space-y-10">

          
          <Categories categories={categories} />

         
          <FeaturedStories posts={featuredPosts} />

         
          <LatestArticles
            latestPosts={latestPosts}
            bookmarked={bookmarked}
            liked={liked}
            onBookmark={toggleBookmark}
            onLike={toggleLike}
          />
        </div>

        
        <aside className="space-y-10">

        <TrendingAuthors
            authors={authors}
            followed={followed}
            onFollow={toggleFollow}
          />
          <TrendingStories />

          

        </aside>
      </div>
    </div>
  );
}
