import { UserPlus, UserMinus } from "lucide-react";
import { Post } from "@/types";
import { getAuthorName, getAuthorInitials } from "@/lib/utils/content";

interface AuthorSidebarProps {
  post: Post;
  user: any;
  following: boolean;
  isAuthor: boolean;
  onFollow: () => void;
}

export default function AuthorSidebar({ post, user, following, isAuthor, onFollow }: AuthorSidebarProps) {
  const authorName = getAuthorName(post.author);
  const authorInitials = getAuthorInitials(authorName);

  return (
    <aside className="hidden lg:block">
      <div className="bg-white border rounded-xl p-6 shadow-sm sticky top-24">
        <h4 className="text-lg font-semibold mb-4">About the author</h4>
        <div className="flex items-center gap-3 mb-4">
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
            <p className="font-medium text-black">{authorName}</p>

          </div>
        </div>

        {user && !isAuthor && (
          <button
            onClick={onFollow}
            className={`w-full py-2 rounded-full transition ${
              following
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-pink-900 text-white hover:bg-pink-800"
            }`}
          >
            {following ? (
              <>
                <UserMinus className="inline w-4 h-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="inline w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}