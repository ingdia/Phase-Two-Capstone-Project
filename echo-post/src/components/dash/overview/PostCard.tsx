"use client"
import React, { useState } from "react";
import { Bookmark, User, Heart, Clock, TrendingUp, Sparkles, BookOpen } from "lucide-react";




function PostCard() {

      const [bookmarkedPosts, setBookmarkedPosts] = useState(
        latestPosts.reduce((acc, post, i) => ({ ...acc, [i]: post.bookmarked }), {})
      );
      const [likedPosts, setLikedPosts] = useState({});
      const [followedAuthors, setFollowedAuthors] = useState({});
    
      const toggleBookmark = (index) => {
        setBookmarkedPosts(prev => ({ ...prev, [index]: !prev[index] }));
      };
    
      const toggleLike = (index) => {
        setLikedPosts(prev => ({ ...prev, [index]: !prev[index] }));
      };
    
      const toggleFollow = (index) => {
        setFollowedAuthors(prev => ({ ...prev, [index]: !prev[index] }));
      };
  return (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-pink-900" />
                <h3 className="text-2xl font-bold text-gray-900">Latest Articles</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestPosts.map((post, i) => (
                  <div
                    key={i}
                    className="  hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <User size={14} />
                          <span className="font-medium">{post.author}</span>
                          <span className="text-gray-300">•</span>
                          <Clock size={14} />
                          <span>{post.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(i);
                            }}
                            className={`transition-colors ${
                              likedPosts[i] ? 'text-pink-900' : 'text-gray-400 hover:text-pink-900'
                            }`}
                          >
                            <Heart size={18} fill={likedPosts[i] ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(i);
                            }}
                            className={`transition-colors ${
                              bookmarkedPosts[i] ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
                            }`}
                          >
                            <Bookmark size={18} fill={bookmarkedPosts[i] ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
  )
}

export default PostCard
