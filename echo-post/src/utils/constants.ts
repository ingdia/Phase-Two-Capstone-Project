// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  POSTS: {
    BASE: '/post',
    BY_SLUG: (slug: string) => `/post/slug/${slug}`,
    BY_ID: (id: string) => `/post/${id}`,
    LIKE: (id: string) => `/post/${id}/like`,
    COMMENTS: (id: string) => `/post/${id}/comments`,
    FEATURED: '/post/featured',
    TRENDING: '/post/trending',
  },
  USERS: {
    TRENDING: '/users/trending',
    FOLLOW: (id: string) => `/users/${id}/follow`,
    FOLLOWING_STATUS: (id: string) => `/users/${id}/following-status`,
    FOLLOWERS: (id: string) => `/users/${id}/followers`,
    FOLLOWING: (id: string) => `/users/${id}/following`,
  },
  TAGS: {
    BASE: '/tags',
  },
} as const;

// UI Constants
export const POST_STATUSES = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;

export const TAB_TYPES = {
  DRAFTS: 'DRAFTS',
  PUBLISHED: 'PUBLISHED',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;