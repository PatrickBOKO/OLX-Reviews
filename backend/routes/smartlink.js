const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to store click data (in production, use a DB)
const CLICK_DATA_PATH = path.join(__dirname, '../../data/smartlink-clicks.json');

// Helper to read/write click data
function readClickData() {
  try {
    return JSON.parse(fs.readFileSync(CLICK_DATA_PATH, 'utf8'));
  } catch {
    return {};
  }
}
function writeClickData(data) {
  fs.writeFileSync(CLICK_DATA_PATH, JSON.stringify(data, null, 2));
}

// Smartlink redirect endpoint
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  // In production, fetch from DB
  const userConfigPath = path.join(__dirname, '../../data/user-platforms.json');
  let userPlatforms = [];
  try {
    const allConfigs = JSON.parse(fs.readFileSync(userConfigPath, 'utf8'));
    userPlatforms = allConfigs[userId] || [];
  } catch {
    return res.status(404).send('No platform config found.');
  }

  // Validate platforms
  const validPlatforms = userPlatforms.filter(
    p => Number(p.distribution) > 0 && p.url && /^https?:\/\/.+/i.test(p.url)
  );
  if (!validPlatforms.length) return res.status(400).send('No valid platforms.');

  // Weighted random selection based on distribution
  const weighted = [];
  validPlatforms.forEach((p, idx) => {
    for (let i = 0; i < Number(p.distribution); i++) weighted.push(idx);
  });
  const chosenIdx = weighted[Math.floor(Math.random() * weighted.length)];
  const chosenPlatform = validPlatforms[chosenIdx];

  // Track click
  const clickData = readClickData();
  if (!clickData[userId]) clickData[userId] = {};
  clickData[userId][chosenPlatform.platform] = (clickData[userId][chosenPlatform.platform] || 0) + 1;
  writeClickData(clickData);

  // Redirect to the chosen platform
  res.redirect(chosenPlatform.url);
});

module.exports = router;