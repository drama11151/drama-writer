import apiClient from './client';
import type { Project } from '../../types';

export interface CreateProjectDto {
  title: string;
  format: string;
  genre?: string;
  targetAudience?: string;
  episodes?: number;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<{ data: Project[] }>('/projects');
  return response.data.data;
};

export const getProject = async (id: string): Promise<Project> => {
  const response = await apiClient.get<{ data: Project }>(`/projects/${id}`);
  return response.data.data;
};

export const createProject = async (data: CreateProjectDto): Promise<Project> => {
  const response = await apiClient.post<{ data: Project }>('/projects', data);
  return response.data.data;
};

export const updateProject = async (id: string, data: Partial<CreateProjectDto>): Promise<Project> => {
  const response = await apiClient.patch<{ data: Project }>(`/projects/${id}`, data);
  return response.data.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/projects/${id}`);
};
