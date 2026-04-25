const axios = require('axios');
const cache = require('../utils/cache');

const CF_BASE = process.env.CF_API_BASE || 'https://codeforces.com/api';
const PROBLEMS_CACHE_KEY = 'cf_problemset';
const USER_STATUS_PREFIX = 'cf_user_status_';

const getAllProblems = async () => {
  const cached = cache.get(PROBLEMS_CACHE_KEY);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${CF_BASE}/problemset.problems`, { timeout: 10000 });
    if (data.status !== 'OK') throw new Error(`Codeforces API error: ${data.comment}`);

    const statsMap = {};
    if (data.result.problemStatistics) {
      data.result.problemStatistics.forEach(s => {
        statsMap[`${s.contestId}-${s.index}`] = s.solvedCount;
      });
    }

    const problems = data.result.problems.map(p => ({
      id: `${p.contestId}-${p.index}`,
      contestId: p.contestId,
      index: p.index,
      name: p.name,
      rating: p.rating || null,
      tags: p.tags || [],
      platform: 'codeforces',
      difficulty: ratingToLabel(p.rating),
      url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
      solvedCount: statsMap[`${p.contestId}-${p.index}`] || 0,
    }));

    cache.set(PROBLEMS_CACHE_KEY, problems);
    return problems;
  } catch (err) {
    throw new Error(`Failed to fetch Codeforces problems: ${err.message}`);
  }
};

/**
 * Returns both solved IDs AND attempted-but-failed IDs for a handle.
 * attempted = submitted but verdict !== 'OK' (and never solved)
 */
const getUserStatusData = async (handle) => {
  const cacheKey = `${USER_STATUS_PREFIX}${handle}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${CF_BASE}/user.status`, {
      params: { handle, count: 10000 },
      timeout: 10000,
    });
    if (data.status !== 'OK') throw new Error(`CF API error for user ${handle}: ${data.comment}`);

    const solved = new Set();
    const attempted = new Set(); // tried but never AC'd

    data.result.forEach(s => {
      const id = `${s.problem.contestId}-${s.problem.index}`;
      if (s.verdict === 'OK') {
        solved.add(id);
        attempted.delete(id); // solved trumps attempted
      } else if (!solved.has(id)) {
        attempted.add(id);
      }
    });

    const result = { solved, attempted };
    cache.set(cacheKey, result, 600);
    return result;
  } catch (err) {
    if (err.response?.status === 400) throw new Error(`Codeforces user "${handle}" not found.`);
    throw new Error(`Failed to fetch submissions for ${handle}: ${err.message}`);
  }
};

// Legacy helper – returns just solved set
const getUserSolvedIds = async (handle) => {
  const { solved } = await getUserStatusData(handle);
  return solved;
};

/**
 * Returns:
 *  - solvedUnion:   Set of IDs solved by ANY friend
 *  - attemptedUnion: Set of IDs attempted (but never solved) by ANY friend
 *  - perProblem:    map of id -> count of friends who solved it
 */
const getFriendsData = async (handles) => {
  if (!handles || handles.length === 0) {
    return { solvedUnion: new Set(), attemptedUnion: new Set(), perProblem: {} };
  }

  const results = await Promise.allSettled(handles.map(h => getUserStatusData(h)));

  const solvedUnion = new Set();
  const attemptedUnion = new Set();
  const perProblem = {};

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      const { solved, attempted } = result.value;
      solved.forEach(id => {
        solvedUnion.add(id);
        perProblem[id] = (perProblem[id] || 0) + 1;
      });
      attempted.forEach(id => {
        if (!solvedUnion.has(id)) attemptedUnion.add(id);
      });
    } else {
      console.warn(`Failed to fetch for handle ${handles[i]}: ${result.reason}`);
    }
  });

  // Clean up attempted: remove anything that's in solvedUnion
  solvedUnion.forEach(id => attemptedUnion.delete(id));

  return { solvedUnion, attemptedUnion, perProblem };
};

// Keep old name for backwards compat in codeforces route
const getFriendsSolvedData = async (handles) => {
  const { solvedUnion, perProblem } = await getFriendsData(handles);
  return { union: solvedUnion, perProblem };
};

const getAllTags = async () => {
  const problems = await getAllProblems();
  const tagSet = new Set();
  problems.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
};

const ratingToLabel = (rating) => {
  if (!rating) return 'unrated';
  if (rating <= 1000) return 'easy';
  if (rating <= 1600) return 'medium';
  return 'hard';
};

module.exports = { getAllProblems, getUserSolvedIds, getUserStatusData, getFriendsData, getFriendsSolvedData, getAllTags };
