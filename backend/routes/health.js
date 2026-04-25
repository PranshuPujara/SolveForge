const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'problem-picker-api' });
});

module.exports = router;
