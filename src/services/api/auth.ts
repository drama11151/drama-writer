import apiClient from './client';
import type { User, AuthResponse } from '../../types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  if (response.data.accessToken) {
    localStorage.setItem('drama-writer-token', response.data.accessToken);
    localStorage.setItem('drama-writer-user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (email: string, password: string, nickname: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', { email, password, nickname });
  if (response.data.accessToken) {
    localStorage.setItem('drama-writer-token', response.data.accessToken);
    localStorage.setItem('drama-writer-user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('drama-writer-token');
  localStorage.removeItem('drama-writer-user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('drama-writer-user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('drama-writer-token');
};
