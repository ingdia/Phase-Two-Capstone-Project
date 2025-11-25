import React, { useCallback } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Calendar, Trash2, Edit, Loader2 } from 'lucide-react';
import { Post } from '@/types';
import { formatDate } from '@/utils/posts';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface PostCardProps {
  post: Post;
  onEdit: (slug: string) => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  isDeleting?: boolean;
  isLiking?: boolean;
  isLiked?: boolean;
}

const PostCard = React.memo(function PostCard({
  post,
  onEdit,
  onDelete,
  onLike,
  onComment,
  isDeleting,
  isLiking,
  isLiked,
}: PostCardProps) {
  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(post.slug);
  }, [onEdit, post.slug]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(post.id);
  }, [onDelete, post.id]);

  const handleLikeClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike(post.id);
  }, [onLike, post.id]);

  const handleCommentClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onComment(post.id);
  }, [onComment, post.id]);
  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 sm:p-6 border border-gray-100">
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button
          onClick={handleEditClick}
          className="bg-gray-900 text-white p-2.5 rounded-lg hover:bg-gray-800 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center group/btn"
          title="Edit post"
        >
          <Edit size={18} className="group-hover/btn:scale-110 transition-transform" />
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="bg-red-600 text-white p-2.5 rounded-lg hover:bg-red-700 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50"
          title="Delete post"
        >
          {isDeleting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>

      <Link href={`/dashboard/overview/${post.slug}`} className="block">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-4 rounded-xl overflow-hidden">
            <OptimizedImage
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={192}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition line-clamp-2">
            {post.title}
          </h3>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.slug}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDate(post.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLikeClick}
                disabled={isLiking}
                className={`flex items-center gap-1 transition ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                <span>{post._count?.likes || 0}</span>
              </button>
              <button
                onClick={handleCommentClick}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition"
              >
                <MessageCircle size={16} />
                <span>{post._count?.comments || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default PostCard;