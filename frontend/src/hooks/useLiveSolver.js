import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'live_solve_state';

const getInitialState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse live solve state:', e);
  }
  return { isActive: false, problemId: null, startTime: null, handle: null, isSolved: false };
};

export const useLiveSolver = () => {
  const [state, setState] = useState(getInitialState);
  const intervalRef = useRef(null);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save live solve state:', e);
    }
  }, [state]);

  const startTracking = useCallback((problemId, handle) => {
    setState({
      isActive: true,
      problemId,
      handle,
      startTime: Math.floor(Date.now() / 1000), // UNIX timestamp (seconds)
      isSolved: false
    });
  }, []);

  const stopTracking = useCallback(() => {
    setState(s => ({ ...s, isActive: false }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTracker = useCallback(() => {
    setState({ isActive: false, problemId: null, startTime: null, handle: null, isSolved: false });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Poll API if tracking is active
  useEffect(() => {
    if (!state.isActive || !state.handle || !state.problemId || state.isSolved) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const poll = async () => {
      try {
        const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(state.handle)}&from=1&count=5`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        
        if (data.status === 'OK' && data.result) {
          const solvedSubmission = data.result.find(sub => {
            if (sub.verdict !== 'OK') return false;
            // Only care about submissions made after we started tracking
            if (sub.creationTimeSeconds < state.startTime) return false;
            
            const subId = `${sub.problem.contestId}-${sub.problem.index}`;
            return subId === state.problemId;
          });

          if (solvedSubmission) {
            setState(s => ({ ...s, isSolved: true, isActive: false }));
          }
        }
      } catch (err) {
        console.warn('Live solver polling error:', err);
      }
    };

    // Initial poll
    poll();
    
    // Poll gently every 8 seconds
    intervalRef.current = setInterval(poll, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isActive, state.handle, state.problemId, state.startTime, state.isSolved]);

  return {
    ...state,
    startTracking,
    stopTracking,
    resetTracker
  };
};
