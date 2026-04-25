const pickRandom = (arr) => {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

const pickRandomN = (arr, n) => {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
};

module.exports = { pickRandom, pickRandomN };
