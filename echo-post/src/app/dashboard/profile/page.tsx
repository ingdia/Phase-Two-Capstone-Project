"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, isFirstTime, initializing } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"DRAFTS" | "PUBLISHED">("PUBLISHED");
  const [posts, setPosts] = useState<{ drafts: any[]; published: any[] }>({ drafts: [], published: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
      return;
    }

    if (user) {
      fetchUserPosts();
    }
  }, [user, initializing, router]);

  const fetchUserPosts = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem("token");
      const [draftsRes, publishedRes] = await Promise.all([
        fetch(`/post?author=${user.id}&status=DRAFT`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/post?author=${user.id}&status=PUBLISHED`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const draftsData = draftsRes.ok ? await draftsRes.json() : { items: [] };
      const publishedData = publishedRes.ok ? await publishedRes.json() : { items: [] };

      setPosts({
        drafts: draftsData.items || [],
        published: publishedData.items || [],
      });
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  if (initializing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.name || user.username || user.email?.split("@")[0] || "User";
  const displayUsername = user.username || user.email?.split("@")[0] || "@user";
  const avatarInitials = displayName.charAt(0).toUpperCase();
  const currentPosts = activeTab === "DRAFTS" ? posts.drafts : posts.published;
  const stats = user.stats || { published: 0, drafts: 0, followers: 0, following: 0, likes: 0 };

  return (
    <div className="min-h-screen ">
      {/* Banner */}
      <div className="h-28 w-full bg-gradient-to-r rounded-b-full from-gray-900/20 to-gray-900/10 relative"></div>

      {/* Profile Info */}
      <div className="max-w-3xl mx-auto px-6 -mt-16 text-center">
        {/* Avatar */}
        <div className="relative inline-block">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md mx-auto"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-900 mx-auto shadow-md flex items-center justify-center text-white text-4xl font-semibold">
              {avatarInitials}
            </div>
          )}
        </div>

        {/* Name & Bio */}
        <h1 className="text-3xl font-bold mt-4 text-black">{displayName}</h1>
        {isFirstTime ? (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-md mx-auto">
            <p className="text-gray-700 text-sm mb-2">
               Welcome! This is your first time. Complete your profile by adding a bio to get started.
            </p>
            <Link
              href="/dashboard/profile/edit"
              className="text-gray-900 hover:underline font-medium text-sm"
            >
              Complete Profile →
            </Link>
          </div>
        ) : (
          <p className="text-gray-600 mt-2">{user.bio || "No bio yet"}</p>
        )}
        {user.username && (
          <p className="text-gray-500 text-sm mt-1">@{user.username}</p>
        )}

        {/* Stats */}
        <div className="flex justify-center mt-6 gap-10 text-black font-medium">
          <div className="text-center">
            <p className="text-lg text-gray-900 font-semibold">{stats.drafts}</p>
            <p className="text-gray-500 text-sm">Drafts</p>
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-900 font-semibold">{stats.published}</p>
            <p className="text-gray-500 text-sm">Published</p>
          </div>
          <div className="text-center">
            <p className="text-lg text-black font-semibold">{stats.followers}</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg text-black font-semibold">{stats.likes}</p>
            <p className="text-gray-500 text-sm">Likes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mt-8 border-b border-gray-200">
          <button
            className={`pb-2 font-semibold text-lg ${
              activeTab === "DRAFTS" ? "text-gray-900 border-b-2 border-gray-900" : "text-black/70"
            }`}
            onClick={() => setActiveTab("DRAFTS")}
          >
            Drafts
          </button>
          <button
            className={`pb-2 font-semibold text-lg ${
              activeTab === "PUBLISHED" ? "text-gray-900 border-b-2 border-gray-900" : "text-black/70"
            }`}
            onClick={() => setActiveTab("PUBLISHED")}
          >
            Published
          </button>
        </div>

        {/* Posts List */}
        <div className="mt-8 flex flex-col gap-6">
          {currentPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No {activeTab === "DRAFTS" ? "drafts" : "published posts"} yet</p>
              {activeTab === "DRAFTS" && (
                <Link
                  href="/dashboard/createPost"
                  className="text-gray-900 hover:underline font-medium"
                >
                  Create your first post →
                </Link>
              )}
            </div>
          ) : (
            currentPosts.map((post: any) => (
              <Link
                key={post.id}
                href={`/dashboard/mypost/${post.slug}`}
                className="group block p-6 border-b border-gray-200 hover:bg-gray-50 transition rounded-lg"
              >
                {/* Post Title */}
                <h2 className="text-2xl font-bold text-black group-hover:text-gray-900 transition">
                  {post.title}
                </h2>

                {/* Updated Date */}
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === "DRAFTS" ? "Last updated" : "Published"}:{" "}
                  {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map((tag: any, i: number) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-gray-900/10 text-gray-900 font-medium"
                      >
                        {typeof tag === "string" ? tag : tag.name || tag.slug}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
