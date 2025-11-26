import { useState, useCallback } from 'react';
import { LoadingState, ApiResponse, ApiError } from '@/types/strict';
import { apiRequest } from '@/utils/api-strict';

export function useApiStrict<T = unknown>() {
  const [state, setState] = useState<LoadingState<T>>({
    status: 'idle',
  });

  const execute = useCallback(async (
    url: string,
    options?: RequestInit,
    optimisticUpdate?: (prev: T | undefined) => T
  ): Promise<ApiResponse<T>> => {
    if (optimisticUpdate && state.status === 'success') {
      setState({ status: 'success', data: optimisticUpdate(state.data) });
    } else {
      setState({ status: 'loading' });
    }

    try {
      const result = await apiRequest<T>(url, options);
      
      if (result.success) {
        setState({ status: 'success', data: result.data });
      } else {
        setState({ status: 'error', error: result.error });
      }
      
      return result;
    } catch (err) {
      const error: ApiError = {
        code: 'UNKNOWN_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        details: { originalError: err }
      };
      
      setState({ status: 'error', error });
      return { success: false, error };
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  return {
    state,
    execute,
    reset,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    data: state.status === 'success' ? state.data : undefined,
    error: state.status === 'error' ? state.error : undefined,
  };
}