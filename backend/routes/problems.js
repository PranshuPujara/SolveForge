const express = require('express');
const router  = express.Router();

const { getAllProblems: getCFProblems }  = require('../services/codeforcesService');
const { getAllProblems: getLCProblems }  = require('../services/leetcodeService');
const { getAllProblems: getGFGProblems } = require('../services/gfgService');
const { getFriendsData }                = require('../services/codeforcesService');
const { filterProblems }                = require('../utils/filterEngine');
const { pickRandom }                    = require('../utils/random');

router.post('/pick', async (req, res, next) => {
  try {
    const {
      platform = 'codeforces',
      tags = [],
      minRating, maxRating, difficulty,
      filterMode = 'none',
      friendHandles = [],
      history = [],
      smartMode = false,
      lastRating,
      ignoreFilterMode = false,
      // User handle filtering (arrays from frontend)
      excludeUserSolved  = [],
      showOnlyUserSolved = [],
    } = req.body;

    // Load problem pool
    let problems = [];
    if      (platform === 'codeforces') problems = await getCFProblems();
    else if (platform === 'leetcode')   problems = await getLCProblems();
    else if (platform === 'gfg')        problems = await getGFGProblems();
    else return res.status(400).json({ error: `Unknown platform: ${platform}` });

    // Friend data
    let solvedSet = new Set(), attemptedSet = new Set(), perProblem = {};
    const activeMode = ignoreFilterMode ? 'none' : filterMode;
    if (platform === 'codeforces' && friendHandles.length > 0 && activeMode !== 'none') {
      const fd = await getFriendsData(friendHandles);
      solvedSet = fd.solvedUnion; attemptedSet = fd.attemptedUnion; perProblem = fd.perProblem;
    }

    // Smart mode bump
    let effectiveMin = minRating, effectiveMax = maxRating;
    if (smartMode && lastRating && platform === 'codeforces') {
      effectiveMin = lastRating + 100; effectiveMax = lastRating + 400;
    }

    const historySet = new Set(history);
    let filterSet = new Set(), friendFilterMode = 'none';
    if (activeMode === 'unsolved') { filterSet = attemptedSet; friendFilterMode = 'intersect'; }
    else if (activeMode === 'solved') { filterSet = solvedSet; friendFilterMode = 'intersect'; }

    // Build user-handle sets
    const excludeSet   = new Set(excludeUserSolved);
    const showOnlySet  = new Set(showOnlyUserSolved);

    let filtered = filterProblems({
      problems, tags,
      minRating: effectiveMin, maxRating: effectiveMax, difficulty,
      filterSet, friendFilterMode,
      history: historySet,
      excludeUserSolved: excludeSet,
      showOnlyUserSolved: showOnlySet,
    });

    // Friend-filtered no match → special response
    const wasFriendFiltered = (filterMode === 'unsolved' || filterMode === 'solved') && !ignoreFilterMode && friendHandles.length > 0;
    if (filtered.length === 0 && wasFriendFiltered) {
      return res.status(404).json({
        noFriendMatch: true, filterMode,
        error: `No problems match your rating/tags AND the "${filterMode}" friend filter.`,
      });
    }

    // Retry without history
    let retriedWithoutHistory = false;
    if (filtered.length === 0 && historySet.size > 0) {
      retriedWithoutHistory = true;
      filtered = filterProblems({
        problems, tags,
        minRating: effectiveMin, maxRating: effectiveMax, difficulty,
        filterSet, friendFilterMode,
        history: new Set(),
        excludeUserSolved: excludeSet,
        showOnlyUserSolved: showOnlySet,
      });
    }

    if (filtered.length === 0) {
      return res.status(404).json({
        error: 'No problems found matching your filters.',
        suggestions: ['Broaden the rating range', 'Remove some tag filters', 'Change the filter mode'],
      });
    }

    const problem = pickRandom(filtered);
    res.json({
      problem: { ...problem, friendsSolvedCount: perProblem[problem.id] || 0 },
      meta: { totalMatched: filtered.length, retriedWithoutHistory, platform },
    });
  } catch (err) { next(err); }
});

router.post('/daily', async (req, res, next) => {
  try {
    const { platform='codeforces', tags=[], minRating=1000, maxRating=1800 } = req.body;
    let problems = [];
    if      (platform==='codeforces') problems = await getCFProblems();
    else if (platform==='leetcode')   problems = await getLCProblems();
    else if (platform==='gfg')        problems = await getGFGProblems();
    const filtered = filterProblems({ problems, tags, minRating, maxRating });
    if (!filtered.length) return res.status(404).json({ error: 'No daily problem found.' });
    const today = new Date().toISOString().slice(0,10);
    const seed  = today.split('-').reduce((a,n)=>a+parseInt(n),0);
    res.json({ problem: filtered[seed % filtered.length], date: today, meta: { totalMatched: filtered.length } });
  } catch(err) { next(err); }
});

router.get('/tags', async (req, res, next) => {
  try {
    const { platform='codeforces' } = req.query;
    const svc = { codeforces: require('../services/codeforcesService'), leetcode: require('../services/leetcodeService'), gfg: require('../services/gfgService') }[platform];
    if (!svc) return res.status(400).json({ error: 'Unknown platform' });
    res.json({ platform, tags: await svc.getAllTags() });
  } catch(err) { next(err); }
});

module.exports = router;
