"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePost, useLikePost } from "@/hooks/usePosts";
import { useComments, useCreateComment } from "@/hooks/useComments";
import { useFollowStatus, useFollowUser } from "@/hooks/useFollow";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { PostHeader, AuthorSidebar, CommentsSection } from "@/components/post";
import { Post } from "@/types";
import { formatContent, useScrollProgress } from "@/lib/utils";

export default function PostPage() {
  const params = useParams();
  const { user, token } = useAuth();
  const slug = params?.slug as string;

  const { data: post, isLoading: loading, error, refetch } = usePost(slug);
  const { data: commentsData, isLoading: loadingComments } = useComments(slug);
  const { data: followData } = useFollowStatus(post?.author?.id || '');
  const likeMutation = useLikePost();
  const followMutation = useFollowUser();
  const commentMutation = useCreateComment();
  
  const [clapped, setClapped] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  const comments = commentsData?.comments || [];
  const following = followData?.following || false;
  const articleRef = useRef<HTMLElement | null>(null);
  const progress = useScrollProgress(articleRef);

  useEffect(() => {
    if (user && post) {
      const userLiked = post.userLiked !== undefined 
        ? post.userLiked 
        : (post.likes && post.likes.some((like: any) => like.userId === user.id));
      setClapped(userLiked || false);
    }
  }, [user, post]);

  const handleLike = () => {
    if (!user || !token || !post) return;
    likeMutation.mutate(slug);
  };

  const handleBookmark = () => {
    setBookmarked(prev => !prev);
  };

  const handleFollow = () => {
    if (!user || !post) return;
    followMutation.mutate(post.author.id);
  };

  const handleComment = (content: string) => {
    if (!user || !post) return;
    commentMutation.mutate({ postSlug: slug, content });
  };

  const handleReply = (content: string, parentId: string) => {
    if (!user || !post) return;
    commentMutation.mutate({ postSlug: slug, content, parentId });
  };

  const isAuthor = user && post && user.id === post.author.id;

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading post..." />;
  }

  if (error || !post) {
    return (
      <ErrorMessage 
        message={error?.message || "Post not found"} 
        onRetry={() => refetch()}
      />
    );
  }



  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/0 z-50">
        <div
          className="h-1 bg-pink-900 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {post.coverImage && (
          <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
            <img 
              src={post.coverImage} 
              className="w-full h-80 object-cover" 
              alt={post.title} 
            />
          </div>
        )}

        <PostHeader
          post={post}
          user={user}
          clapped={clapped}
          bookmarked={bookmarked}
          onLike={handleLike}
          onBookmark={handleBookmark}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 prose prose-lg max-w-none text-gray-800" ref={articleRef}>
            <div 
              className="prose prose-lg max-w-none post-content-wrapper"
              style={{
                lineHeight: "1.75",
                fontSize: "1.125rem",
              }}
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </article>

          <AuthorSidebar
            post={post}
            user={user}
            following={following}
            isAuthor={isAuthor}
            onFollow={handleFollow}
          />
        </div>

        <CommentsSection
          user={user}
            comments={comments}
          commentCount={post._count.comments}
          isLoading={loadingComments}
          onComment={handleComment}
          onReply={handleReply}
          isSubmitting={commentMutation.isPending}
        />
      </main>
    </div>
  );
}