import { useState, useEffect, useCallback, useRef } from 'react';
import type { Episode } from '../types';
import { getEpisodes, saveEpisodes } from '../services/api/scripts';
import { isAuthenticated } from '../services/api/auth';

export type SyncStatus = 'loading' | 'synced' | 'syncing' | 'local' | 'error';

interface UseScriptSyncOptions {
  projectId?: string;
  localData: Episode[];
  onLocalChange: (data: Episode[]) => void;
  debounceMs?: number;
}

interface UseScriptSyncReturn {
  data: Episode[];
  syncStatus: SyncStatus;
  lastSynced: Date | null;
  error: string | null;
  save: (data: Episode[]) => void;
  refresh: () => Promise<void>;
}

export function useScriptSync({
  projectId,
  localData,
  onLocalChange,
  debounceMs = 2000,
}: UseScriptSyncOptions): UseScriptSyncReturn {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化：从云端加载或使用本地数据
  useEffect(() => {
    if (!projectId || !isAuthenticated()) {
      setSyncStatus('local');
      return;
    }

    const loadFromCloud = async () => {
      try {
        setSyncStatus('loading');
        const cloudData = await getEpisodes(projectId);
        if (cloudData && cloudData.length > 0) {
          onLocalChange(cloudData);
        }
        setLastSynced(new Date());
        setSyncStatus('synced');
      } catch (err: any) {
        console.warn('加载剧本失败，使用本地数据:', err.message);
        setSyncStatus('local');
      }
    };

    loadFromCloud();
  }, [projectId]);

  // 防抖保存到云端
  const saveToCloud = useCallback(
    async (data: Episode[]) => {
      if (!projectId || !isAuthenticated()) {
        setSyncStatus('local');
        return;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(async () => {
        try {
          setSyncStatus('syncing');
          const result = await saveEpisodes(projectId, data);
          setLastSynced(new Date());
          setError(null);
          setSyncStatus('synced');
        } catch (err: any) {
          console.warn('保存剧本失败:', err.message);
          setError(err.message);
          setSyncStatus('error');
        }
      }, debounceMs);
    },
    [projectId, debounceMs]
  );

  // 保存方法
  const save = useCallback(
    (data: Episode[]) => {
      onLocalChange(data);
      saveToCloud(data);
    },
    [onLocalChange, saveToCloud]
  );

  // 刷新
  const refresh = useCallback(async () => {
    if (!projectId || !isAuthenticated()) return;
    try {
      setSyncStatus('loading');
      const cloudData = await getEpisodes(projectId);
      onLocalChange(cloudData);
      setLastSynced(new Date());
      setSyncStatus('synced');
    } catch (err: any) {
      setError(err.message);
      setSyncStatus('error');
    }
  }, [projectId, onLocalChange]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    data: localData,
    syncStatus,
    lastSynced,
    error,
    save,
    refresh,
  };
}