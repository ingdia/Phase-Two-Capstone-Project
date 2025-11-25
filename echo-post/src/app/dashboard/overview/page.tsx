"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import Banner from "@/components/dash/overview/Banner";
import Categories from "@/components//dash/overview/Categories";
import FeaturedStories from "@/components/dash/overview/FeaturedStories";
import LatestArticles from "@/components/dash/overview/LatestArticles";
import TrendingAuthors from "@/components/dash/overview/TrendingAuthors";
import TrendingStories from "@/components/dash/overview/TrendingStories";

import { Post, Category, Author } from "@/types/glob";

export default function HomePage() {
  const { user, token, initializing } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
      return;
    }

    if (user && token) {
      fetchAllData();
    }
  }, [user, token, initializing, router]);

  const fetchAllData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Fetch all data in parallel
      const [tagsRes, featuredRes, latestRes] = await Promise.all([
        fetch("/tags", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch("/post/featured?limit=2", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch("/post?status=PUBLISHED&limit=4", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      ]);

      // Process tags into categories
      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        const colors = [
          "bg-pink-900 text-white",
          "bg-gray-800 text-white",
          "bg-black text-white",
          "bg-gray-200 text-black",
          "bg-blue-900 text-white",
          "bg-purple-900 text-white",
        ];
        const categoriesData: Category[] = (tagsData.tags || []).slice(0, 6).map(
          (tag: any, index: number) => ({
            name: tag.name,
            color: colors[index % colors.length],
          })
        );
        setCategories(categoriesData);
      }

      // Process featured posts
      if (featuredRes.ok) {
        const featuredData = await featuredRes.json();
        const formattedFeatured: Post[] = (featuredData.posts || []).map((post: any) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.content.substring(0, 150).replace(/[#*`]/g, "").trim() + "...",
          cover: post.coverImage || "/image/image.png",
          author: post.author.name || post.author.username || "Anonymous",
          readTime: post.readTime || "5 min read",
          likes: post._count?.likes || 0,
        }));
        setFeaturedPosts(formattedFeatured);
      }

      // Process latest posts
      if (latestRes.ok) {
        const latestData = await latestRes.json();
        const formattedLatest: Post[] = (latestData.items || []).map((post: any) => {
          const timeAgo = getTimeAgo(new Date(post.createdAt));
          return {
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.content.substring(0, 100).replace(/[#*`]/g, "").trim() + "...",
            cover: post.coverImage || "/image/image.png",
            author: post.author.name || post.author.username || "Anonymous",
            time: timeAgo,
            likes: post._count?.likes || 0,
          };
        });
        setLatestPosts(formattedLatest);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLike = async (id: string) => {
    if (!token) return;
    
    // Update local state immediately for better UX
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

    try {
      const res = await fetch(`/post/${id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Revert on error
        setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
      }
    } catch (err) {
      console.error("Error liking post:", err);
      // Revert on error
      setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const toggleFollow = (id: string) => {
    setFollowed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (initializing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-900" />
      </div>
    );
  }

  if (!user) return null;


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-gray-800">
      <Banner />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
        <div className="xl:col-span-2 space-y-6 lg:space-y-10">
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
        
        <aside className="space-y-6 lg:space-y-10">
          <TrendingAuthors limit={3} />
          <TrendingStories />
        </aside>
      </div>
    </div>
  );
}
