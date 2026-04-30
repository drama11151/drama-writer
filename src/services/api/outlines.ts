import apiClient from './client';
import type { StoryOutline } from '../../types';

export const getOutline = async (projectId: string): Promise<StoryOutline | null> => {
  try {
    const response = await apiClient.get<{ data: StoryOutline }>(`/projects/${projectId}/outline`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

export const saveOutline = async (projectId: string, data: StoryOutline): Promise<StoryOutline> => {
  const response = await apiClient.post<{ data: StoryOutline }>(`/projects/${projectId}/outline`, data);
  return response.data.data;
};

export const updateOutline = async (projectId: string, data: Partial<StoryOutline>): Promise<StoryOutline> => {
  const response = await apiClient.patch<{ data: StoryOutline }>(`/projects/${projectId}/outline`, data);
  return response.data.data;
};
