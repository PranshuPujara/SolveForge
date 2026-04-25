import { useState, useCallback, useEffect } from 'react';
import { validateHandle, getUserStats } from '../services/api';
import { storage } from '../utils/localStorage';

const HANDLE_KEY  = 'user_handle';
const SOLVED_KEY  = 'user_solved_ids';
const FETCHED_KEY = 'user_solved_fetched_at';
const STATS_KEY   = 'user_stats';
const CACHE_MS    = 10 * 60 * 1000; // 10 min

export const useUserHandle = () => {
  // ── Restore everything from localStorage on mount — no flicker ──
  const [handle,      setHandle]      = useState(() => storage.get(HANDLE_KEY, ''));
  const [solvedIds,   setSolvedIds]   = useState(() => new Set(storage.get(SOLVED_KEY, [])));
  const [solvedCount, setSolvedCount] = useState(() => storage.get(SOLVED_KEY, []).length);
  const [stats,       setStats]       = useState(() => storage.get(STATS_KEY, null));
  const [statsLoading,setStatsLoading]= useState(false);

  // ── KEY FIX: if we have cached handle+solved → status is 'ok' immediately ──
  const [status,   setStatus]   = useState(() => {
    const h = storage.get(HANDLE_KEY, '');
    const s = storage.get(SOLVED_KEY, []);
    return (h && s.length > 0) ? 'ok' : 'idle';
  });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStats = useCallback(async (h) => {
    setStatsLoading(true);
    try {
      const s = await getUserStats(h);
      setStats(s);
      storage.set(STATS_KEY, s);
    } catch {
      // stats are optional — fail silently
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── On mount: background-refresh stale data + fetch stats if missing ──
  useEffect(() => {
    const cachedHandle = storage.get(HANDLE_KEY, '');
    const fetchedAt    = storage.get(FETCHED_KEY, 0);
    if (!cachedHandle) return;

    // Refresh solved IDs if cache is stale (silent — don't change status)
    if (Date.now() - fetchedAt > CACHE_MS) {
      validateHandle(cachedHandle)
        .then(data => {
          const ids = data.solved || [];
          setSolvedIds(new Set(ids));
          setSolvedCount(ids.length);
          storage.set(SOLVED_KEY, ids);
          storage.set(FETCHED_KEY, Date.now());
        })
        .catch(() => {}); // keep existing cache on error
    }

    // Fetch stats if not yet cached
    if (!storage.get(STATS_KEY, null)) {
      fetchStats(cachedHandle);
    }
  }, [fetchStats]);

  const fetchSolved = useCallback(async (h) => {
    if (!h?.trim()) return;
    setStatus('loading'); setErrorMsg('');
    try {
      const data = await validateHandle(h.trim());
      const ids  = data.solved || [];
      const s    = new Set(ids);
      setSolvedIds(s);
      setSolvedCount(ids.length);
      setHandle(h.trim());
      setStatus('ok');
      storage.set(HANDLE_KEY, h.trim());
      storage.set(SOLVED_KEY, ids);
      storage.set(FETCHED_KEY, Date.now());
      // Fetch stats in parallel
      fetchStats(h.trim());
      return s;
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message?.includes('not found')
        ? `"${h}" not found on Codeforces`
        : (err.message || 'Failed to fetch'));
      return null;
    }
  }, [fetchStats]);

  const clearHandle = useCallback(() => {
    setHandle(''); setSolvedIds(new Set()); setSolvedCount(0);
    setStatus('idle'); setErrorMsg(''); setStats(null);
    storage.remove(HANDLE_KEY);
    storage.remove(SOLVED_KEY);
    storage.remove(FETCHED_KEY);
    storage.remove(STATS_KEY);
  }, []);

  const refreshStats = useCallback(() => {
    const h = storage.get(HANDLE_KEY, '');
    if (h) {
      storage.remove(STATS_KEY);
      setStats(null);
      fetchStats(h);
    }
  }, [fetchStats]);

  return {
    handle, solvedIds, solvedCount,
    status, errorMsg,
    stats, statsLoading,
    fetchSolved, clearHandle, refreshStats,
    setHandle,
  };
};
