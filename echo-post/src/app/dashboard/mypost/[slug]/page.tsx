"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Bookmark, Share2, Clock, Loader2, Edit, Trash2, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type Author = {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
};

type Tag = {
  name: string;
  slug: string;
};

type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  readTime: string;
  author: Author;
  tags: Tag[];
  likeCount: number;
  _count: {
    comments: number;
    likes: number;
  };
};

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const slug = params?.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clapped, setClapped] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/post/slug/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        if (res.status === 404) {
          setError("Post not found");
        } else {
          setError("Failed to load post");
        }
        return;
      }

      const data = await res.json();
      setPost(data);

      // Check if user has liked this post
      if (user && data.likes) {
        const userLiked = data.likes.some((like: any) => like.userId === user.id);
        setClapped(userLiked);
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

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
  }, [post]);

  const handleLike = async () => {
    if (!user || !token || !post) return;

    try {
      const res = await fetch(`/post/${post.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setClapped(!clapped);
        // Refresh post to get updated like count
        fetchPost();
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleDelete = async () => {
    if (!user || !token || !post) return;

    setDeleting(true);
    try {
      const res = await fetch(`/post/${post.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Post deleted successfully!");
        router.push("/dashboard/mypost");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isAuthor = user && post && user.id === post.author.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-900" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || "Post not found"}</p>
          <Link
            href="/dashboard/mypost"
            className="text-pink-900 hover:underline"
          >
            ← Back to My Posts
          </Link>
        </div>
      </div>
    );
  }

  const authorName = post.author.name || post.author.username || "Anonymous";
  const authorInitials = authorName.charAt(0).toUpperCase();

  // Format content for display - handle both HTML from rich editor and plain text
  const formatContent = (content: string) => {
    if (!content) return "";
    
    // If content is already HTML (contains HTML tags), use it directly
    if (content.includes("<") && content.includes(">")) {
      // Ensure we have proper paragraph tags for display
      if (!content.includes("<p>") && !content.includes("<h")) {
        // Wrap in paragraph if it's HTML but not structured
        return `<div class="post-content">${content}</div>`;
      }
      return `<div class="post-content">${content}</div>`;
    }
    
    // Convert plain text to HTML with proper formatting
    return content
      .split("\n\n")
      .map((para) => {
        if (!para.trim()) return "";
        // Handle headers
        if (para.trim().startsWith("# ")) {
          return `<h1 class="text-3xl font-bold my-4">${para.trim().substring(2)}</h1>`;
        }
        if (para.trim().startsWith("## ")) {
          return `<h2 class="text-2xl font-bold my-3">${para.trim().substring(3)}</h2>`;
        }
        if (para.trim().startsWith("### ")) {
          return `<h3 class="text-xl font-bold my-2">${para.trim().substring(4)}</h3>`;
        }
        // Handle quotes
        if (para.trim().startsWith("> ")) {
          return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">${para.trim().substring(2)}</blockquote>`;
        }
        return `<p class="mb-4 leading-relaxed">${para.trim().replace(/\n/g, "<br />")}</p>`;
      })
      .join("");
  };

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
        {post.coverImage && (
          <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
            <img 
              src={post.coverImage} 
              className="w-full h-80 object-cover" 
              alt={post.title} 
            />
          </div>
        )}

        {/* Meta & actions */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-3">{post.title}</h1>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="text-xs bg-pink-900/10 text-pink-900 px-2 py-1 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {post.author.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt={authorName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-pink-900 rounded-full flex items-center justify-center text-white font-semibold">
                  {authorInitials}
                </div>
              )}
              <div>
                <Link
                  href={`/dashboard/profile`}
                  className="text-sm font-medium text-black hover:text-pink-900"
                >
                  {authorName}
                </Link>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="inline w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString()} • {post.readTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAuthor && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-md border bg-white text-black border-gray-200 hover:bg-gray-50 transition"
                    title="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg z-50 min-w-[120px]">
                      <Link
                        href={`/dashboard/mypost/${post.slug}/edit`}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition"
                        onClick={() => setShowMenu(false)}
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-red-600 transition"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

              {user && (
                <button
                  onClick={handleLike}
                  className={`px-3 py-1 rounded-md border ${clapped ? "bg-pink-900 text-white border-pink-900" : "bg-white text-black border-gray-200"} transition`}
                >
                  <Heart className={`inline w-4 h-4 mr-2 ${clapped ? "fill-current" : ""}`} /> {post._count.likes + (clapped ? 1 : 0)}
                </button>
              )}

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
            {/* Rendered content */}
            <div 
              className="prose prose-lg max-w-none post-content-wrapper"
              style={{
                lineHeight: "1.75",
                fontSize: "1.125rem",
              }}
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
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
              <p className="text-sm text-gray-500">People clapped for this article {post._count.likes} times</p>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-2">Delete Post?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
