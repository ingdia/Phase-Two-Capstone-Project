import { Post } from '@/types';
import { apiRequest, createAuthHeaders } from './api';

export const deletePost = async (postSlug: string, token: string) => {
  return apiRequest(`/post/${postSlug}`, {
    method: 'DELETE',
    headers: createAuthHeaders(token),
  });
};

export const likePost = async (postId: string, token: string) => {
  return apiRequest(`/post/${postId}/like`, {
    method: 'POST',
    headers: createAuthHeaders(token),
  });
};

export const createComment = async (postId: string, content: string, token: string) => {
  return apiRequest(`/post/${postId}/comments`, {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: JSON.stringify({ content }),
  });
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};