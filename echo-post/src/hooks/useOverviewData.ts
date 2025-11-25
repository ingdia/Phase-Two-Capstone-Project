import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { createAuthHeaders } from '@/utils/api';
import { formatExcerpt, getTimeAgo, getAuthorName } from '@/utils/formatters';

type Category = {
  name: string;
  color: string;
};

export function useOverviewData(token: string | null) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { execute } = useApi();

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const fetchAllData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const headers = createAuthHeaders(token);

      // Fetch all data in parallel using the API utility
      const [tagsResult, featuredResult, latestResult] = await Promise.all([
        execute('/tags', { headers }),
        execute('/post/featured?limit=2', { headers }),
        execute('/post?status=PUBLISHED&limit=4', { headers }),
      ]);

      // Process tags into categories
      if (tagsResult.success && tagsResult.data) {
        const colors = [
          "bg-pink-900 text-white",
          "bg-gray-800 text-white", 
          "bg-black text-white",
          "bg-gray-200 text-black",
          "bg-blue-900 text-white",
          "bg-purple-900 text-white",
        ];
        const categoriesData: Category[] = (tagsResult.data.tags || []).slice(0, 6).map(
          (tag: any, index: number) => ({
            name: tag.name,
            color: colors[index % colors.length],
          })
        );
        setCategories(categoriesData);
      }

      // Process featured posts
      if (featuredResult.success && featuredResult.data) {
        const formattedFeatured = (featuredResult.data.posts || []).map((post: any) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: formatExcerpt(post.content),
          cover: post.coverImage || "/image/image.png",
          author: getAuthorName(post.author),
          readTime: post.readTime || "5 min read",
          likes: post._count?.likes || 0,
        }));
        setFeaturedPosts(formattedFeatured);
      }

      // Process latest posts
      if (latestResult.success && latestResult.data) {
        const formattedLatest = (latestResult.data.items || []).map((post: any) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: formatExcerpt(post.content, 100),
          cover: post.coverImage || "/image/image.png",
          author: getAuthorName(post.author),
          time: getTimeAgo(new Date(post.createdAt)),
          likes: post._count?.likes || 0,
        }));
        setLatestPosts(formattedLatest);
      }

      // Check for any errors
      const hasError = !tagsResult.success || !featuredResult.success || !latestResult.success;
      if (hasError) {
        setError('Failed to load some data');
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const optimisticLike = async (id: string) => {
    if (!token) return;
    
    // Optimistic update for latest posts
    setLatestPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));

    // Optimistic update for featured posts
    setFeaturedPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));

    const result = await execute(`/post/${id}/like`, {
      method: 'POST',
      headers: createAuthHeaders(token),
    });

    if (!result.success) {
      // Revert on error
      setLatestPosts(prev => prev.map(post => 
        post.id === id 
          ? { ...post, likes: Math.max(post.likes - 1, 0) }
          : post
      ));
      setFeaturedPosts(prev => prev.map(post => 
        post.id === id 
          ? { ...post, likes: Math.max(post.likes - 1, 0) }
          : post
      ));
    }

    return result;
  };

  return {
    categories,
    featuredPosts,
    latestPosts,
    loading,
    error,
    refetch: fetchAllData,
    optimisticLike,
  };
}