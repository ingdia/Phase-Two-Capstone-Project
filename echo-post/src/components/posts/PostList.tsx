import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import { Post } from '@/types';
import { formatExcerpt, calculateReadTime, getAuthorName } from '@/utils/formatters';

interface PostListProps {
  posts: Post[];
  linkPrefix?: string;
}

export default function PostList({ posts, linkPrefix = '/dashboard/post' }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No posts found.</p>
        <p className="text-sm">Try searching for something else or check back later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {posts.map((post) => {
        const excerpt = formatExcerpt(post.content || '');
        const readTime = calculateReadTime(post.content || '');
        const authorName = getAuthorName(post.author);

        return (
          <Link
            key={post.id}
            href={`${linkPrefix}/${post.slug}`}
            className="group flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg hover:shadow-lg transition cursor-pointer border border-gray-100"
          >
            {post.coverImage && (
              <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            )}

            <div className="flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  {post.author.avatarUrl ? (
                    <img
                      src={post.author.avatarUrl}
                      alt={authorName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{authorName}</span>
                  <span>•</span>
                  <span>{readTime}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.slug}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Heart size={14} /> {post._count?.likes || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} /> {post._count?.comments || 0}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}