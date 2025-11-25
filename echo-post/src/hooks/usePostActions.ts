import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from './useApi';
import { createAuthHeaders } from '@/utils/api';

export const usePostActions = (token: string | null) => {
  const router = useRouter();
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const { execute } = useApi();

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/mypost/${slug}/edit`);
  };

  const handleDelete = async (postSlug: string, postId: string, onSuccess?: () => void) => {
    if (!token) return;

    setDeletingPostId(postId);
    
    const result = await execute(`/post/${postSlug}`, {
      method: 'DELETE',
      headers: createAuthHeaders(token),
    });

    if (result.success) {
      onSuccess?.();
    }
    
    setDeletingPostId(null);
    return result;
  };

  const handleLike = async (postId: string) => {
    if (!token || likingPostId) return;

    setLikingPostId(postId);
    const wasLiked = likedPosts[postId] || false;
    
    // Optimistic update
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));

    const result = await execute(`/post/${postId}/like`, {
      method: 'POST',
      headers: createAuthHeaders(token),
    });

    if (result.success) {
      setLikedPosts((prev) => ({ ...prev, [postId]: result.data.liked }));
    } else {
      // Revert on error
      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
    }
    
    setLikingPostId(null);
    return result;
  };

  const handleComment = async (postId: string, content: string, onSuccess?: () => void) => {
    if (!token || !content.trim() || submittingComment) return;

    setSubmittingComment(postId);
    
    const result = await execute(`/post/${postId}/comments`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      body: JSON.stringify({ content: content.trim() }),
    });

    if (result.success) {
      onSuccess?.();
    }
    
    setSubmittingComment(null);
    return result;
  };

  return {
    deletingPostId,
    likingPostId,
    submittingComment,
    likedPosts,
    handleEdit,
    handleDelete,
    handleLike,
    handleComment,
  };
};