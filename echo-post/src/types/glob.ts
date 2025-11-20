export interface Post {
  id: string;
  title: string;
  excerpt: string;
  cover: string;
  author: string;
  readTime?: string;
  likes: number;
  time?: string;
}


export interface Category {
  name: string;
  color: string;
}


export interface Author {
  id: string;
  name: string;
  avatar: string;
  followers: string;
}

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
