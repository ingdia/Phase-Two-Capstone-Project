"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
  tags: Array<{ name: string; slug: string }>;
  _count: {
    likes: number;
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export function usePosts(status?: 'DRAFT' | 'PUBLISHED', author?: string) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['posts', status, author],
    queryFn: async (): Promise<{ items: Post[] }> => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (author) params.append('author', author);
      
      const res = await fetch(`/post?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
    enabled: !!token,
  });
}

export function usePost(slug: string) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async (): Promise<Post> => {
      const res = await fetch(`/post/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!res.ok) throw new Error('Failed to fetch post');
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useCreatePost() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postData: any) => {
      const res = await fetch('/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      
      if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useLikePost() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/post/${slug}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Failed to like post');
      return res.json();
    },
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ['post', slug] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}