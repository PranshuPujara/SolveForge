/**
 * GFG service — curated static dataset.
 * GFG has no public API. This dataset covers popular interview problems.
 */

const GFG_PROBLEMS = [
  // Easy
  { id: 'gfg-reverse-string', name: 'Reverse a String', difficulty: 'easy', tags: ['string', 'recursion'], url: 'https://www.geeksforgeeks.org/reverse-a-string/', platform: 'gfg', rating: null },
  { id: 'gfg-fibonacci', name: 'Fibonacci Series', difficulty: 'easy', tags: ['dynamic programming', 'recursion', 'math'], url: 'https://www.geeksforgeeks.org/program-for-nth-fibonacci-number/', platform: 'gfg', rating: null },
  { id: 'gfg-array-rotation', name: 'Array Rotation', difficulty: 'easy', tags: ['array'], url: 'https://www.geeksforgeeks.org/array-rotation/', platform: 'gfg', rating: null },
  { id: 'gfg-duplicate-element', name: 'Find Duplicate Element in Array', difficulty: 'easy', tags: ['array', 'hash table'], url: 'https://www.geeksforgeeks.org/find-duplicates-in-on-time-and-constant-extra-space/', platform: 'gfg', rating: null },
  { id: 'gfg-linked-list-cycle', name: 'Detect Loop in Linked List', difficulty: 'easy', tags: ['linked list', 'two pointers'], url: 'https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/', platform: 'gfg', rating: null },
  { id: 'gfg-palindrome-check', name: 'Check if String is Palindrome', difficulty: 'easy', tags: ['string', 'two pointers'], url: 'https://www.geeksforgeeks.org/c-program-check-given-string-palindrome/', platform: 'gfg', rating: null },
  { id: 'gfg-anagram-check', name: 'Check if Two Strings are Anagram', difficulty: 'easy', tags: ['string', 'hash table', 'sorting'], url: 'https://www.geeksforgeeks.org/check-whether-two-strings-are-anagram-of-each-other/', platform: 'gfg', rating: null },
  { id: 'gfg-stack-using-queue', name: 'Implement Stack using Queue', difficulty: 'easy', tags: ['stack', 'queue', 'design'], url: 'https://www.geeksforgeeks.org/implement-stack-using-queue/', platform: 'gfg', rating: null },

  // Medium
  { id: 'gfg-longest-subarray-sum-k', name: 'Longest Subarray with Sum K', difficulty: 'medium', tags: ['array', 'hash table', 'prefix sum'], url: 'https://www.geeksforgeeks.org/longest-sub-array-sum-k/', platform: 'gfg', rating: null },
  { id: 'gfg-lca', name: 'Lowest Common Ancestor in Binary Tree', difficulty: 'medium', tags: ['tree', 'dfs', 'binary tree'], url: 'https://www.geeksforgeeks.org/lowest-common-ancestor-binary-tree-set-1/', platform: 'gfg', rating: null },
  { id: 'gfg-top-view-tree', name: 'Top View of Binary Tree', difficulty: 'medium', tags: ['tree', 'bfs', 'binary tree', 'hash table'], url: 'https://www.geeksforgeeks.org/print-nodes-top-view-binary-tree/', platform: 'gfg', rating: null },
  { id: 'gfg-dijkstra', name: "Dijkstra's Shortest Path", difficulty: 'medium', tags: ['graphs', 'heap', 'shortest path'], url: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/', platform: 'gfg', rating: null },
  { id: 'gfg-0-1-knapsack', name: '0/1 Knapsack Problem', difficulty: 'medium', tags: ['dynamic programming', 'array'], url: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/', platform: 'gfg', rating: null },
  { id: 'gfg-lcs', name: 'Longest Common Subsequence', difficulty: 'medium', tags: ['dynamic programming', 'string'], url: 'https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/', platform: 'gfg', rating: null },
  { id: 'gfg-activity-selection', name: 'Activity Selection Problem', difficulty: 'medium', tags: ['greedy', 'sorting', 'array'], url: 'https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/', platform: 'gfg', rating: null },
  { id: 'gfg-rat-maze', name: 'Rat in a Maze', difficulty: 'medium', tags: ['backtracking', 'matrix', 'dfs'], url: 'https://www.geeksforgeeks.org/rat-in-a-maze-problem-using-backtracking-2/', platform: 'gfg', rating: null },
  { id: 'gfg-cycle-directed', name: 'Detect Cycle in Directed Graph', difficulty: 'medium', tags: ['graphs', 'dfs'], url: 'https://www.geeksforgeeks.org/detect-cycle-in-a-graph/', platform: 'gfg', rating: null },
  { id: 'gfg-topo-sort', name: 'Topological Sort', difficulty: 'medium', tags: ['graphs', 'dfs', 'topological sort'], url: 'https://www.geeksforgeeks.org/topological-sorting/', platform: 'gfg', rating: null },
  { id: 'gfg-nse', name: 'Next Smaller Element', difficulty: 'medium', tags: ['stack', 'array', 'monotonic stack'], url: 'https://www.geeksforgeeks.org/next-smaller-element/', platform: 'gfg', rating: null },
  { id: 'gfg-kth-largest', name: 'Kth Largest Element in Array', difficulty: 'medium', tags: ['array', 'heap', 'sorting', 'quickselect'], url: 'https://www.geeksforgeeks.org/kth-smallest-largest-element-in-unsorted-array/', platform: 'gfg', rating: null },

  // Hard
  { id: 'gfg-n-queens', name: 'N-Queens Problem', difficulty: 'hard', tags: ['backtracking', 'array'], url: 'https://www.geeksforgeeks.org/n-queen-problem-backtracking-3/', platform: 'gfg', rating: null },
  { id: 'gfg-word-break', name: 'Word Break Problem', difficulty: 'hard', tags: ['dynamic programming', 'string', 'trie'], url: 'https://www.geeksforgeeks.org/word-break-problem-dp-32/', platform: 'gfg', rating: null },
  { id: 'gfg-min-cost-path', name: 'Minimum Cost Path in Matrix', difficulty: 'hard', tags: ['dynamic programming', 'matrix', 'graphs'], url: 'https://www.geeksforgeeks.org/min-cost-path-dp-6/', platform: 'gfg', rating: null },
  { id: 'gfg-strongly-connected', name: 'Strongly Connected Components (Kosaraju)', difficulty: 'hard', tags: ['graphs', 'dfs'], url: 'https://www.geeksforgeeks.org/strongly-connected-components/', platform: 'gfg', rating: null },
  { id: 'gfg-edit-distance', name: 'Edit Distance', difficulty: 'hard', tags: ['dynamic programming', 'string'], url: 'https://www.geeksforgeeks.org/edit-distance-dp-5/', platform: 'gfg', rating: null },
  { id: 'gfg-egg-drop', name: 'Egg Drop Puzzle', difficulty: 'hard', tags: ['dynamic programming', 'math'], url: 'https://www.geeksforgeeks.org/egg-dropping-puzzle-dp-11/', platform: 'gfg', rating: null },
  { id: 'gfg-max-rectangle', name: 'Maximum Rectangle in Binary Matrix', difficulty: 'hard', tags: ['array', 'stack', 'dynamic programming', 'matrix'], url: 'https://www.geeksforgeeks.org/maximum-size-rectangle-binary-sub-matrix-1s/', platform: 'gfg', rating: null },
];

const getAllProblems = async () => GFG_PROBLEMS;

const getAllTags = async () => {
  const tagSet = new Set();
  GFG_PROBLEMS.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
};

module.exports = { getAllProblems, getAllTags };
