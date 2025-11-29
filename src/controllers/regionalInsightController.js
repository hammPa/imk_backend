const { getRegionInsight } = require("../services/regionalInsightService");

async function regionInsightController(req, res) {
  const geo = req.query.geo || "ID"; // default Indonesia

  try {
    const data = await getRegionInsight(geo);
    res.json({ data });
  } catch (err) {
    console.error("Region insight error:", err);
    res.status(500).json({ error: "Failed to fetch region insight" });
  }
}

module.exports = { regionInsightController };
