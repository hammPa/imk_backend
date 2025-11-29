const { getDailyTrends } = require("../services/dailyTrendsService");

async function quickStatsController(req, res) {
  const geo = req.query.geo || "US";   // <-- FIX 1: ambil geo dari FE

  try {
    console.log("fetch quick dengan geo", geo);

    const data = await getDailyTrends(geo);  // <-- FIX 2: jangan paksa "US"

    if (!data || !data.length) {
      return res.json({
        trendGrowth: 0,
        intensity: 0,
        topRanking: "-"
      });
    }

    const avg = data.reduce((sum, x) => sum + x.searchVolume, 0) / data.length;

    res.json({
      trendGrowth: avg,
      intensity: Math.min(100, avg / 1000),
      topRanking: data[0].query
    });

  } catch (err) {
    console.error(err);
    res.json({
      trendGrowth: 0,
      intensity: 0,
      topRanking: "-"
    });
  }
}

module.exports = { quickStatsController };
