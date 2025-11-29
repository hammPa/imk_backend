const { getTrendChart } = require("../services/trendChartService");

async function trendChartController(req, res) {
  const keyword = req.query.keyword || "technology";
  const geo = req.query.geo || "US";

  try {
    const data = await getTrendChart(keyword, geo);
    return res.json({ data });
  } catch (err) {
    console.error("❌ CONTROLLER ERROR (chart):", err);
    return res.status(400).json({ error: "Failed to fetch chart data" });
  }
}

module.exports = { trendChartController };
