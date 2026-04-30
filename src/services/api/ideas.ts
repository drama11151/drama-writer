import apiClient from './client';
import type { Idea } from '../../types';

export const getIdeas = async (projectId: string): Promise<Idea[]> => {
  const response = await apiClient.get<{ data: Idea[] }>(`/projects/${projectId}/ideas`);
  return response.data.data;
};

export const createIdea = async (projectId: string, data: Omit<Idea, 'id'>): Promise<Idea> => {
  const response = await apiClient.post<{ data: Idea }>(`/projects/${projectId}/ideas`, data);
  return response.data.data;
};

export const updateIdea = async (projectId: string, id: string, data: Partial<Idea>): Promise<Idea> => {
  const response = await apiClient.patch<{ data: Idea }>(`/projects/${projectId}/ideas/${id}`, data);
  return response.data.data;
};

export const deleteIdea = async (projectId: string, id: string): Promise<void> => {
  await apiClient.delete(`/projects/${projectId}/ideas/${id}`);
};
