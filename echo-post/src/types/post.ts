export interface Author {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  readTime: string;
  author: Author;
  tags: Tag[];
  likeCount: number;
  userLiked?: boolean;
  likes?: Array<{ userId: string }>;
  _count: {
    comments: number;
    likes: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  replies?: Comment[];
}

export interface CommentsData {
  comments: Comment[];
}