const express = require("express");
const cors = require("cors");

const { dailyTrendsController } = require("./controllers/dailyTrendsController");
const { quickStatsController } = require("./controllers/quickStatsController");
const { trendChartController } = require("./controllers/trendChartController");
const { trendDetailController } = require("./controllers/trendDetailController");
const { regionInsightController } = require("./controllers/regionalInsightController");



const app = express();
app.use(cors());

app.get("/", (_, res) => res.send("TrendScope Backend Running 🟢"));
app.get("/daily-trends", dailyTrendsController);
app.get("/quick-stats", quickStatsController);
app.get("/trend-chart", trendChartController);
app.get("/trend-detail", trendDetailController);
app.get("/regional-insight", regionInsightController);


module.exports = app;
