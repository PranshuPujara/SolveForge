const express = require('express');
const router  = express.Router();
const axios   = require('axios');
const cache   = require('../utils/cache');
const { getAllTags, getUserSolvedIds, getFriendsSolvedData, getAllProblems } = require('../services/codeforcesService');

const CF_BASE = process.env.CF_API_BASE || 'https://codeforces.com/api';

// GET /api/codeforces/tags
router.get('/tags', async (req, res, next) => {
  try { res.json({ tags: await getAllTags() }); } catch(e) { next(e); }
});

// GET /api/codeforces/user/:handle/solved
router.get('/user/:handle/solved', async (req, res, next) => {
  try {
    const { handle } = req.params;
    if (!handle?.trim()) return res.status(400).json({ error: 'Handle required' });
    const solvedSet = await getUserSolvedIds(handle.trim());
    res.json({ handle, solvedCount: solvedSet.size, solved: Array.from(solvedSet) });
  } catch(e) { next(e); }
});

// GET /api/codeforces/user/:handle/stats
// Returns rich profile stats: tag breakdown, rating dist, recent activity
router.get('/user/:handle/stats', async (req, res, next) => {
  try {
    const { handle } = req.params;
    if (!handle?.trim()) return res.status(400).json({ error: 'Handle required' });

    const cacheKey = `stats_${handle}`;
    const cached   = cache.get(cacheKey);
    if (cached) return res.json(cached);

    // Fetch in parallel: user info + submissions
    const [infoRes, subsRes, allProblems] = await Promise.all([
      axios.get(`${CF_BASE}/user.info`, { params: { handles: handle }, timeout: 8000 }),
      axios.get(`${CF_BASE}/user.status`,{ params: { handle, count: 10000 }, timeout: 10000 }),
      getAllProblems(),
    ]);

    if (infoRes.data.status !== 'OK') throw new Error(`User "${handle}" not found`);
    if (subsRes.data.status !== 'OK') throw new Error('Failed to fetch submissions');

    const userInfo    = infoRes.data.result[0];
    const submissions = subsRes.data.result;

    // Build problem lookup map
    const problemMap = {};
    allProblems.forEach(p => { problemMap[p.id] = p; });

    // Process submissions
    const solvedMap  = {}; // id -> submission
    const attemptMap = {}; // id -> count of wrong attempts
    const tagCount   = {};
    const ratingBuckets = {};
    const monthlyActivity = {}; // "YYYY-MM" -> count

    submissions.forEach(s => {
      const pid = `${s.problem.contestId}-${s.problem.index}`;
      const ts  = new Date(s.creationTimeSeconds * 1000);
      const ym  = `${ts.getFullYear()}-${String(ts.getMonth()+1).padStart(2,'0')}`;

      if (s.verdict === 'OK') {
        if (!solvedMap[pid]) {
          solvedMap[pid] = s;
          // Count tags
          (s.problem.tags || []).forEach(t => { tagCount[t] = (tagCount[t]||0) + 1; });
          // Rating bucket
          if (s.problem.rating) {
            const bucket = Math.floor(s.problem.rating / 200) * 200;
            ratingBuckets[bucket] = (ratingBuckets[bucket]||0) + 1;
          }
          // Monthly
          monthlyActivity[ym] = (monthlyActivity[ym]||0) + 1;
        }
      } else {
        if (!solvedMap[pid]) {
          attemptMap[pid] = (attemptMap[pid]||0) + 1;
        }
      }
    });

    const solvedCount  = Object.keys(solvedMap).length;
    const attemptedCount = Object.keys(attemptMap).length;
    const totalSubs    = submissions.length;
    const acRate       = totalSubs > 0 ? Math.round((solvedCount / totalSubs) * 100) : 0;

    // Top tags (top 10)
    const topTags = Object.entries(tagCount)
      .sort((a,b) => b[1]-a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Rating distribution sorted
    const ratingDist = Object.entries(ratingBuckets)
      .sort((a,b) => parseInt(a[0])-parseInt(b[0]))
      .map(([rating, count]) => ({ rating: parseInt(rating), count }));

    // Last 12 months activity
    const now = new Date();
    const last12 = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      last12.push({ month: k, count: monthlyActivity[k] || 0 });
    }

    // Streak calculation
    const solvedDates = [...new Set(
      Object.values(solvedMap).map(s => new Date(s.creationTimeSeconds*1000).toISOString().slice(0,10))
    )].sort().reverse();

    let currentStreak = 0, maxStreak = 0, streak = 0;
    let prev = null;
    for (const d of [...solvedDates].reverse()) {
      if (prev === null) { streak = 1; }
      else {
        const diff = (new Date(d) - new Date(prev)) / 86400000;
        streak = diff === 1 ? streak + 1 : 1;
      }
      maxStreak = Math.max(maxStreak, streak);
      prev = d;
    }
    const today = new Date().toISOString().slice(0,10);
    const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
    if (solvedDates[0] === today || solvedDates[0] === yesterday) currentStreak = streak;

    const stats = {
      handle,
      // User info
      rating:         userInfo.rating       || null,
      maxRating:      userInfo.maxRating     || null,
      rank:           userInfo.rank          || 'unrated',
      maxRank:        userInfo.maxRank       || 'unrated',
      avatar:         userInfo.titlePhoto    || null,
      country:        userInfo.country       || null,
      organization:   userInfo.organization  || null,
      friendOfCount:  userInfo.friendOfCount || 0,
      contribution:   userInfo.contribution  || 0,
      registeredAt:   userInfo.registrationTimeSeconds
                        ? new Date(userInfo.registrationTimeSeconds*1000).getFullYear()
                        : null,
      // Solve stats
      solvedCount,
      attemptedCount,
      totalSubmissions: totalSubs,
      acRate,
      // Breakdowns
      topTags,
      ratingDist,
      monthlyActivity: last12,
      currentStreak,
      maxStreak,
    };

    cache.set(cacheKey, stats, 600); // 10 min
    res.json(stats);
  } catch(e) { next(e); }
});

// POST /api/codeforces/friends/solved
router.post('/friends/solved', async (req, res, next) => {
  try {
    const { handles } = req.body;
    if (!Array.isArray(handles)||!handles.length) return res.status(400).json({ error: 'handles array required' });
    if (handles.length > 10) return res.status(400).json({ error: 'Max 10 friends' });
    const { union, perProblem } = await getFriendsSolvedData(handles);
    res.json({ handles, totalUniqueSolved: union.size, solvedIds: Array.from(union), perProblem });
  } catch(e) { next(e); }
});

module.exports = router;
