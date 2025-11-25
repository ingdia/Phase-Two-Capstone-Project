"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Calendar, Trash2, Edit, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/hooks/usePosts";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

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

  const { data: draftsData, isLoading: draftsLoading, error: draftsError, refetch: refetchDrafts } = usePosts('DRAFT', user?.id);
  const { data: publishedData, isLoading: publishedLoading, error: publishedError, refetch: refetchPublished } = usePosts('PUBLISHED', user?.id);
  
  const drafts = draftsData?.items || [];
  const published = publishedData?.items || [];
  const loading = draftsLoading || publishedLoading;
  const error = draftsError || publishedError;
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);

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

      // Check which posts the user has liked
      const allPosts = [...(draftData.items || []), ...(pubData.items || [])];
      const likedStatus: Record<string, boolean> = {};
      
      // Fetch like status for each post in parallel for better performance
      const likeStatusPromises = allPosts.map(async (post) => {
        try {
          const postRes = await fetch(`/post/${post.slug}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (postRes.ok) {
            const postData = await postRes.json();
            return { postId: post.id, liked: postData.userLiked || false };
          }
        } catch (err) {
          console.error(`Error checking like status for post ${post.id}:`, err);
        }
        return { postId: post.id, liked: false };
      });
      
      const likeStatuses = await Promise.all(likeStatusPromises);
      likeStatuses.forEach(({ postId, liked }) => {
        likedStatus[postId] = liked;
      });
      
      setLikedPosts(likedStatus);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentPosts = activeTab === "DRAFTS" ? drafts : published;

  const handleDelete = async (postId: string, postSlug: string) => {
    if (!token || !user) return;

    setDeletingPostId(postId);
    try {
      const res = await fetch(`/post/${postSlug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Remove post from state
        if (activeTab === "DRAFTS") {
          setDrafts((prev) => prev.filter((p) => p.id !== postId));
        } else {
          setPublished((prev) => prev.filter((p) => p.id !== postId));
        }
        alert("Post deleted successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeletingPostId(null);
      setShowDeleteConfirm(null);
    }
  };

  const handleEditClick = (e: React.MouseEvent, postSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/mypost/${postSlug}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(postId);
  };

  const handleLikeClick = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token || !user || likingPostId) return;

    setLikingPostId(postId);
    const wasLiked = likedPosts[postId] || false;
    
    // Optimistic update
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));

    try {
      const res = await fetch(`/post/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLikedPosts((prev) => ({ ...prev, [postId]: data.liked }));
        // Refresh posts to update like counts
        fetchPosts();
      } else {
        // Revert on error
        setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
        const errorData = await res.json();
        alert(errorData.error || "Failed to like post");
      }
    } catch (err) {
      console.error("Error liking post:", err);
      // Revert on error
      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
      alert("Failed to like post. Please try again.");
    } finally {
      setLikingPostId(null);
    }
  };

  const handleCommentClick = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCommentModal(postId);
    if (!commentText[postId]) {
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const handleSubmitComment = async (postId: string) => {
    if (!token || !user || !commentText[postId]?.trim() || submittingComment) return;

    setSubmittingComment(postId);
    try {
      const res = await fetch(`/post/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentText[postId].trim() }),
      });

      if (res.ok) {
        setCommentText((prev) => ({ ...prev, [postId]: "" }));
        setShowCommentModal(null);
        // Refresh posts to update comment counts
        fetchPosts();
        alert("Comment posted successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to post comment");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(null);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 min-h-screen">
        <LoadingSpinner size="lg" text="Loading your posts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 min-h-screen">
        <ErrorMessage 
          message="Failed to load your posts. Please try again." 
          onRetry={() => {
            refetchDrafts();
            refetchPublished();
          }}
        />
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 min-h-screen">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">
        My Posts
      </h1>


      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`mr-6 pb-2 font-semibold text-lg ${
            activeTab === "DRAFTS"
              ? "text-gray-900 border-b-4 border-gray-900"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("DRAFTS")}
        >
          Drafts
        </button>

        <button
          className={`pb-2 font-semibold text-lg ${
            activeTab === "PUBLISHED"
              ? "text-gray-900 border-b-4 border-gray-900"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("PUBLISHED")}
        >
          Published
        </button>
      </div>

      {/* POSTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 sm:p-6 border border-gray-100"
          >
            {/* Action Buttons - Always visible with better UI */}
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <button
                onClick={(e) => handleEditClick(e, post.slug)}
                className="bg-gray-900 text-white p-2.5 rounded-lg hover:bg-gray-800 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center group/btn"
                title="Edit post"
              >
                <Edit size={18} className="group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, post.id)}
                disabled={deletingPostId === post.id}
                className=" text-red-600 p-2.5 rounded-lg  active:scale-95 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete post"
              >
                {deletingPostId === post.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                )}
              </button>
            </div>

            {/* Clickable area for viewing post */}
            <Link
              href={`/dashboard/mypost/${post.slug}`}
              className="block"
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
                  <p className="text-sm font-medium text-gray-900">
                    {post.author?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 group-hover:text-gray-700 transition">
                {post.title}
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              {/* Stats and Actions */}
              <div className="flex justify-between items-center text-xs text-gray-600 mt-4">
                <div className="flex gap-4">
                  <button
                    onClick={(e) => handleLikeClick(e, post.id)}
                    disabled={likingPostId === post.id}
                    className={`flex items-center gap-1 transition-colors ${
                      likedPosts[post.id]
                        ? "text-gray-900 hover:text-gray-700"
                        : "text-gray-600 hover:text-gray-900"
                    } disabled:opacity-50`}
                    title="Like this post"
                  >
                    <Heart
                      size={14}
                      fill={likedPosts[post.id] ? "currentColor" : "none"}
                      className={likingPostId === post.id ? "animate-pulse" : ""}
                    />
                    {post._count?.likes || 0}
                  </button>
                  <button
                    onClick={(e) => handleCommentClick(e, post.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Comment on this post"
                  >
                    <MessageCircle size={14} />
                    {post._count?.comments || 0}
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Delete Post?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                disabled={deletingPostId !== null}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const post = currentPosts.find((p) => p.id === showDeleteConfirm);
                  if (post) {
                    handleDelete(showDeleteConfirm, post.slug);
                  }
                }}
                disabled={deletingPostId !== null}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {deletingPostId === showDeleteConfirm ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCommentModal(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Add a Comment</h3>
            <textarea
              value={commentText[showCommentModal] || ""}
              onChange={(e) =>
                setCommentText((prev) => ({ ...prev, [showCommentModal]: e.target.value }))
              }
              className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-pink-900 focus:border-transparent mb-4 text-gray-900 bg-white placeholder-gray-500"
              rows={4}
              placeholder="Write your comment..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCommentModal(null);
                  setCommentText((prev) => ({ ...prev, [showCommentModal]: "" }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                disabled={submittingComment !== null}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitComment(showCommentModal)}
                disabled={!commentText[showCommentModal]?.trim() || submittingComment !== null}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {submittingComment === showCommentModal ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting...
                  </span>
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
