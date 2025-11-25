"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useOverviewData } from "@/hooks/useOverviewData";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";

import Banner from "@/components/dash/overview/Banner";
import Categories from "@/components//dash/overview/Categories";
import FeaturedStories from "@/components/dash/overview/FeaturedStories";
import LatestArticles from "@/components/dash/overview/LatestArticles";
import TrendingAuthors from "@/components/dash/overview/TrendingAuthors";
import TrendingStories from "@/components/dash/overview/TrendingStories";

export default function HomePage() {
  const { user, token, initializing } = useAuth();
  const router = useRouter();
  const { categories, featuredPosts, latestPosts, loading, error, refetch, optimisticLike } = useOverviewData(token);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
      return;
    }
  }, [user, initializing, router]);



  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLike = async (id: string) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    const result = await optimisticLike(id);
    if (!result?.success) {
      setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const toggleFollow = (id: string) => {
    setFollowed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (initializing || loading) {
    return <LoadingState size="lg" text="Loading dashboard..." fullScreen />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} fullScreen />;
  }

  if (!user) return null;


  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-gray-800">
        <Banner />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
          <div className="xl:col-span-2 space-y-6 lg:space-y-10">
            <ErrorBoundary>
              <Categories categories={categories} />
            </ErrorBoundary>
            <ErrorBoundary>
              <FeaturedStories posts={featuredPosts} />
            </ErrorBoundary>
            <ErrorBoundary>
              <LatestArticles
                latestPosts={latestPosts}
                bookmarked={bookmarked}
                liked={liked}
                onBookmark={toggleBookmark}
                onLike={toggleLike}
              />
            </ErrorBoundary>
          </div>
          
          <aside className="space-y-6 lg:space-y-10">
            <ErrorBoundary>
              <TrendingAuthors limit={3} />
            </ErrorBoundary>
            <ErrorBoundary>
              <TrendingStories />
            </ErrorBoundary>
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}
