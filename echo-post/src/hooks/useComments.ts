"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export function useComments(postSlug: string) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['comments', postSlug],
    queryFn: async () => {
      const res = await fetch(`/post/${postSlug}/comments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!res.ok) throw new Error('Failed to fetch comments');
      return res.json();
    },
    enabled: !!postSlug,
  });
}

export function useCreateComment() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postSlug, content, parentId }: { postSlug: string; content: string; parentId?: string }) => {
      const res = await fetch(`/post/${postSlug}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, parentId }),
      });
      
      if (!res.ok) throw new Error('Failed to create comment');
      return res.json();
    },
    onSuccess: (_, { postSlug }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postSlug] });
      queryClient.invalidateQueries({ queryKey: ['post', postSlug] });
    },
  });
}