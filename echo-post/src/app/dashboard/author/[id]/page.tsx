"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl: string;
  createdAt: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    createdAt: string;
    _count: {
      likes: number;
      comments: number;
    };
  }>;
}

export default function AuthorProfilePage() {
  const params = useParams();
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const authorId = params.id as string;

  useEffect(() => {
    if (authorId) {
      fetchProfile();
      if (user && token && authorId !== user.id) {
        checkFollowingStatus();
      }
    }
  }, [authorId, user, token]);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile for ID:", authorId);
      const res = await fetch(`/users/${authorId}`);
      console.log("Response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Profile data:", data);
        setProfile(data.user);
      } else {
        const errorData = await res.json();
        console.error("API Error:", errorData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowingStatus = async () => {
    try {
      const res = await fetch(`/users/${authorId}/following-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollow = async () => {
    if (!token || !user) return;
    
    setFollowLoading(true);
    try {
      const res = await fetch(`/users/${authorId}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
        if (profile) {
          setProfile({
            ...profile,
            followersCount: profile.followersCount + (data.following ? 1 : -1)
          });
        }
      }
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">Author not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-start gap-6">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-24 h-24 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/image/image.png";
            }}
          />
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
            <p className="text-gray-600 mb-2">@{profile.username}</p>
            {profile.bio && (
              <p className="text-gray-700 mb-4">{profile.bio}</p>
            )}
            
            <div className="flex gap-6 text-sm text-gray-600 mb-4">
              <span><strong>{profile.postsCount}</strong> Posts</span>
              <span><strong>{profile.followersCount}</strong> Followers</span>
              <span><strong>{profile.followingCount}</strong> Following</span>
            </div>

            {user && user.id !== profile.id && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  following
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-pink-900 text-white hover:bg-pink-800"
                } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {followLoading ? "..." : following ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        
        {profile.posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No posts yet</p>
        ) : (
          <div className="space-y-6">
            {profile.posts.map((post) => (
              <div key={post.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <Link 
                  href={`/dashboard/post/${post.slug}`}
                  className="block hover:bg-gray-50 p-4 rounded-lg transition"
                >
                  <h3 className="text-xl font-semibold mb-2 hover:text-pink-900">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>{post._count.likes} likes</span>
                    <span>{post._count.comments} comments</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}