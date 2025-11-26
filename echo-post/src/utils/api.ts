import { ApiResponse } from '@/types';

export const apiRequest = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: { code: 'HTTP_ERROR', message: data.error || `HTTP ${response.status}` },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: error instanceof Error ? error.message : 'Network error' },
    };
  }
};

export const createAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});