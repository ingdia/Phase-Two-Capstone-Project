import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiStrict } from './useApiStrict';
import { createAuthHeaders } from '@/utils/api-strict';
import { ApiResponse } from '@/types/strict';

interface PostActionState {
  deletingPostId: string | null;
  likingPostId: string | null;
  submittingComment: string | null;
  likedPosts: Record<string, boolean>;
}

interface PostActionHandlers {
  handleEdit: (slug: string) => void;
  handleDelete: (postSlug: string, postId: string, onSuccess?: () => void) => Promise<ApiResponse<unknown>>;
  handleLike: (postId: string) => Promise<ApiResponse<unknown>>;
  handleComment: (postId: string, content: string, onSuccess?: () => void) => Promise<ApiResponse<unknown>>;
}

export const usePostActionsStrict = (token: string | null): PostActionState & PostActionHandlers => {
  const router = useRouter();
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const { execute } = useApiStrict();

  const handleEdit = (slug: string): void => {
    router.push(`/dashboard/mypost/${slug}/edit`);
  };

  const handleDelete = async (
    postSlug: string, 
    postId: string, 
    onSuccess?: () => void
  ): Promise<ApiResponse<unknown>> => {
    if (!token) {
      return {
        success: false,
        error: { code: 'NO_TOKEN', message: 'Authentication required' }
      };
    }

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

  const handleLike = async (postId: string): Promise<ApiResponse<unknown>> => {
    if (!token || likingPostId) {
      return {
        success: false,
        error: { code: 'INVALID_STATE', message: 'Cannot like post at this time' }
      };
    }

    setLikingPostId(postId);
    const wasLiked = likedPosts[postId] || false;
    
    // Optimistic update
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));

    const result = await execute(`/post/${postId}/like`, {
      method: 'POST',
      headers: createAuthHeaders(token),
    });

    if (result.success) {
      const data = result.data as { liked: boolean };
      setLikedPosts((prev) => ({ ...prev, [postId]: data.liked }));
    } else {
      // Revert on error
      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
    }
    
    setLikingPostId(null);
    return result;
  };

  const handleComment = async (
    postId: string, 
    content: string, 
    onSuccess?: () => void
  ): Promise<ApiResponse<unknown>> => {
    if (!token || !content.trim() || submittingComment) {
      return {
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Invalid comment data' }
      };
    }

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