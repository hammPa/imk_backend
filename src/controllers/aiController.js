// src/controllers/aiController.js
const { explainChart, sentimentAnalysis } = require("../services/aiService");

// --------- Controller: EXPLAIN CHART ---------
async function explainChartController(req, res) {
  try {
    const body = req.body;

    if (!body || !body.chart) {
      return res.status(400).json({ error: "Missing chart data" });
    }

    const explanation = await explainChart(body);
    res.json({ explanation });
  } catch (err) {
    console.error("Explain Chart Error:", err);
    res.status(500).json({ error: "Failed to analyze chart" });
  }
}

// --------- Controller: SENTIMENT ---------
async function sentimentController(req, res) {
  try {
    const { chart } = req.body;

    if (!chart) {
      return res.status(400).json({ error: "Missing chart data" });
    }

    const sentiment = await sentimentAnalysis(chart);
    res.json({ sentiment });
  } catch (err) {
    console.error("Sentiment Error:", err);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
}

module.exports = {
  explainChartController,
  sentimentController,
};
