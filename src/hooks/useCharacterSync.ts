import { useState, useEffect, useCallback, useRef } from 'react';
import type { Character } from '../types';
import { getCharacters, syncCharacters } from '../services/api/characters';
import { isAuthenticated } from '../services/api/auth';

export type SyncStatus = 'loading' | 'synced' | 'syncing' | 'local' | 'error';

interface UseCharacterSyncOptions {
  projectId?: string;
  localData: Character[];
  onLocalChange: (data: Character[]) => void;
  debounceMs?: number;
}

interface UseCharacterSyncReturn {
  data: Character[];
  syncStatus: SyncStatus;
  lastSynced: Date | null;
  error: string | null;
  save: (data: Character[]) => void;
  refresh: () => Promise<void>;
}

export function useCharacterSync({
  projectId,
  localData,
  onLocalChange,
  debounceMs = 2000,
}: UseCharacterSyncOptions): UseCharacterSyncReturn {
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
        const cloudData = await getCharacters(projectId);
        if (cloudData && cloudData.length > 0) {
          onLocalChange(cloudData);
        }
        setLastSynced(new Date());
        setSyncStatus('synced');
      } catch (err: any) {
        console.warn('加载角色失败，使用本地数据:', err.message);
        setSyncStatus('local');
      }
    };

    loadFromCloud();
  }, [projectId]);

  // 防抖保存到云端
  const saveToCloud = useCallback(
    async (data: Character[]) => {
      if (!projectId || !isAuthenticated()) {
        setSyncStatus('local');
        return;
      }

      // 清除之前的定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(async () => {
        try {
          setSyncStatus('syncing');
          const result = await syncCharacters(projectId, data);
          setLastSynced(new Date());
          setError(null);
          setSyncStatus('synced');
        } catch (err: any) {
          console.warn('保存角色失败:', err.message);
          setError(err.message);
          setSyncStatus('error');
        }
      }, debounceMs);
    },
    [projectId, debounceMs]
  );

  // 保存方法
  const save = useCallback(
    (data: Character[]) => {
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
      const cloudData = await getCharacters(projectId);
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
