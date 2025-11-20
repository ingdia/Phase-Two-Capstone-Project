"use client";

import { Author } from "@/types/glob";

interface TrendingAuthorsProps {
  authors: Author[];
  followed: Record<string, boolean>;
  onFollow: (id: string) => void;
}

const TrendingAuthors: React.FC<TrendingAuthorsProps> = ({
  authors,
  followed,
  onFollow,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h4 className="font-bold mb-5 text-lg">Recommended Authors</h4>

      <div className="flex flex-col gap-4">
        {authors.map((author) => (
          <div
            key={author.id}
            className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-xl transition"
          >
            <div className="flex items-center gap-3">
              <img src={author.avatar} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold text-sm">{author.name}</p>
                <p className="text-gray-500 text-xs">{author.followers}</p>
              </div>
            </div>

            <button
              onClick={() => onFollow(author.id)}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
                followed[author.id]
                  ? "bg-gray-200 text-gray-700"
                  : "bg-pink-900 text-white"
              }`}
            >
              {followed[author.id] ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingAuthors;
