import { Comment } from "@/types";
import { getAuthorName, getAuthorInitials } from "@/lib/utils/content";

interface CommentItemProps {
  comment: Comment;
  user: any;
  onReply?: (commentId: string) => void;
  isReply?: boolean;
}

export default function CommentItem({ comment, user, onReply, isReply = false }: CommentItemProps) {
  const authorName = getAuthorName(comment.author);
  const authorInitials = getAuthorInitials(authorName);
  
  const containerClass = isReply ? "bg-gray-50 border rounded-lg p-3" : "bg-white border rounded-xl p-4";
  const avatarSize = isReply ? "w-8 h-8" : "w-10 h-10";
  const textSize = isReply ? "text-sm" : "text-base";
  const nameSize = isReply ? "text-sm" : "font-medium";

  return (
    <div className={containerClass}>
      <div className="flex items-start gap-3">
        {comment.author.avatarUrl ? (
          <img
            src={comment.author.avatarUrl}
            alt={authorName}
            className={`${avatarSize} rounded-full object-cover`}
          />
        ) : (
          <div className={`${avatarSize} rounded-full bg-pink-900 flex items-center justify-center text-white font-semibold ${isReply ? 'text-xs' : ''}`}>
            {authorInitials}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <p className={`${nameSize} text-gray-900`}>{authorName}</p>
            <p className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p className={`text-gray-700 mt-2 whitespace-pre-wrap ${textSize}`}>{comment.content}</p>
          {user && onReply && !isReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="text-sm text-gray-700 hover:text-gray-900 hover:underline mt-2"
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}