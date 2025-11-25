"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/hooks/usePosts";
import { usePostActions } from "@/hooks/usePostActions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import PostCard from "@/components/posts/PostCard";
import PostTabs from "@/components/posts/PostTabs";
import EmptyState from "@/components/posts/EmptyState";
import CommentModal from "@/components/modals/CommentModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { TabType } from "@/types";

export default function MyPostsPage() {
  const { user, token, initializing } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("DRAFTS");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const { data: draftsData, isLoading: draftsLoading, error: draftsError, refetch: refetchDrafts } = usePosts('DRAFT', user?.id);
  const { data: publishedData, isLoading: publishedLoading, error: publishedError, refetch: refetchPublished } = usePosts('PUBLISHED', user?.id);
  
  const {
    deletingPostId,
    likingPostId,
    submittingComment,
    likedPosts,
    handleEdit,
    handleDelete,
    handleLike,
    handleComment,
  } = usePostActions(token);

  const drafts = draftsData?.items || [];
  const published = publishedData?.items || [];
  const loading = draftsLoading || publishedLoading;
  const error = draftsError || publishedError;

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
      return;
    }
  }, [user, initializing, router]);

  const currentPosts = activeTab === "DRAFTS" ? drafts : published;

  const handleDeleteConfirm = (postId: string) => {
    const post = currentPosts.find(p => p.id === postId);
    if (post) {
      handleDelete(post.slug, postId, () => {
        if (activeTab === "DRAFTS") {
          refetchDrafts();
        } else {
          refetchPublished();
        }
        setShowDeleteConfirm(null);
      });
    }
  };

  const handleCommentSubmit = (postId: string) => {
    handleComment(postId, commentText[postId] || '', () => {
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      setShowCommentModal(null);
    });
  };

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
    return <EmptyState activeTab={activeTab} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 min-h-screen">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">
        My Posts
      </h1>

      <PostTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {currentPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={handleEdit}
            onDelete={(id) => setShowDeleteConfirm(id)}
            onLike={handleLike}
            onComment={(id) => {
              setShowCommentModal(id);
              if (!commentText[id]) {
                setCommentText(prev => ({ ...prev, [id]: '' }));
              }
            }}
            isDeleting={deletingPostId === post.id}
            isLiking={likingPostId === post.id}
            isLiked={likedPosts[post.id]}
          />
        ))}
      </div>

      <DeleteConfirmModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDeleteConfirm(showDeleteConfirm)}
        isDeleting={!!deletingPostId}
      />

      <CommentModal
        isOpen={!!showCommentModal}
        onClose={() => setShowCommentModal(null)}
        onSubmit={() => showCommentModal && handleCommentSubmit(showCommentModal)}
        commentText={showCommentModal ? commentText[showCommentModal] || '' : ''}
        onCommentChange={(text) => {
          if (showCommentModal) {
            setCommentText(prev => ({ ...prev, [showCommentModal]: text }));
          }
        }}
        isSubmitting={!!submittingComment}
      />
    </div>
  );
}