"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export function useFollowStatus(authorId: string) {
  const { token, user } = useAuth();
  
  return useQuery({
    queryKey: ['followStatus', authorId],
    queryFn: async () => {
      const res = await fetch(`/users/${authorId}/following-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Failed to check follow status');
      return res.json();
    },
    enabled: !!token && !!authorId && user?.id !== authorId,
  });
}

export function useFollowUser() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (authorId: string) => {
      const res = await fetch(`/users/${authorId}/follow`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Failed to follow user');
      return res.json();
    },
    onSuccess: (_, authorId) => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', authorId] });
    },
  });
}