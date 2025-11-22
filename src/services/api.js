import axios from 'axios';
import Config from 'react-native-config';
import secureStorage from '../utils/secureStorage';

const API_BASE_URL = Config.API_BASE_URL || 'http://10.0.2.2:5001/api/security';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add token
api.interceptors.request.use(
  async config => {
    const tokens = await secureStorage.getTokens();
    if (tokens && tokens.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await secureStorage.getTokens();
        
        if (!tokens || !tokens.refreshToken) {
          throw new Error('No refresh token');
        }

        // Try to refresh the token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken: tokens.refreshToken }
        );

        const newAccessToken = response.data.token;
        
        // Store new token
        await secureStorage.setTokens(newAccessToken, tokens.refreshToken);
        
        // Update authorization header
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear tokens and redirect to login
        await secureStorage.clearAll();
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
