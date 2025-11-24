"use client";

import { TrendingUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const TrendingStories: React.FC = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingPosts();
  }, [token]);

  const fetchTrendingPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/post/trending?limit=4", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Error fetching trending posts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-900 to-black p-6 rounded-2xl shadow-lg text-white">
      <h4 className="font-bold mb-4 text-lg flex items-center gap-2">
        <TrendingUp className="w-5 h-5" /> Trending Now
      </h4>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-white/60">No trending posts yet</p>
      ) : (
        <ul className="flex flex-col gap-3 text-sm">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/dashboard/post/${post.slug}`}
              className="cursor-pointer hover:translate-x-1 transition flex items-start gap-2 group"
            >
              <span className="font-bold text-white/60">{`0${i + 1}`}</span>
              <span className="group-hover:underline line-clamp-2">{post.title}</span>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrendingStories;
