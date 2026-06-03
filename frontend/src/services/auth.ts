import axios, { AxiosResponse } from 'axios';
import { User, UserCreate, UserLogin, Token } from '../types/auth';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with base URL for API calls
const api = axios.create({
  baseURL: API_URL,
});

// Set up axios defaults for token
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData: UserCreate): Promise<AxiosResponse<User>> =>
    api.post('/auth/register', userData),
  login: (credentials: UserLogin): Promise<AxiosResponse<Token>> =>
    api.post('/auth/login', credentials),
  getCurrentUser: (): Promise<AxiosResponse<User>> => api.get('/auth/me'),
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
  },
  setAuthHeader: (token: string): void => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? (JSON.parse(user) as User) : null;
};
