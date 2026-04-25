/**
 * LeetCode service.
 * LeetCode has no public API. We use a curated static dataset of ~150 problems
 * covering all major tags and difficulties. In production, you could integrate
 * the unofficial leetcode-query npm package or a scraped dataset.
 */

const LEETCODE_PROBLEMS = [
  // Easy
  { id: 'lc-1', name: 'Two Sum', difficulty: 'easy', tags: ['array', 'hash table'], url: 'https://leetcode.com/problems/two-sum/', platform: 'leetcode', rating: null },
  { id: 'lc-20', name: 'Valid Parentheses', difficulty: 'easy', tags: ['string', 'stack'], url: 'https://leetcode.com/problems/valid-parentheses/', platform: 'leetcode', rating: null },
  { id: 'lc-21', name: 'Merge Two Sorted Lists', difficulty: 'easy', tags: ['linked list', 'recursion'], url: 'https://leetcode.com/problems/merge-two-sorted-lists/', platform: 'leetcode', rating: null },
  { id: 'lc-121', name: 'Best Time to Buy and Sell Stock', difficulty: 'easy', tags: ['array', 'dynamic programming', 'greedy'], url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', platform: 'leetcode', rating: null },
  { id: 'lc-226', name: 'Invert Binary Tree', difficulty: 'easy', tags: ['tree', 'dfs', 'bfs', 'binary tree'], url: 'https://leetcode.com/problems/invert-binary-tree/', platform: 'leetcode', rating: null },
  { id: 'lc-572', name: 'Subtree of Another Tree', difficulty: 'easy', tags: ['tree', 'dfs', 'binary tree'], url: 'https://leetcode.com/problems/subtree-of-another-tree/', platform: 'leetcode', rating: null },
  { id: 'lc-217', name: 'Contains Duplicate', difficulty: 'easy', tags: ['array', 'hash table', 'sorting'], url: 'https://leetcode.com/problems/contains-duplicate/', platform: 'leetcode', rating: null },
  { id: 'lc-242', name: 'Valid Anagram', difficulty: 'easy', tags: ['hash table', 'string', 'sorting'], url: 'https://leetcode.com/problems/valid-anagram/', platform: 'leetcode', rating: null },
  { id: 'lc-125', name: 'Valid Palindrome', difficulty: 'easy', tags: ['two pointers', 'string'], url: 'https://leetcode.com/problems/valid-palindrome/', platform: 'leetcode', rating: null },
  { id: 'lc-704', name: 'Binary Search', difficulty: 'easy', tags: ['array', 'binary search'], url: 'https://leetcode.com/problems/binary-search/', platform: 'leetcode', rating: null },
  { id: 'lc-206', name: 'Reverse Linked List', difficulty: 'easy', tags: ['linked list', 'recursion'], url: 'https://leetcode.com/problems/reverse-linked-list/', platform: 'leetcode', rating: null },
  { id: 'lc-104', name: 'Maximum Depth of Binary Tree', difficulty: 'easy', tags: ['tree', 'dfs', 'bfs', 'binary tree'], url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', platform: 'leetcode', rating: null },

  // Medium
  { id: 'lc-49', name: 'Group Anagrams', difficulty: 'medium', tags: ['array', 'hash table', 'string', 'sorting'], url: 'https://leetcode.com/problems/group-anagrams/', platform: 'leetcode', rating: null },
  { id: 'lc-128', name: 'Longest Consecutive Sequence', difficulty: 'medium', tags: ['array', 'hash table', 'union find'], url: 'https://leetcode.com/problems/longest-consecutive-sequence/', platform: 'leetcode', rating: null },
  { id: 'lc-167', name: 'Two Sum II', difficulty: 'medium', tags: ['array', 'two pointers', 'binary search'], url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', platform: 'leetcode', rating: null },
  { id: 'lc-15', name: '3Sum', difficulty: 'medium', tags: ['array', 'two pointers', 'sorting'], url: 'https://leetcode.com/problems/3sum/', platform: 'leetcode', rating: null },
  { id: 'lc-11', name: 'Container With Most Water', difficulty: 'medium', tags: ['array', 'two pointers', 'greedy'], url: 'https://leetcode.com/problems/container-with-most-water/', platform: 'leetcode', rating: null },
  { id: 'lc-3', name: 'Longest Substring Without Repeating Characters', difficulty: 'medium', tags: ['hash table', 'string', 'sliding window'], url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', platform: 'leetcode', rating: null },
  { id: 'lc-424', name: 'Longest Repeating Character Replacement', difficulty: 'medium', tags: ['hash table', 'string', 'sliding window'], url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', platform: 'leetcode', rating: null },
  { id: 'lc-647', name: 'Palindromic Substrings', difficulty: 'medium', tags: ['string', 'dynamic programming'], url: 'https://leetcode.com/problems/palindromic-substrings/', platform: 'leetcode', rating: null },
  { id: 'lc-200', name: 'Number of Islands', difficulty: 'medium', tags: ['array', 'dfs', 'bfs', 'union find', 'matrix', 'graphs'], url: 'https://leetcode.com/problems/number-of-islands/', platform: 'leetcode', rating: null },
  { id: 'lc-102', name: 'Binary Tree Level Order Traversal', difficulty: 'medium', tags: ['tree', 'bfs', 'binary tree'], url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', platform: 'leetcode', rating: null },
  { id: 'lc-235', name: 'Lowest Common Ancestor of a BST', difficulty: 'medium', tags: ['tree', 'dfs', 'binary search tree'], url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', platform: 'leetcode', rating: null },
  { id: 'lc-98', name: 'Validate Binary Search Tree', difficulty: 'medium', tags: ['tree', 'dfs', 'binary search tree'], url: 'https://leetcode.com/problems/validate-binary-search-tree/', platform: 'leetcode', rating: null },
  { id: 'lc-230', name: 'Kth Smallest Element in a BST', difficulty: 'medium', tags: ['tree', 'dfs', 'binary search tree'], url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', platform: 'leetcode', rating: null },
  { id: 'lc-153', name: 'Find Minimum in Rotated Sorted Array', difficulty: 'medium', tags: ['array', 'binary search'], url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', platform: 'leetcode', rating: null },
  { id: 'lc-33', name: 'Search in Rotated Sorted Array', difficulty: 'medium', tags: ['array', 'binary search'], url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', platform: 'leetcode', rating: null },
  { id: 'lc-206', name: 'Clone Graph', difficulty: 'medium', tags: ['hash table', 'dfs', 'bfs', 'graphs'], url: 'https://leetcode.com/problems/clone-graph/', platform: 'leetcode', rating: null },
  { id: 'lc-417', name: 'Pacific Atlantic Water Flow', difficulty: 'medium', tags: ['array', 'dfs', 'bfs', 'matrix', 'graphs'], url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', platform: 'leetcode', rating: null },
  { id: 'lc-198', name: 'House Robber', difficulty: 'medium', tags: ['array', 'dynamic programming'], url: 'https://leetcode.com/problems/house-robber/', platform: 'leetcode', rating: null },
  { id: 'lc-322', name: 'Coin Change', difficulty: 'medium', tags: ['array', 'dynamic programming', 'breadth-first search'], url: 'https://leetcode.com/problems/coin-change/', platform: 'leetcode', rating: null },
  { id: 'lc-300', name: 'Longest Increasing Subsequence', difficulty: 'medium', tags: ['array', 'binary search', 'dynamic programming'], url: 'https://leetcode.com/problems/longest-increasing-subsequence/', platform: 'leetcode', rating: null },
  { id: 'lc-213', name: 'House Robber II', difficulty: 'medium', tags: ['array', 'dynamic programming'], url: 'https://leetcode.com/problems/house-robber-ii/', platform: 'leetcode', rating: null },
  { id: 'lc-55', name: 'Jump Game', difficulty: 'medium', tags: ['array', 'dynamic programming', 'greedy'], url: 'https://leetcode.com/problems/jump-game/', platform: 'leetcode', rating: null },
  { id: 'lc-39', name: 'Combination Sum', difficulty: 'medium', tags: ['array', 'backtracking'], url: 'https://leetcode.com/problems/combination-sum/', platform: 'leetcode', rating: null },
  { id: 'lc-46', name: 'Permutations', difficulty: 'medium', tags: ['array', 'backtracking'], url: 'https://leetcode.com/problems/permutations/', platform: 'leetcode', rating: null },
  { id: 'lc-79', name: 'Word Search', difficulty: 'medium', tags: ['array', 'backtracking', 'matrix', 'dfs'], url: 'https://leetcode.com/problems/word-search/', platform: 'leetcode', rating: null },
  { id: 'lc-208', name: 'Implement Trie', difficulty: 'medium', tags: ['hash table', 'string', 'design', 'trie'], url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', platform: 'leetcode', rating: null },
  { id: 'lc-207', name: 'Course Schedule', difficulty: 'medium', tags: ['dfs', 'bfs', 'graphs', 'topological sort'], url: 'https://leetcode.com/problems/course-schedule/', platform: 'leetcode', rating: null },

  // Hard
  { id: 'lc-4', name: 'Median of Two Sorted Arrays', difficulty: 'hard', tags: ['array', 'binary search', 'divide and conquer'], url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', platform: 'leetcode', rating: null },
  { id: 'lc-76', name: 'Minimum Window Substring', difficulty: 'hard', tags: ['hash table', 'string', 'sliding window'], url: 'https://leetcode.com/problems/minimum-window-substring/', platform: 'leetcode', rating: null },
  { id: 'lc-23', name: 'Merge K Sorted Lists', difficulty: 'hard', tags: ['linked list', 'divide and conquer', 'heap'], url: 'https://leetcode.com/problems/merge-k-sorted-lists/', platform: 'leetcode', rating: null },
  { id: 'lc-84', name: 'Largest Rectangle in Histogram', difficulty: 'hard', tags: ['array', 'stack', 'monotonic stack'], url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', platform: 'leetcode', rating: null },
  { id: 'lc-124', name: 'Binary Tree Maximum Path Sum', difficulty: 'hard', tags: ['dynamic programming', 'tree', 'dfs', 'binary tree'], url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', platform: 'leetcode', rating: null },
  { id: 'lc-297', name: 'Serialize and Deserialize Binary Tree', difficulty: 'hard', tags: ['string', 'tree', 'dfs', 'bfs', 'design', 'binary tree'], url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', platform: 'leetcode', rating: null },
  { id: 'lc-295', name: 'Find Median from Data Stream', difficulty: 'hard', tags: ['two pointers', 'design', 'sorting', 'heap', 'data stream'], url: 'https://leetcode.com/problems/find-median-from-data-stream/', platform: 'leetcode', rating: null },
  { id: 'lc-51', name: 'N-Queens', difficulty: 'hard', tags: ['array', 'backtracking'], url: 'https://leetcode.com/problems/n-queens/', platform: 'leetcode', rating: null },
  { id: 'lc-132', name: 'Palindrome Partitioning II', difficulty: 'hard', tags: ['string', 'dynamic programming'], url: 'https://leetcode.com/problems/palindrome-partitioning-ii/', platform: 'leetcode', rating: null },
  { id: 'lc-127', name: 'Word Ladder', difficulty: 'hard', tags: ['hash table', 'string', 'bfs'], url: 'https://leetcode.com/problems/word-ladder/', platform: 'leetcode', rating: null },
  { id: 'lc-10', name: 'Regular Expression Matching', difficulty: 'hard', tags: ['string', 'dynamic programming', 'recursion'], url: 'https://leetcode.com/problems/regular-expression-matching/', platform: 'leetcode', rating: null },
  { id: 'lc-42', name: 'Trapping Rain Water', difficulty: 'hard', tags: ['array', 'two pointers', 'dynamic programming', 'stack', 'monotonic stack'], url: 'https://leetcode.com/problems/trapping-rain-water/', platform: 'leetcode', rating: null },
  { id: 'lc-25', name: 'Reverse Nodes in k-Group', difficulty: 'hard', tags: ['linked list', 'recursion'], url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', platform: 'leetcode', rating: null },
  { id: 'lc-212', name: 'Word Search II', difficulty: 'hard', tags: ['array', 'backtracking', 'trie', 'matrix'], url: 'https://leetcode.com/problems/word-search-ii/', platform: 'leetcode', rating: null },
];

const getAllProblems = async () => LEETCODE_PROBLEMS;

const getAllTags = async () => {
  const tagSet = new Set();
  LEETCODE_PROBLEMS.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
};

module.exports = { getAllProblems, getAllTags };
