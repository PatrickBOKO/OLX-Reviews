require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const reviewsRouter = require('./routes/reviews');
const ekomiRoutes = require('./routes/ekomi');
const smartlinkRouter = require('./routes/smartlink');
const savePlatformsRouter = require('./routes/savePlatforms');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/reviews', reviewsRouter);
app.use('/api/ekomi', ekomiRoutes);
app.use('/api/smartlink', smartlinkRouter);
app.use('/api/save-platforms', savePlatformsRouter);

app.get('/api/stats', (req, res) => {
  // Dummy stats for demo
  res.json({
    totalSent: 25,
    queued: 4,
    estReviews: [
      { platform: "eKomi", distribution: "30%", count: 7 },
      { platform: "Google", distribution: "30%", count: 10 },
      { platform: "Trustpilot", distribution: "30%", count: 8 },
      { platform: "TrustedShops", distribution: "10%", count: 6 }
    ]
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));