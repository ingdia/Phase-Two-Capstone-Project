import { lazy } from 'react';

// Lazy load heavy components
export const LazyCommentModal = lazy(() => import('@/components/modals/CommentModal'));
export const LazyDeleteConfirmModal = lazy(() => import('@/components/modals/DeleteConfirmModal'));
export const LazyPostCard = lazy(() => import('@/components/posts/PostCard'));