import apiClient from './client';
import type { Episode } from '../../types';

export const getEpisodes = async (projectId: string): Promise<Episode[]> => {
  const response = await apiClient.get<{ data: Episode[] }>(`/projects/${projectId}/scripts`);
  return response.data.data;
};

export const saveEpisodes = async (projectId: string, episodes: Episode[]): Promise<Episode[]> => {
  const response = await apiClient.post<{ data: Episode[] }>(`/projects/${projectId}/scripts`, { episodes });
  return response.data.data;
};

export const updateEpisode = async (projectId: string, id: number, data: Partial<Episode>): Promise<Episode> => {
  const response = await apiClient.patch<{ data: Episode }>(`/projects/${projectId}/scripts/${id}`, data);
  return response.data.data;
};
