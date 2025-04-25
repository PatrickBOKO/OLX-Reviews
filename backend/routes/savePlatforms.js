const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const USER_PLATFORMS_PATH = path.join(__dirname, '../../data/user-platforms.json');

router.post('/', (req, res) => {
  const { userId, platforms } = req.body;
  if (!userId || !Array.isArray(platforms)) {
    return res.status(400).json({ error: "Missing userId or platforms" });
  }
  let allConfigs = {};
  try {
    allConfigs = JSON.parse(fs.readFileSync(USER_PLATFORMS_PATH, 'utf8'));
  } catch {
    allConfigs = {};
  }
  allConfigs[userId] = platforms;
  fs.writeFileSync(USER_PLATFORMS_PATH, JSON.stringify(allConfigs, null, 2));
  res.json({ success: true });
});

module.exports = router;