"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Bookmark, Share2, Clock, Loader2, MessageCircle, UserPlus, UserMinus, Send } from "lucide-react";
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

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const slug = params?.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clapped, setClapped] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
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

      const res = await fetch(`/post/${slug}`, {
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

      if (user) {
        const userLiked = data.userLiked !== undefined 
          ? data.userLiked 
          : (data.likes && data.likes.some((like: any) => like.userId === user.id));
        setClapped(userLiked || false);
      }

      if (user && data.author && data.author.id !== user.id) {
        checkFollowingStatus(data.author.id);
      }

      if (data.id) {
        fetchCommentsForPost(data.id);
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

  const fetchCommentsForPost = async (postId: string) => {
    try {
      setLoadingComments(true);
      const res = await fetch(`/post/${slug}/comments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const checkFollowingStatus = async (authorId: string) => {
    if (!user || !token || user.id === authorId) {
      setFollowing(false);
      return;
    }

    try {
      const res = await fetch(`/users/${authorId}/following-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following || false);
      }
    } catch (err) {
      console.error("Error checking follow status:", err);
    }
  };

  const handleLike = async () => {
    if (!user || !token || !post) return;

    try {
      const res = await fetch(`/post/${slug}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setClapped(data.liked);
        const postRes = await fetch(`/post/${slug}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (postRes.ok) {
          const postData = await postRes.json();
          setPost(postData);
        }
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleFollow = async () => {
    if (!user || !token || !post) return;

    try {
      const res = await fetch(`/users/${post.author.id}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
      } else {
        const errorData = await res.json();
        if (errorData.error === "Cannot follow yourself") {
          alert("You cannot follow yourself!");
        }
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const handleComment = async () => {
    if (!user || !token || !post || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/post/${slug}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentText.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data.comment, ...prev]);
        setCommentText("");
        const postRes = await fetch(`/post/${slug}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (postRes.ok) {
          const postData = await postRes.json();
          setPost(postData);
        }
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to post comment");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
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
            href="/dashboard/explore"
            className="text-pink-900 hover:underline"
          >
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const authorName = post.author.name || post.author.username || "Anonymous";
  const authorInitials = authorName.charAt(0).toUpperCase();

  const formatContent = (content: string) => {
    if (!content) return "";
    
    if (content.includes("<") && content.includes(">")) {
      if (!content.includes("<p>") && !content.includes("<h")) {
        return `<div class="post-content">${content}</div>`;
      }
      return `<div class="post-content">${content}</div>`;
    }
    
    return content
      .split("\n\n")
      .map((para) => {
        if (!para.trim()) return "";
        if (para.trim().startsWith("# ")) {
          return `<h1 class="text-3xl font-bold my-4">${para.trim().substring(2)}</h1>`;
        }
        if (para.trim().startsWith("## ")) {
          return `<h2 class="text-2xl font-bold my-3">${para.trim().substring(3)}</h2>`;
        }
        if (para.trim().startsWith("### ")) {
          return `<h3 class="text-xl font-bold my-2">${para.trim().substring(4)}</h3>`;
        }
        if (para.trim().startsWith("> ")) {
          return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">${para.trim().substring(2)}</blockquote>`;
        }
        return `<p class="mb-4 leading-relaxed">${para.trim().replace(/\n/g, "<br />")}</p>`;
      })
      .join("");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/0 z-50">
        <div
          className="h-1 bg-pink-900 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {post.coverImage && (
        <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
            <img 
              src={post.coverImage} 
              className="w-full h-80 object-cover" 
              alt={post.title} 
            />
        </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-3">{post.title}</h1>

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
                <p className="text-sm font-medium text-black">
                  {authorName}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="inline w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString()} • {post.readTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user && (
              <button
                  onClick={handleLike}
                className={`px-3 py-1 rounded-md border ${clapped ? "bg-pink-900 text-white border-pink-900" : "bg-white text-black border-gray-200"} transition`}
              >
                  <Heart className={`inline w-4 h-4 mr-2 ${clapped ? "fill-current" : ""}`} /> {post._count.likes}
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
          <article className="lg:col-span-2 prose prose-lg max-w-none text-gray-800" ref={articleRef}>
            <div 
              className="prose prose-lg max-w-none post-content-wrapper"
              style={{
                lineHeight: "1.75",
                fontSize: "1.125rem",
              }}
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </article>

          <aside className="hidden lg:block">
            <div className="bg-white border rounded-xl p-6 shadow-sm sticky top-24">
              <h4 className="text-lg font-semibold mb-4">About the author</h4>
              <div className="flex items-center gap-3 mb-4">
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
                  <p className="font-medium text-black">{authorName}</p>
                  {post.author.bio && (
                    <p className="text-sm text-gray-600 mt-1">{post.author.bio}</p>
                  )}
                </div>
              </div>

              {user && !isAuthor && (
              <button
                onClick={handleFollow}
                className={`w-full py-2 rounded-full transition ${
                  following
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-pink-900 text-white hover:bg-pink-800"
                }`}
              >
                {following ? (
                  <>
                    <UserMinus className="inline w-4 h-4 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="inline w-4 h-4 mr-2" />
                    Follow
                  </>
                )}
              </button>
              )}
            </div>
          </aside>
        </div>

        <section className="max-w-5xl mx-auto mt-12">
          <h3 className="text-xl font-semibold mb-4">
            Responses {post._count.comments > 0 && `(${post._count.comments})`}
          </h3>

          {user && (
            <div className="bg-white border rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3 mb-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.username || "You"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-pink-900 flex items-center justify-center text-white font-semibold">
                    {(user.name || user.username || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-black mb-1">
                    {user.name || user.username || "You"}
                  </p>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full border rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-pink-900 focus:border-transparent"
                    rows={4}
                    placeholder="Write a response..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setCommentText("")}
                  className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition"
                  disabled={!commentText.trim() || submittingComment}
                >
                  Cancel
                </button>
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || submittingComment}
                  className="px-4 py-2 rounded-full bg-pink-900 text-white hover:bg-pink-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submittingComment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Respond
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {loadingComments ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-pink-900 mx-auto" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No responses yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment: any) => {
                const commentAuthorName = comment.author.name || comment.author.username || "Anonymous";
                const commentAuthorInitials = commentAuthorName.charAt(0).toUpperCase();
                
                return (
                  <div key={comment.id} className="bg-white border rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      {comment.author.avatarUrl ? (
                        <img
                          src={comment.author.avatarUrl}
                          alt={commentAuthorName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-pink-900 flex items-center justify-center text-white font-semibold">
                          {commentAuthorInitials}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-black">{commentAuthorName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-gray-700 mt-2 whitespace-pre-wrap">{comment.content}</p>
                      </div>
            </div>
          </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}