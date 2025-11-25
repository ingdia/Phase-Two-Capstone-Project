import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { Comment } from "@/types/post";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentsSectionProps {
  user: any;
  comments: Comment[];
  commentCount: number;
  isLoading: boolean;
  onComment: (content: string) => void;
  onReply: (content: string, parentId: string) => void;
  isSubmitting: boolean;
}

export default function CommentsSection({ 
  user, 
  comments, 
  commentCount, 
  isLoading, 
  onComment, 
  onReply, 
  isSubmitting 
}: CommentsSectionProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReply = (content: string) => {
    if (!replyingTo) return;
    onReply(content, replyingTo);
    setReplyingTo(null);
  };

  return (
    <section className="max-w-5xl mx-auto mt-12">
      <h3 className="text-xl font-semibold mb-4">
        Responses {commentCount > 0 && `(${commentCount})`}
      </h3>

      {user && (
        <div className="mb-6">
          <CommentForm
            user={user}
            onSubmit={onComment}
            isLoading={isSubmitting}
          />
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-pink-900 mx-auto" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No responses yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <CommentItem
                comment={comment}
                user={user}
                onReply={setReplyingTo}
              />
              
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 space-y-3">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      user={user}
                      isReply
                    />
                  ))}
                </div>
              )}
              
              {/* Reply Form */}
              {replyingTo === comment.id && user && (
                <div className="ml-12">
                  <CommentForm
                    user={user}
                    onSubmit={handleReply}
                    isLoading={isSubmitting}
                    placeholder="Write a reply..."
                    buttonText="Reply"
                    size="sm"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}