import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { apiRequest, createAuthHeaders } from '@/utils/api';

export function useUpdatePost() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: any }) => {
      if (!token) throw new Error('No token');
      
      return apiRequest(`/post/${slug}`, {
        method: 'PUT',
        headers: createAuthHeaders(token),
        body: JSON.stringify(data),
      });
    },
    onSuccess: (result, { slug, data }) => {
      // Invalidate all post-related queries when status changes
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'DRAFT'] });
        queryClient.invalidateQueries({ queryKey: ['posts', 'PUBLISHED'] });
      }
      
      // Invalidate specific post
      queryClient.invalidateQueries({ queryKey: ['post', slug] });
    },
  });
}

export function useDeletePost() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (slug: string) => {
      if (!token) throw new Error('No token');
      
      return apiRequest(`/post/${slug}`, {
        method: 'DELETE',
        headers: createAuthHeaders(token),
      });
    },
    onSuccess: () => {
      // Invalidate all post queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useLikePost() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      if (!token) throw new Error('No token');
      
      return apiRequest(`/post/${postId}/like`, {
        method: 'POST',
        headers: createAuthHeaders(token),
      });
    },
    onSuccess: (result, postId) => {
      // Invalidate all post queries to update like counts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
}