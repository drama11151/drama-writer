import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

// 从 localStorage 获取 token
const getToken = () => localStorage.getItem('drama-writer-token');

// 创建 Axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动注入 Token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一错误处理
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token 过期，清除并跳转登录
      localStorage.removeItem('drama-writer-token');
      localStorage.removeItem('drama-writer-user');
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
