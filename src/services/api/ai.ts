import apiClient from './client';

export type AITaskType = 'topic_eval' | 'outline_gen' | 'script_gen' | 'character_analysis' | 'idea_expand';

export interface CreateAITaskDto {
  type: AITaskType;
  projectId: string;
  data: Record<string, any>;
}

export const createAITask = async (data: CreateAITaskDto): Promise<{ taskId: string }> => {
  const response = await apiClient.post<{ data: { taskId: string } }>('/ai/tasks', data);
  return response.data.data;
};

export const getAITaskStatus = async (taskId: string): Promise<{ status: string; result?: any }> => {
  const response = await apiClient.get<{ data: { status: string; result?: any } }>(`/ai/tasks/${taskId}`);
  return response.data.data;
};
