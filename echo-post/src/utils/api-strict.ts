import { ApiResponse, ApiError } from '@/types/strict';

export const createApiError = (message: string, code = 'API_ERROR', details?: Record<string, unknown>): ApiError => ({
  code,
  message,
  details,
});

export const apiRequest = async <T = unknown>(
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
        error: createApiError(
          data.error || `HTTP ${response.status}`,
          `HTTP_${response.status}`,
          { status: response.status, statusText: response.statusText }
        ),
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: createApiError(
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR',
        { originalError: error }
      ),
    };
  }
};

export const createAuthHeaders = (token: string): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
});