import { useState, useCallback } from 'react';
import { pickProblem, getDailyProblem } from '../services/api';
import { addToHistory, getHistory, updateStreak, setLastRating } from '../utils/localStorage';

export const useProblemPicker = () => {
  const [problem,      setProblem]      = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [meta,         setMeta]         = useState(null);
  const [noFriendMatch,setNoFriendMatch]= useState(false);

  const pick = useCallback(async (filters) => {
    setLoading(true); setError(null); setNoFriendMatch(false);
    try {
      const data = await pickProblem({ ...filters, history: getHistory() });
      setProblem(data.problem); setMeta(data.meta);
      addToHistory(`${data.problem.platform}:${data.problem.id}`);
      if (data.problem.rating) setLastRating(data.problem.rating);
      updateStreak();
    } catch(err) {
      if (err.noFriendMatch) setNoFriendMatch(true);
      setError(err.message); setProblem(null);
    } finally { setLoading(false); }
  }, []);

  const fetchDaily = useCallback(async (filters) => {
    setLoading(true); setError(null); setNoFriendMatch(false);
    try {
      const data = await getDailyProblem(filters);
      setProblem(data.problem); setMeta({ ...data.meta, isDaily:true, date:data.date });
    } catch(err) {
      setError(err.message); setProblem(null);
    } finally { setLoading(false); }
  }, []);

  const clear = useCallback(() => { setProblem(null); setError(null); setMeta(null); setNoFriendMatch(false); }, []);

  return { problem, loading, error, meta, noFriendMatch, pick, fetchDaily, clear };
};
