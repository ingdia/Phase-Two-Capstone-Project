import { Clock } from "lucide-react";
import { Post } from "@/types/post";
import { getAuthorName, getAuthorInitials } from "@/lib/utils/content";
import PostActions from "./PostActions";

interface PostHeaderProps {
  post: Post;
  user: any;
  clapped: boolean;
  bookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
}

export default function PostHeader({ post, user, clapped, bookmarked, onLike, onBookmark }: PostHeaderProps) {
  const authorName = getAuthorName(post.author);
  const authorInitials = getAuthorInitials(authorName);

  return (
    <header className="mb-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag.slug}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {post.author.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt={authorName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-pink-900 rounded-full flex items-center justify-center text-white font-semibold">
              {authorInitials}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{authorName}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="inline w-3 h-3" />
              {new Date(post.createdAt).toLocaleDateString()} • {post.readTime}
            </p>
          </div>
        </div>

        <PostActions
          user={user}
          post={post}
          clapped={clapped}
          bookmarked={bookmarked}
          onLike={onLike}
          onBookmark={onBookmark}
        />
      </div>
    </header>
  );
}