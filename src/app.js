const express = require("express");
const cors = require("cors");


// LOGGER DEVOPS
const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "..", "logs", "system.log");
fs.mkdirSync(path.join(__dirname, "..", "logs"), { recursive: true });

const originalLog = console.log;
console.log = function (...args) {
  const msg = args.join(" ");
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(logPath, line);
  originalLog.apply(console, args);
};


const app = express();
app.use(cors());
app.use(express.json());


// freeze server
let freezeMode = false;

// Freeze middleware (SEOLAH SERVER MATI)
app.use((req, res, next) => {
  // IZINKAN DEVOPS ENDPOINT
  if (req.url.startsWith("/devops")) {
    return next();
  }

  if (freezeMode) {
    return res.status(503).json({
      status: "offline",
      message: "Server is currently offline (Freeze Mode)",
    });
  }

  next();
});





// trends
const { dailyTrendsController } = require("./controllers/dailyTrendsController");
const { quickStatsController } = require("./controllers/quickStatsController");
const { trendChartController } = require("./controllers/trendChartController");
const { trendDetailController } = require("./controllers/trendDetailController");
const { regionInsightController } = require("./controllers/regionalInsightController");




app.get("/", (_, res) => res.send("TrendScope Backend Running 🟢"));
app.get("/daily-trends", dailyTrendsController);
app.get("/quick-stats", quickStatsController);
app.get("/trend-chart", trendChartController);
app.get("/trend-detail", trendDetailController);
app.get("/regional-insight", regionInsightController);



const ctrl = require("./controllers/devopsController");
app.get("/devops/stats", ctrl.getStats);
app.get("/devops/logs", ctrl.getLogs);




// Toggle freeze mode
app.post("/devops/freeze", (req, res) => {
  freezeMode = !freezeMode;
  console.log("Freeze Mode:", freezeMode);
  res.json({ freeze: freezeMode });
});



const userAdmin = require('./controllers/userAdminController');
// Admin User Management
app.get("/admin/users", userAdmin.getUsers);
app.post("/admin/users/update", userAdmin.updateUser);
app.post("/admin/users/delete", userAdmin.deleteUser);


const ai = require("./controllers/aiController");

app.post("/ai/explain-chart", ai.explainChartController);
app.post("/ai/sentiment", ai.sentimentController);

module.exports = app;


