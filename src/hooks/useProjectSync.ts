import { useState, useEffect, useCallback, useRef } from 'react';
import type { Project } from '../types';
import { getProjects, createProject, updateProject, deleteProject } from '../services/api/projects';
import { isAuthenticated } from '../services/api/auth';

export type SyncStatus = 'loading' | 'synced' | 'syncing' | 'local' | 'error';

interface UseProjectSyncReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: Partial<Project>) => Promise<Project>;
  update: (id: string, data: Partial<Project>) => Promise<Project>;
  remove: (id: string) => Promise<void>;
}

export function useProjectSync(): UseProjectSyncReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) {
      // 本地模式：加载 localStorage
      const local = localStorage.getItem('drama-writer-projects');
      setProjects(local ? JSON.parse(local) : []);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (data: Partial<Project>): Promise<Project> => {
    if (!isAuthenticated()) {
      const localProject: Project = {
        ...(data as Project),
        id: `local-${crypto.randomUUID()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const local = JSON.parse(localStorage.getItem('drama-writer-projects') || '[]');
      localStorage.setItem('drama-writer-projects', JSON.stringify([...local, localProject]));
      setProjects(prev => [...prev, localProject]);
      return localProject;
    }

    const newProject = await createProject({
      title: data.title || '未命名项目',
      format: data.format || 'short-drama',
      genre: data.genre,
      targetAudience: data.targetAudience,
      episodes: data.episodes,
    });
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const update = useCallback(async (id: string, data: Partial<Project>): Promise<Project> => {
    if (id.startsWith('local-')) {
      const local = JSON.parse(localStorage.getItem('drama-writer-projects') || '[]');
      const updated = local.map((p: Project) => p.id === id ? { ...p, ...data, updatedAt: new Date() } : p);
      localStorage.setItem('drama-writer-projects', JSON.stringify(updated));
      setProjects(updated);
      return updated.find((p: Project) => p.id === id);
    }

    const updated = await updateProject(id, data);
    setProjects(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    if (id.startsWith('local-')) {
      const local = JSON.parse(localStorage.getItem('drama-writer-projects') || '[]');
      const filtered = local.filter((p: Project) => p.id !== id);
      localStorage.setItem('drama-writer-projects', JSON.stringify(filtered));
      setProjects(prev => prev.filter(p => p.id !== id));
      return;
    }

    await deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  return { projects, isLoading, error, refresh, create, update, remove };
}
