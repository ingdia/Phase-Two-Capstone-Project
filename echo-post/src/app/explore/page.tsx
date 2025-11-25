"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  readTime: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export default function PublicExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/post?status=PUBLISHED&limit=20");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExcerpt = (content: string, maxLength = 150) => {
    const text = content.replace(/<[^>]*>/g, "");
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Amazing Stories
          </h2>
          <p className="text-gray-600">
            Explore the latest posts from our community of writers
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts available</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.author.avatarUrl || "/image/image.png"}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {post.author.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{post.author.username}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {getExcerpt(post.content)}
                  </p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>❤️ {post._count.likes}</span>
                    <span>💬 {post._count.comments}</span>
                  </div>

                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-2 bg-pink-900 text-white rounded-lg hover:bg-pink-800 transition"
                  >
                    Sign in to Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 text-center bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h3>
          <p className="text-gray-600 mb-6">
            Sign up to read full articles, like posts, leave comments, and share your own stories
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3 bg-pink-900 text-white rounded-lg hover:bg-pink-800 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}