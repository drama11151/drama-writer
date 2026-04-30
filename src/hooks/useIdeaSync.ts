import { useState, useEffect, useCallback } from 'react';
import type { Idea } from '../types';
import { getIdeas, createIdea, updateIdea, deleteIdea } from '../services/api/ideas';
import { isAuthenticated } from '../services/api/auth';

export type SyncStatus = 'loading' | 'synced' | 'syncing' | 'local' | 'error';

interface UseIdeaSyncOptions {
  projectId?: string;
}

interface UseIdeaSyncReturn {
  ideas: Idea[];
  isLoading: boolean;
  syncStatus: SyncStatus;
  error: string | null;
  refresh: () => Promise<void>;
  add: (data: Omit<Idea, 'id'>) => Promise<Idea>;
  update: (id: string, data: Partial<Idea>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useIdeaSync({ projectId }: UseIdeaSyncOptions): UseIdeaSyncReturn {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!projectId) {
      // 本地模式
      const local = localStorage.getItem(`drama-writer-ideas-${projectId}`);
      setIdeas(local ? JSON.parse(local) : []);
      return;
    }

    if (!isAuthenticated()) {
      const local = localStorage.getItem(`drama-writer-ideas-${projectId}`);
      setIdeas(local ? JSON.parse(local) : []);
      setSyncStatus('local');
      return;
    }

    try {
      setIsLoading(true);
      const data = await getIdeas(projectId);
      setIdeas(data);
      setSyncStatus('synced');
      setError(null);
    } catch (err: any) {
      console.warn('加载灵感失败:', err.message);
      setSyncStatus('local');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (data: Omit<Idea, 'id'>): Promise<Idea> => {
    const newIdea: Idea = {
      ...data,
      id: `local-${crypto.randomUUID()}`,
    };

    if (!projectId || !isAuthenticated()) {
      setIdeas(prev => {
        const updated = [...prev, newIdea];
        localStorage.setItem(`drama-writer-ideas-${projectId}`, JSON.stringify(updated));
        return updated;
      });
      return newIdea;
    }

    try {
      setSyncStatus('syncing');
      const created = await createIdea(projectId, newIdea);
      setIdeas(prev => [...prev, created]);
      setSyncStatus('synced');
      return created;
    } catch (err: any) {
      setSyncStatus('local');
      setIdeas(prev => {
        const updated = [...prev, newIdea];
        localStorage.setItem(`drama-writer-ideas-${projectId}`, JSON.stringify(updated));
        return updated;
      });
      return newIdea;
    }
  }, [projectId]);

  const update = useCallback(async (id: string, data: Partial<Idea>) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));

    if (!projectId || !isAuthenticated()) {
      const local = JSON.parse(localStorage.getItem(`drama-writer-ideas-${projectId}`) || '[]');
      const updated = local.map((i: Idea) => i.id === id ? { ...i, ...data } : i);
      localStorage.setItem(`drama-writer-ideas-${projectId}`, JSON.stringify(updated));
      return;
    }

    try {
      setSyncStatus('syncing');
      await updateIdea(projectId, id, data);
      setSyncStatus('synced');
    } catch (err: any) {
      setSyncStatus('local');
    }
  }, [projectId]);

  const remove = useCallback(async (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));

    if (!projectId || !isAuthenticated()) {
      const local = JSON.parse(localStorage.getItem(`drama-writer-ideas-${projectId}`) || '[]');
      localStorage.setItem(`drama-writer-ideas-${projectId}`, JSON.stringify(local.filter((i: Idea) => i.id !== id)));
      return;
    }

    try {
      setSyncStatus('syncing');
      await deleteIdea(projectId, id);
      setSyncStatus('synced');
    } catch (err: any) {
      setSyncStatus('local');
    }
  }, [projectId]);

  return { ideas, isLoading, syncStatus, error, refresh, add, update, remove };
}
