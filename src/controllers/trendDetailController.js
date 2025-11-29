// controllers/trendDetailController.js
const { getTrendDetail } = require("../services/trendDetailService");

async function trendDetailController(req, res) {
  const keyword = req.query.keyword || "technology";
  const geo = req.query.geo || "US";
  const range = req.query.range || "1Y";

  try {
    const data = await getTrendDetail(keyword, geo, range);
    res.json({ data });
  } catch (err) {
    console.error("Trend detail error:", err);
    res.status(500).json({ error: "Failed to fetch trend detail" });
  }
}

module.exports = { trendDetailController };
