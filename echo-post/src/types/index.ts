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
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiResponse<T = unknown> = 
  | { success: true; data: T; error?: never }
  | { success: false; error: ApiError; data?: never };

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
export const POST_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;

export type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS];

export const TAB_TYPE = {
  DRAFTS: 'DRAFTS',
  PUBLISHED: 'PUBLISHED',
} as const;

export type TabType = typeof TAB_TYPE[keyof typeof TAB_TYPE];

// Loading States
export type LoadingState<T, E = ApiError> = 
  | { status: 'idle'; data?: never; error?: never }
  | { status: 'loading'; data?: never; error?: never }
  | { status: 'success'; data: T; error?: never }
  | { status: 'error'; data?: never; error: E };

// Hook Types
export interface UsePostsOptions {
  status?: PostStatus;
  authorId?: string;
  tag?: string;
  search?: string;
  limit?: number;
  page?: number;
}