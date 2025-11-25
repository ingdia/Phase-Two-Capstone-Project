"use client";

import { Author } from "@/types/glob";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface TrendingAuthorsProps {
  authors?: Author[];
  followed?: Record<string, boolean>;
  onFollow?: (id: string) => void;
  limit?: number; // Limit number of authors to display
}

const TrendingAuthors: React.FC<TrendingAuthorsProps> = ({
  authors: propAuthors,
  followed: propFollowed,
  onFollow: propOnFollow,
  limit = 3,
}) => {
  const { token, user } = useAuth();
  const [authors, setAuthors] = useState<Author[]>(propAuthors || []);
  const [followed, setFollowed] = useState<Record<string, boolean>>(propFollowed || {});
  const [loading, setLoading] = useState(!propAuthors);

  useEffect(() => {
    // If authors are not provided as props, fetch them
    if (!propAuthors) {
      fetchTrendingAuthors();
    } else {
      setAuthors(propAuthors.slice(0, limit));
    }
  }, [propAuthors, limit]);

  useEffect(() => {
    // If followed state is not provided, initialize it
    if (!propFollowed && user && authors.length > 0) {
      checkFollowingStatus();
    }
  }, [authors, user]);

  const fetchTrendingAuthors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/users/trending?limit=${limit}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setAuthors(data.authors || []);
      }
    } catch (err) {
      console.error("Error fetching trending authors:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowingStatus = async () => {
    if (!user || !token || authors.length === 0) return;

    const statuses: Record<string, boolean> = {};
    for (const author of authors) {
      if (author.id === user.id) {
        statuses[author.id] = false; // Can't follow yourself
        continue;
      }

      try {
        const res = await fetch(`/users/${author.id}/following-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          statuses[author.id] = data.following || false;
        }
      } catch (err) {
        console.error(`Error checking follow status for ${author.id}:`, err);
        statuses[author.id] = false;
      }
    }
    setFollowed(statuses);
  };

  const handleFollow = async (id: string) => {
    if (!user || !token) return;

    // Use prop handler if provided, otherwise use internal handler
    if (propOnFollow) {
      propOnFollow(id);
      return;
    }

    try {
      const res = await fetch(`/users/${id}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setFollowed((prev) => ({ ...prev, [id]: data.following }));
      } else {
        const errorData = await res.json();
        if (errorData.error === "Cannot follow yourself") {
          alert("You cannot follow yourself!");
        }
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  // Limit authors to specified number
  const displayedAuthors = authors.slice(0, limit);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h4 className="font-bold mb-5 text-lg">Recommended Authors</h4>
        <div className="text-center py-4 text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (displayedAuthors.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h4 className="font-bold mb-5 text-lg">Recommended Authors</h4>

      <div className="flex flex-col gap-4">
        {displayedAuthors.map((author) => (
          <div
            key={author.id}
            className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-xl transition"
          >
            <Link
              href={`/dashboard/author/${author.id}`}
              className="flex items-center gap-3 flex-1"
            >
              <img
                src={author.avatar}
                alt={author.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to default avatar if image fails to load
                  (e.target as HTMLImageElement).src = "/image/image.png";
                }}
              />
              <div>
                <p className="font-semibold text-sm">{author.name}</p>
                <p className="text-gray-500 text-xs">{author.followers}</p>
              </div>
            </Link>

            {user && user.id !== author.id && (
              <button
                onClick={() => handleFollow(author.id)}
                className={`text-sm font-semibold px-4 py-1.5 rounded-full transition ${
                  followed[author.id]
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-pink-900 text-white hover:bg-pink-800"
                }`}
              >
                {followed[author.id] ? "Following" : "Follow"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingAuthors;

