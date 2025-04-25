const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/userIdByEmail', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Missing email" });

  const dataDir = path.join(__dirname, '../../data');
  const files = fs.readdirSync(dataDir);
  for (const file of files) {
    if (file.startsWith('ekomi-user-') && file.endsWith('.json')) {
      const userData = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
      if (
        userData.login_mail?.toLowerCase() === email.toLowerCase() ||
        userData.email?.toLowerCase() === email.toLowerCase()
      ) {
        // Use interface_id as userId if available, else fallback to email
        return res.json({ userId: userData.interface_id || userData.email });
      }
    }
  }
  return res.status(404).json({ error: "User not found" });
});

module.exports = router;