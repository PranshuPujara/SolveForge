import { useState, useEffect } from 'react';
import { getTags } from '../services/api';

// CF tags are large — hardcode a curated list as fallback
const CF_TAGS_FALLBACK = [
  'implementation','math','greedy','dp','data structures','brute force',
  'constructive algorithms','graphs','sortings','binary search','dfs and similar',
  'trees','strings','number theory','combinatorics','two pointers','bitmasks',
  'geometry','shortest paths','probabilities','hashing','divide and conquer',
  'flows','game theory','schedules','matrices','fft','string suffix structures',
];

export const useTags = (platform) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!platform) return;
    setLoading(true);
    getTags(platform)
      .then((data) => setTags(data.tags || []))
      .catch(() => {
        if (platform === 'codeforces') setTags(CF_TAGS_FALLBACK);
      })
      .finally(() => setLoading(false));
  }, [platform]);

  return { tags, loading };
};
