import { useState, useCallback } from 'react';
import { Post } from '@/types';
import { useApi } from './useApi';
import { createAuthHeaders } from '@/utils/api';

export function useOptimisticPosts(initialPosts: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const { execute } = useApi<any>();

  const optimisticLike = useCallback(async (postId: string, token: string) => {
    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            _count: { 
              likes: (post._count?.likes || 0) + 1,
              comments: post._count?.comments || 0
            } 
          }
        : post
    ));

    const result = await execute(`/post/${postId}/like`, {
      method: 'POST',
      headers: createAuthHeaders(token),
    });

    if (!result.success) {
      // Revert on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              _count: { 
                likes: Math.max((post._count?.likes || 1) - 1, 0),
                comments: post._count?.comments || 0
              } 
            }
          : post
      ));
    }

    return result;
  }, [execute]);

  const optimisticDelete = useCallback(async (postId: string, postSlug: string, token: string) => {
    // Store original for potential revert
    const originalPosts = posts;
    
    // Optimistic update
    setPosts(prev => prev.filter(post => post.id !== postId));

    const result = await execute(`/post/${postSlug}`, {
      method: 'DELETE',
      headers: createAuthHeaders(token),
    });

    if (!result.success) {
      // Revert on error
      setPosts(originalPosts);
    }

    return result;
  }, [execute, posts]);

  const optimisticComment = useCallback(async (postId: string, content: string, token: string) => {
    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            _count: { 
              likes: post._count?.likes || 0,
              comments: (post._count?.comments || 0) + 1
            } 
          }
        : post
    ));

    const result = await execute(`/post/${postId}/comments`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      body: JSON.stringify({ content }),
    });

    if (!result.success) {
      // Revert on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              _count: { 
                likes: post._count?.likes || 0,
                comments: Math.max((post._count?.comments || 1) - 1, 0)
              } 
            }
          : post
      ));
    }

    return result;
  }, [execute]);

  return {
    posts,
    setPosts,
    optimisticLike,
    optimisticDelete,
    optimisticComment,
  };
}