import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { getAuthorName, getAuthorInitials } from "@/lib/utils/content";

interface CommentFormProps {
  user: any;
  onSubmit: (content: string) => void;
  isLoading: boolean;
  placeholder?: string;
  buttonText?: string;
  size?: "sm" | "md";
}

export default function CommentForm({ 
  user, 
  onSubmit, 
  isLoading, 
  placeholder = "Write a response...",
  buttonText = "Respond",
  size = "md"
}: CommentFormProps) {
  const [text, setText] = useState("");
  const authorName = getAuthorName(user);
  const authorInitials = getAuthorInitials(authorName);
  
  const avatarSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-start gap-3 mb-3">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={authorName}
            className={`${avatarSize} rounded-full object-cover`}
          />
        ) : (
          <div className={`${avatarSize} rounded-full bg-pink-900 flex items-center justify-center text-white font-semibold ${textSize}`}>
            {authorInitials}
          </div>
        )}
        <div className="flex-1">
          <p className={`${textSize} font-medium text-gray-900 mb-1`}>{authorName}</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
            rows={size === "sm" ? 3 : 4}
            placeholder={placeholder}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setText("")}
          className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition"
          disabled={!text.trim() || isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className="px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {buttonText === "Respond" ? "Posting..." : "Replying..."}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </button>
      </div>
    </div>
  );
}