const { getDailyTrends } = require("../services/dailyTrendsService");

async function dailyTrendsController(req, res) {
  const geo = req.query.geo || "US";
  console.log("fetch daily dengan geo " + geo);
  
  try {
    const data = await getDailyTrends(geo);
    res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch daily trends" });
  }
}

module.exports = { dailyTrendsController };
