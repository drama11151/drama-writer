import apiClient from './client';
import type { Character } from '../../types';

export const getCharacters = async (projectId: string): Promise<Character[]> => {
  const response = await apiClient.get<{ data: Character[] }>(`/projects/${projectId}/characters`);
  return response.data.data;
};

export const createCharacter = async (projectId: string, data: Omit<Character, 'id'>): Promise<Character> => {
  const response = await apiClient.post<{ data: Character }>(`/projects/${projectId}/characters`, data);
  return response.data.data;
};

export const updateCharacter = async (projectId: string, id: string, data: Partial<Character>): Promise<Character> => {
  const response = await apiClient.patch<{ data: Character }>(`/projects/${projectId}/characters/${id}`, data);
  return response.data.data;
};

export const deleteCharacter = async (projectId: string, id: string): Promise<void> => {
  await apiClient.delete(`/projects/${projectId}/characters/${id}`);
};

export const syncCharacters = async (projectId: string, characters: Character[]): Promise<Character[]> => {
  const response = await apiClient.post<{ data: Character[] }>(`/projects/${projectId}/characters/sync`, { characters });
  return response.data.data;
};
