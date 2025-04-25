const express = require('express');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load secrets from environment variables (never expose in frontend!)
const {
  EKOMI_MASTER_INTERFACE_ID,
  EKOMI_MASTER_INTERFACE_PW,
  EKOMI_HASH_VALUE
} = process.env;

// Helper: Check uniqueness in your DB (pseudo-code, replace with real DB check)
async function isUnique(email, externalId) {
  // TODO: Query your user DB for existing email or externalId
  return true; // Return false if not unique
}

// eKomi Registration Endpoint
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      externalId,
      pub_url,
      pub_name,
      firstName,
      lastName,
      locale,
      phone,
      password
    } = req.body;

    // Step 0: Uniqueness check
    if (!(await isUnique(email, externalId))) {
      return res.status(400).json({ error: "Email or external ID already in use." });
    }

    // Step 1: Prepare hash API params
    const hashParams = {
      master_interface_id: EKOMI_MASTER_INTERFACE_ID,
      master_interface_pw: EKOMI_MASTER_INTERFACE_PW,
      hash: EKOMI_HASH_VALUE,
      url: pub_url,
      pub_name,
      account_name: pub_name,
      firstname: firstName,
      company_name: pub_name,
      private_email: email,
      locale,
      cross_reference_id: externalId,
      private_forename: firstName,
      private_surname: lastName,
      private_phone: phone,
      login_pass: password
    };

    // Step 2: Call eKomi Hash API
    const hashResponse = await axios.post(
      'https://proxy-api.ekomiapps.de/api/1.1/hashes',
      qs.stringify(hashParams),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        timeout: 60000
      }
    );

    if (hashResponse.status !== 200 || !hashResponse.data.data) {
      return res.status(500).json({ error: "Failed to generate hash from eKomi." });
    }

    // Step 3: Call eKomi Account API
    const accountResponse = await axios.post(
      'https://proxy-api.ekomiapps.de/api/1.1/accounts',
      { data: hashResponse.data.data },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60000
      }
    );

    if (accountResponse.status !== 201) {
      return res.status(500).json({ error: "Failed to create eKomi account." });
    }

    // Save eKomi account data to /backend/data as JSON
    const ekomiData = accountResponse.data;
    // Use a unique identifier for the filename (e.g., interface_id or externalId)
    const uniqueId = ekomiData.interface_id || req.body.externalId || req.body.email;
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(
      path.join(dataDir, `ekomi-user-${uniqueId}.json`),
      JSON.stringify(ekomiData, null, 2)
    );

    res.json({ ekomi: ekomiData });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;
