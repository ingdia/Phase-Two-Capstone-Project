import React from "react";
import { Bookmark, User, Heart, Clock } from "lucide-react";

const featuredPosts = [
  {
    title: "The Art of Writing Fiction",
    author: "Diane Ingire",
    cover: "/images/featured1.jpg",
    excerpt: "Learn the secrets to captivating storytelling...",
  },
  {
    title: "Digital Publishing Trends 2025",
    author: "John Doe",
    cover: "/images/featured2.jpg",
    excerpt: "Explore what’s next in the world of digital publishing...",
  },
];

const latestPosts = [
  {
    title: "Building Your Writing Routine",
    author: "Alice Smith",
    cover: "/images/post1.jpg",
    excerpt: "Consistency is key for writers. Here's a guide...",
    time: "5 min read",
  },
  {
    title: "Understanding Your Audience",
    author: "Mark Johnson",
    cover: "/images/post2.jpg",
    excerpt: "To write effectively, you need to know who you're writing for...",
    time: "7 min read",
  },
];

const trendingAuthors = [
  { name: "Diane Ingire", avatar: "/images/avatar1.jpg" },
  { name: "John Doe", avatar: "/images/avatar2.jpg" },
  { name: "Alice Smith", avatar: "/images/avatar3.jpg" },
];

const categories = [
  "Technology",
  "Books",
  "Lifestyle",
  "Self-development",
  "Travel",
];

export default function page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Readerly</h1>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Explore
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Sign In
            </a>
            <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">
              Write
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 max-w-7xl mx-auto px-6 flex gap-8">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-12">
          {/* Featured Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.map((post, i) => (
              <div
                key={i}
                className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition"
              >
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="text-sm mt-1">{post.excerpt}</p>
                  <p className="mt-2 text-xs">{post.author}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Latest Articles */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Latest Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestPosts.map((post, i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-white rounded-lg shadow hover:shadow-md transition p-4 cursor-pointer"
                >
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex flex-col justify-between">
                    <h4 className="font-semibold text-gray-900">{post.title}</h4>
                    <p className="text-gray-600 text-sm">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-gray-500 text-xs mt-2">
                      <User size={14} />
                      <span>{post.author}</span>
                      <Clock size={14} />
                      <span>{post.time}</span>
                      <Heart size={14} />
                      <Bookmark size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section>
            <h3 className="text-xl font-semibold mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <span
                  key={i}
                  className="bg-gray-200 px-3 py-1 rounded-full text-gray-700 text-sm cursor-pointer hover:bg-gray-300 transition"
                >
                  {cat}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-72 hidden lg:flex flex-col gap-6">
          {/* Trending Authors */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-gray-900 mb-3">Recommended Authors</h4>
            <div className="flex flex-col gap-3">
              {trendingAuthors.map((author, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-gray-800 font-medium">{author.name}</span>
                  </div>
                  <button className="text-sm text-blue-500 font-medium hover:underline">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Stories (Optional) */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-gray-900 mb-3">Trending Stories</h4>
            <ul className="flex flex-col gap-2 text-gray-700 text-sm">
              <li className="cursor-pointer hover:text-gray-900">Top 10 Writing Tips</li>
              <li className="cursor-pointer hover:text-gray-900">Digital Publishing Trends</li>
              <li className="cursor-pointer hover:text-gray-900">How to Build Your Brand</li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Footer */}

    </div>
  );
}
