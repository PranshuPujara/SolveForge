import { useState, useCallback } from 'react';
import { pickProblem, getDailyProblem, reattemptProblem } from '../services/api';
import { addToHistory, getHistory, updateStreak, setLastRating } from '../utils/localStorage';

export const useProblemPicker = () => {
  const [problem,       setProblem]       = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [meta,          setMeta]          = useState(null);
  const [noFriendMatch, setNoFriendMatch] = useState(false);

  const pick = useCallback(async (filters) => {
    setLoading(true); setError(null); setNoFriendMatch(false);
    try {
      const data = await pickProblem({ ...filters, history: getHistory() });
      setProblem(data.problem); setMeta(data.meta);
      addToHistory(`${data.problem.platform}:${data.problem.id}`);
      if (data.problem.rating) setLastRating(data.problem.rating);
      updateStreak();
    } catch (err) {
      if (err.noFriendMatch) setNoFriendMatch(true);
      setError(err.message); setProblem(null);
    } finally { setLoading(false); }
  }, []);

  /**
   * Re-attempt a specific problem from history.
   *
   * Calls the dedicated POST /reattempt endpoint which looks up
   * the exact problem by ID. If the API call fails for any reason,
   * we construct a minimal fallback object so the ProblemCard can
   * still render a working link — the user is never left empty-handed.
   *
   * @param {string} historyId — the raw history string, e.g. "codeforces:1234-A"
   */
  const reattempt = useCallback(async (historyId) => {
    setLoading(true); setError(null); setNoFriendMatch(false);

    // Parse "platform:rawId" from the history entry
    let platform = 'codeforces';
    let rawId = historyId;
    if (historyId.includes(':')) {
      const [p, ...rest] = historyId.split(':');
      platform = p;
      rawId = rest.join(':');
    }

    try {
      const data = await reattemptProblem({ platform, problemId: rawId });
      setProblem(data.problem);
      setMeta({ ...data.meta, isReattempt: true });
      // Don't re-add to history — it's already there
      if (data.problem.rating) setLastRating(data.problem.rating);
      updateStreak();
    } catch (err) {
      // Fallback: build a minimal problem object from the history ID
      // so the UI can still show the problem link
      const fallback = buildFallbackProblem(platform, rawId);
      if (fallback) {
        setProblem(fallback);
        setMeta({ isReattempt: true, isFallback: true });
      } else {
        setError(err.message);
        setProblem(null);
      }
    } finally { setLoading(false); }
  }, []);

  const fetchDaily = useCallback(async (filters) => {
    setLoading(true); setError(null); setNoFriendMatch(false);
    try {
      const data = await getDailyProblem(filters);
      setProblem(data.problem); setMeta({ ...data.meta, isDaily: true, date: data.date });
    } catch (err) {
      setError(err.message); setProblem(null);
    } finally { setLoading(false); }
  }, []);

  const clear = useCallback(() => {
    setProblem(null); setError(null); setMeta(null); setNoFriendMatch(false);
  }, []);

  return { problem, loading, error, meta, noFriendMatch, pick, reattempt, fetchDaily, clear };
};

/* ── Fallback: construct a minimal problem when API is unreachable ── */
function buildFallbackProblem(platform, rawId) {
  if (platform === 'codeforces') {
    const parts = rawId.split('-');
    if (parts.length >= 2) {
      const idx = parts[parts.length - 1];
      const contestId = parts.slice(0, -1).join('-');
      return {
        id: rawId,
        platform: 'codeforces',
        name: `Problem ${contestId}${idx}`,
        url: `https://codeforces.com/problemset/problem/${contestId}/${idx}`,
        contestId,
        index: idx,
        tags: [],
        rating: null,
      };
    }
  }
  // For other platforms, return null — the error message will show instead
  return null;
}
