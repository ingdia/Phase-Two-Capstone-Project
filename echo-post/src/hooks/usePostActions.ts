import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deletePost, likePost, createComment } from '@/utils/posts';

export const usePostActions = (token: string | null) => {
  const router = useRouter();
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/mypost/${slug}/edit`);
  };

  const handleDelete = async (postSlug: string, postId: string, onSuccess?: () => void) => {
    if (!token) return;

    setDeletingPostId(postId);
    try {
      const result = await deletePost(postSlug, token);
      if (result.success) {
        onSuccess?.();
        alert('Post deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleLike = async (postId: string) => {
    if (!token || likingPostId) return;

    setLikingPostId(postId);
    const wasLiked = likedPosts[postId] || false;
    
    // Optimistic update
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));

    try {
      const result = await likePost(postId, token);
      if (result.success) {
        setLikedPosts((prev) => ({ ...prev, [postId]: result.data.liked }));
      } else {
        // Revert on error
        setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
        alert(result.error || 'Failed to like post');
      }
    } catch (err) {
      console.error('Error liking post:', err);
      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
      alert('Failed to like post. Please try again.');
    } finally {
      setLikingPostId(null);
    }
  };

  const handleComment = async (postId: string, content: string, onSuccess?: () => void) => {
    if (!token || !content.trim() || submittingComment) return;

    setSubmittingComment(postId);
    try {
      const result = await createComment(postId, content.trim(), token);
      if (result.success) {
        onSuccess?.();
        alert('Comment posted successfully!');
      } else {
        alert(result.error || 'Failed to post comment');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(null);
    }
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