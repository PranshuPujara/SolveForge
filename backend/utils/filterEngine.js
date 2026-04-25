/**
 * Core filter engine.
 *
 * friendFilterMode:
 *   'none'      - ignore filterSet
 *   'intersect' - problem MUST be in filterSet
 *
 * User handle filtering:
 *   excludeUserSolved - Set of IDs to exclude (user already solved)
 *   showOnlyUserSolved - Set of IDs to include (user already solved — review mode)
 */
const filterProblems = ({
  problems,
  tags = [],
  minRating,
  maxRating,
  difficulty,
  filterSet = new Set(),
  friendFilterMode = 'none',
  history = new Set(),
  excludeUserSolved = new Set(),
  showOnlyUserSolved = new Set(),
}) => {
  let filtered = [...problems];

  // 1. Exclude history
  if (history.size > 0) {
    filtered = filtered.filter(p => !history.has(p.id));
  }

  // 2. Tag OR filter
  if (tags.length > 0) {
    const tagSet = new Set(tags.map(t => t.toLowerCase()));
    filtered = filtered.filter(p =>
      p.tags && p.tags.some(t => tagSet.has(t.toLowerCase()))
    );
  }

  // 3. Difficulty
  if (minRating !== undefined && maxRating !== undefined) {
    // Allow min === max (exact rating)
    filtered = filtered.filter(p =>
      p.rating !== undefined && p.rating >= minRating && p.rating <= maxRating
    );
  } else if (difficulty) {
    filtered = filtered.filter(p =>
      p.difficulty && p.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  // 4. Friend filter
  if (friendFilterMode === 'intersect' && filterSet.size > 0) {
    filtered = filtered.filter(p => filterSet.has(p.id));
  }

  // 5. User handle: exclude their solved
  if (excludeUserSolved.size > 0) {
    filtered = filtered.filter(p => !excludeUserSolved.has(p.id));
  }

  // 6. User handle: show only their solved (review mode)
  if (showOnlyUserSolved.size > 0) {
    filtered = filtered.filter(p => showOnlyUserSolved.has(p.id));
  }

  return filtered;
};

module.exports = { filterProblems };
