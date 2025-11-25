import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';
import { ApiResponse } from '@/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    url: string,
    options?: RequestInit,
    optimisticUpdate?: (prev: T | null) => T | null
  ): Promise<ApiResponse<T>> => {
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null,
      data: optimisticUpdate ? optimisticUpdate(prev.data) : prev.data
    }));

    try {
      const result = await apiRequest<T>(url, options);
      
      if (result.success) {
        setState({ data: result.data || null, loading: false, error: null });
      } else {
        setState(prev => ({ 
          data: optimisticUpdate ? prev.data : null, 
          loading: false, 
          error: result.error || 'Request failed' 
        }));
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Network error';
      setState(prev => ({ 
        data: optimisticUpdate ? prev.data : null, 
        loading: false, 
        error 
      }));
      return { success: false, error };
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}