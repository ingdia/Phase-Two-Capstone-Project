import { Heart, Bookmark, Share2 } from "lucide-react";
import { Post } from "@/types";

interface PostActionsProps {
  user: any;
  post: Post;
  clapped: boolean;
  bookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
}

export default function PostActions({ user, post, clapped, bookmarked, onLike, onBookmark }: PostActionsProps) {
  return (
    <div className="flex items-center gap-3">
      {user && (
        <button
          onClick={onLike}
          className={`px-3 py-1 rounded-md border ${
            clapped ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-200"
          } transition`}
        >
          <Heart className={`inline w-4 h-4 mr-2 ${clapped ? "fill-current" : ""}`} /> {post._count?.likes || 0}
        </button>
      )}

      <button
        onClick={onBookmark}
        className={`px-3 py-1 rounded-md border ${
          bookmarked ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-200"
        } transition`}
      >
        <Bookmark className="inline w-4 h-4 mr-2" /> {bookmarked ? "Saved" : "Save"}
      </button>

      <button className="px-3 py-1 rounded-md border bg-white text-gray-900 border-gray-200 hover:bg-gray-50 transition">
        <Share2 className="inline w-4 h-4 mr-2" /> Share
      </button>
    </div>
  );
}