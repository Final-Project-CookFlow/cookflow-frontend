/**
 * api.js
 *
 * Axios instance configured with baseURL from environment.
 *
 * - Uses the VITE_API_URL environment variable (or an empty string by default).
 * - Serves as the centralized instance for all HTTP requests in the app.
 *
 * Example usage:
 * import api from './api';
 * api.get('/path');
 *
 * @module api
 * @requires axios
 * @author Nico
 * @modified by Saturnino Méndez
 */
import axios from "axios";
import { getToken, refreshAuthToken, isTokenValid, logout } from "../services/authService"

/**
 * The base URL for the API, obtained from environment variables.
 * 
 * @type {string}
 */
const apiUrl = import.meta.env.VITE_API_URL || "";

/**
 * Axios instance configured for API requests, handling authentication and token refreshing.
 * 
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: apiUrl,
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
    }
    else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

/**
 * Request Interceptor:
 * Automatically adds the JWT Access Token to the Authorization header of outgoing requests.
 */
api.interceptors.request.use(
  (config) => {
    // Rutas que NO deben llevar un Authorization header (login, refresh)
    const excludeAuthHeaderUrls = [
      `${apiUrl}/token/`,
      `/token/`,
      `${apiUrl}/token/refresh/`,
      `/token/refresh/`,
    ];

    const isAuthHeaderExcluded = excludeAuthHeaderUrls.some(url => config.url.includes(url));

    // Si la URL no está excluida, intenta adjuntar el token
    if (!isAuthHeaderExcluded) {
      const token = getToken();
      // Solo adjunta el token si existe y es válido (no ha expirado)
      if (token && isTokenValid()) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Handles responses, specifically 401 Unauthorized errors for token refreshing and request retries.
 * Logs out the user if token refresh fails.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    const excludeUrls = [
      `${apiUrl}/token`,
      `/token`,
      `${apiUrl}/token/refresh`,
      `/token/refresh`,
    ];
    const isExcludedUrl = excludeUrls.some(url => originalRequest.url.includes(url));
    
    if (status === 401 && !isExcludedUrl && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          console.warn("Access token expired or unauthorized. Attempting to refresh token...");
          const newAccessToken = await refreshAuthToken(); 
          
          if (newAccessToken === false){
            console.error("Refresh token not available (refreshAuthToken returned false). Logging out.");
            logout();
            isRefreshing = false;
            processQueue(new Error("No refresh token available."), null);
            return Promise.reject(new Error("No refresh token available."));
          };

          isRefreshing = false; // Unlocks the refresh
          processQueue(null, newAccessToken); 

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Resends the original

        } 
        catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError, null); 

          console.error("Failed to refresh token. Logging out.", refreshError);
          logout(); // Deletes stored tokens
          return Promise.reject(refreshError); // Rejects original promse with refreshError
        };
      };

      // If a refresh request is already in progress, the current request is added to the queue.
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        // When the refresh is complete, this promise will be called with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }).catch(err => {
        // Promise reject if refresh fails
        return Promise.reject(err);
      });
    }
    return Promise.reject(error);
  }
);

export default api;