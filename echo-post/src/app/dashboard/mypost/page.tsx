"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Pencil, Eye, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Author = {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl?: string | null;
};

type Tag = {
  name: string;
  slug: string;
};

type Post = {
  id: string;
  slug: string;
  title: string;
  updatedAt: string;
  coverImage?: string | null;
  author: Author;
  tags: Tag[];
  _count?: {
    comments: number;
    likes: number;
  };
};

export default function PostsPageUI() {
  const { user, token, initializing } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"DRAFTS" | "PUBLISHED">("DRAFTS");

  const [drafts, setDrafts] = useState<Post[]>([]);
  const [published, setPublished] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
      return;
    }

    if (user && token) {
      fetchPosts();
    }
  }, [user, token, initializing, router]);

  const fetchPosts = async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch posts filtered by current user's ID
      const [draftRes, pubRes] = await Promise.all([
        fetch(`/post?status=DRAFT&author=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/post?status=PUBLISHED&author=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!draftRes.ok || !pubRes.ok) {
        throw new Error("Failed to fetch posts");
      }

      const draftData = await draftRes.json();
      const pubData = await pubRes.json();

      setDrafts(draftData.items || []);
      setPublished(pubData.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentPosts = activeTab === "DRAFTS" ? drafts : published;

  // LOADING
  if (loading) {
    return (
      <div className="text-center min-h-screen py-20 text-gray-500 text-lg animate-pulse">
        Loading posts...
      </div>
    );
  }


  if (error) {
    return (
      <div className="text-center py-20 text-red-600 text-lg">
        {error}
      </div>
    );
  }


  if (currentPosts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          No {activeTab === "DRAFTS" ? "Drafts" : "Published Posts"} Found
        </h2>
        <Link
          href="/dashboard/createPost"
          className="text-white bg-pink-900 px-4 py-2 rounded-xl hover:bg-pink-800 inline-block transition"
        >
          Create a Post
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-pink-900">
        My Posts
      </h1>


      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`mr-6 pb-2 font-semibold text-lg ${
            activeTab === "DRAFTS"
              ? "text-pink-900 border-b-4 border-pink-900"
              : "text-black/70"
          }`}
          onClick={() => setActiveTab("DRAFTS")}
        >
          Drafts
        </button>

        <button
          className={`pb-2 font-semibold text-lg ${
            activeTab === "PUBLISHED"
              ? "text-pink-900 border-b-4 border-pink-900"
              : "text-black/70"
          }`}
          onClick={() => setActiveTab("PUBLISHED")}
        >
          Published
        </button>
      </div>

      {/* POSTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {currentPosts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.slug || post.id}`}
            className="group relative block bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100"
          >
            {/* Cover Image */}
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt="Cover"
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
            )}

            {/* Author */}
            <div className="flex items-center mb-4">
              <img
                src={
                  post.author?.avatarUrl ||
                  "https://res.cloudinary.com/demo/image/upload/avatar_placeholder.png"
                }
                className="w-12 h-12 rounded-full object-cover mr-4"
                alt="Author"
              />
              <div>
                <p className="text-sm font-medium text-black">
                  {post.author?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(post.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold mb-3 text-black group-hover:text-pink-900 transition">
              {post.title}
            </h2>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="text-xs px-3 py-1 rounded-full bg-pink-900/10 text-pink-900 font-medium"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-between text-xs text-gray-600 mt-4">
              <span className="flex items-center gap-1">
                <Heart size={14} /> {post._count?.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} /> {post._count?.comments || 0}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">

              {activeTab === "DRAFTS" ? (
                <Link
                  href={`/dashboard/mypost/${post.slug}`}
                  className="bg-pink-900 text-white p-2 rounded-full hover:bg-pink-800"
                  title="Edit post"
                >
                  <Pencil size={16} />
                </Link>
              ) : (
                <Link
                  href={`/dashboard/mypost/${post.slug}`}
                  className="bg-pink-900 text-white p-2 rounded-full hover:bg-pink-800"
                  title="View post"
                >
                  <Eye size={16} />
                </Link>
              )}

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
