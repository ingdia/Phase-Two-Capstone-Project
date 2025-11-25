// User Types
export interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl?: string | null;
}

// Post Types
export interface Tag {
  name: string;
  slug: string;
}

export interface PostCounts {
  comments: number;
  likes: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  coverImage?: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
  author: Author;
  tags: Tag[];
  _count?: PostCounts;
}

export interface PostsResponse {
  items: Post[];
  total: number;
  page: number;
  limit: number;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  postId: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// UI State Types
export type PostStatus = 'DRAFT' | 'PUBLISHED';
export type TabType = 'DRAFTS' | 'PUBLISHED';

// Hook Types
export interface UsePostsOptions {
  status?: PostStatus;
  authorId?: string;
  tag?: string;
  search?: string;
  limit?: number;
  page?: number;
}