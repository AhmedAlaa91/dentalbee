import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const api = axios.create({
  //baseURL: process.env.REACT_APP_API_URL,
  baseURL :'http://localhost:8000/api',
});

// Helper to check if token is expired
const isTokenExpired = (token) => {
  const decoded = jwtDecode(token);
  const now = Date.now() / 1000; // Convert to seconds
  return decoded.exp < now;
};

// Helper to refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await axios.post(`http://localhost:8000/api/token/refresh/`, {
    refresh: refreshToken,
  });

  const { access } = response.data;
  
  // Store the new access token in local storage
  localStorage.setItem('access_token', access);
  
  return access;
};

// Axios request interceptor to check token expiration and refresh if necessary
api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem('access_token');
    
    if (accessToken && isTokenExpired(accessToken)) {
      try {
        // Refresh the access token
        accessToken = await refreshAccessToken();
      } catch (error) {
        console.error("Failed to refresh token, logging out");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw error;
      }
    }

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
