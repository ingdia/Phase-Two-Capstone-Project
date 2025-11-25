import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function usePostStatusSync() {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    // Listen for route changes (e.g., returning from edit page)
    const handleRouteChange = () => {
      // Invalidate all post queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    };

    // Listen for browser navigation events
    const handlePopState = () => {
      handleRouteChange();
    };

    window.addEventListener('popstate', handlePopState);
    
    // Also invalidate when component mounts
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [queryClient]);

  // Function to manually sync after post updates
  const syncPostData = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    queryClient.invalidateQueries({ queryKey: ['posts', 'DRAFT'] });
    queryClient.invalidateQueries({ queryKey: ['posts', 'PUBLISHED'] });
  };

  return { syncPostData };
}