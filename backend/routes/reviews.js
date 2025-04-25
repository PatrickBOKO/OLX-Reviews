const express = require('express');
const router = express.Router();

let requests = [
  // Example initial data
  {
    name: "John Doe",
    email: "john@example.com",
    date: "2023-01-11",
    touchpoint: "Email",
    status: "Sent"
  }
];

router.get('/', (req, res) => {
  res.json(requests);
});

router.post('/send', (req, res) => {
  const { name, email, date, touchpoint, status } = req.body;
  requests.push({ name, email, date, touchpoint, status });
  res.json({ message: "Request sent", requests });
});

module.exports = router;