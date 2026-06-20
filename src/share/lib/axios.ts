
import axios from 'axios';
import { API_CONFIG } from '@/config/api';
import { HTTP_STATUS } from '@/share/types/http-status';

export const callAPI = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the access token in headers
callAPI.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (
  error: unknown,
  token?: string,
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });

  failedQueue = [];
};
callAPI.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers = {
                ...originalRequest.headers,
                authorization: `Bearer ${token}`,
              };

              resolve(
                callAPI(originalRequest),
              );
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('Refresh token not found');
        }

        // Use plain axios instance to avoid adding expired Authorization header
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`,
          {
            // backend expects snake_case field name
            refresh_token: refreshToken,
          },
        );

        const accessToken = response.data?.access_token || response.data?.data?.access_token;
        const newRefreshToken = response.data?.refresh_token || response.data?.data?.refresh_token;

        if (!accessToken || !newRefreshToken) {
          throw new Error('Invalid refresh response');
        }

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, accessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          authorization: `Bearer ${accessToken}`,
        };

        console.log('✓ Retrying original request:', originalRequest.url, {
          requestHeaders: originalRequest.headers,
          localStorageAccessToken: localStorage.getItem('accessToken'),
        });

        return callAPI(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        window.location.href = '/auth/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);