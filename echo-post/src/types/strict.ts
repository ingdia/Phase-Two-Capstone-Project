// Base Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User extends BaseEntity {
  name: string | null;
  username: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
}

export interface Author {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
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

export interface Post extends BaseEntity {
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  status: PostStatus;
  author: Author;
  tags: Tag[];
  _count: PostCounts;
}

export interface PostsResponse {
  items: Post[];
  total: number;
  page: number;
  limit: number;
}

// Comment Types
export interface Comment extends BaseEntity {
  content: string;
  author: Author;
  postId: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ValidationError extends ApiError {
  field: string;
  value: unknown;
}

// API Response Types with Discriminated Unions
export type ApiResponse<T = unknown> = 
  | { success: true; data: T; error?: never }
  | { success: false; error: ApiError; data?: never };

// Loading States with Discriminated Unions
export type LoadingState<T, E = ApiError> = 
  | { status: 'idle'; data?: never; error?: never }
  | { status: 'loading'; data?: never; error?: never }
  | { status: 'success'; data: T; error?: never }
  | { status: 'error'; data?: never; error: E };

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

// Hook Types
export interface UsePostsOptions {
  status?: PostStatus;
  authorId?: string;
  tag?: string;
  search?: string;
  limit?: number;
  page?: number;
}

// Component Props Types
export interface PostCardProps {
  post: Post;
  onEdit: (slug: string) => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  isDeleting: boolean;
  isLiking: boolean;
  isLiked: boolean;
}

export interface PostTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export interface EmptyStateProps {
  activeTab: TabType;
}

// Modal Props Types
export interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  commentText: string;
  onCommentChange: (text: string) => void;
  isSubmitting: boolean;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
}

// Utility Types
export type NonEmptyArray<T> = [T, ...T[]];
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;