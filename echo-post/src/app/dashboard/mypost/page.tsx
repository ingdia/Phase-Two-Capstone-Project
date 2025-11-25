"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/hooks/usePosts";
import { usePostActions } from "@/hooks/usePostActions";
import { usePostStatusSync } from "@/hooks/usePostStatusSync";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { LazyPostCard, LazyCommentModal, LazyDeleteConfirmModal } from "@/components/lazy/LazyComponents";
import PostTabs from "@/components/posts/PostTabs";
import EmptyState from "@/components/posts/EmptyState";
import { TabType, Post, ApiError } from "@/types";

export default function MyPostsPage() {
  const { user, token, initializing } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { syncPostData } = usePostStatusSync();
  const [activeTab, setActiveTab] = useState<TabType>("DRAFTS");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const { 
    data: draftsData, 
    isLoading: draftsLoading, 
    error: draftsError, 
    refetch: refetchDrafts 
  } = usePosts('DRAFT', user?.id);
  
  const { 
    data: publishedData, 
    isLoading: publishedLoading, 
    error: publishedError, 
    refetch: refetchPublished 
  } = usePosts('PUBLISHED', user?.id);
  
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

  const drafts: Post[] = draftsData?.items || [];
  const published: Post[] = publishedData?.items || [];
  const loading: boolean = draftsLoading || publishedLoading;
  const error: ApiError | null = (draftsError || publishedError) as ApiError | null;

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
      return;
    }
  }, [user, initializing, router]);

  // Sync post data when returning from edit or other pages
  useEffect(() => {
    if (user && token) {
      syncPostData();
    }
  }, [user, token, syncPostData]);



  const currentPosts: Post[] = activeTab === "DRAFTS" ? drafts : published;

  const handleDeleteConfirm = useCallback((postId: string): void => {
    const post: Post | undefined = currentPosts.find(p => p.id === postId);
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
  }, [currentPosts, handleDelete, activeTab, refetchDrafts, refetchPublished]);

  const handleCommentSubmit = useCallback((postId: string): void => {
    handleComment(postId, commentText[postId] || '', () => {
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      setShowCommentModal(null);
    });
  }, [handleComment, commentText]);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    syncPostData();
  }, [syncPostData]);

  const handleDeleteClick = useCallback((id: string) => {
    setShowDeleteConfirm(id);
  }, []);

  const handleCommentClick = useCallback((id: string) => {
    setShowCommentModal(id);
    if (!commentText[id]) {
      setCommentText(prev => ({ ...prev, [id]: '' }));
    }
  }, [commentText]);

  const handleCommentChange = useCallback((text: string) => {
    if (showCommentModal) {
      setCommentText(prev => ({ ...prev, [showCommentModal]: text }));
    }
  }, [showCommentModal]);

  const handleCloseModals = useCallback(() => {
    setShowDeleteConfirm(null);
    setShowCommentModal(null);
  }, []);

  if (loading) {
    return (
      <LoadingState 
        size="lg" 
        text="Loading your posts..." 
        fullScreen 
      />
    );
  }

  if (error) {
    return (
      <ErrorState 
        message="Failed to load your posts. Please try again." 
        onRetry={() => {
          refetchDrafts();
          refetchPublished();
        }}
        fullScreen
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 min-h-screen">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">
          My Posts
        </h1>

        <PostTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />

        {currentPosts.length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {currentPosts.map((post) => (
              <ErrorBoundary key={post.id}>
                <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />}>
                  <LazyPostCard
                    post={post}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onLike={handleLike}
                    onComment={handleCommentClick}
                    isDeleting={deletingPostId === post.id}
                    isLiking={likingPostId === post.id}
                    isLiked={likedPosts[post.id]}
                  />
                </Suspense>
              </ErrorBoundary>
            ))}
          </div>
        )}

        <Suspense fallback={null}>
          <LazyDeleteConfirmModal
            isOpen={!!showDeleteConfirm}
            onClose={handleCloseModals}
            onConfirm={() => showDeleteConfirm && handleDeleteConfirm(showDeleteConfirm)}
            isDeleting={!!deletingPostId}
          />
        </Suspense>

        <Suspense fallback={null}>
          <LazyCommentModal
            isOpen={!!showCommentModal}
            onClose={handleCloseModals}
            onSubmit={() => showCommentModal && handleCommentSubmit(showCommentModal)}
            commentText={showCommentModal ? commentText[showCommentModal] || '' : ''}
            onCommentChange={handleCommentChange}
            isSubmitting={!!submittingComment}
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}