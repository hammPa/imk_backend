const os = require("os");

function getCpuUsage() {
  return new Promise((resolve) => {
    const start = os.cpus();

    setTimeout(() => {
      const end = os.cpus();

      let idleDiff = 0;
      let totalDiff = 0;

      for (let i = 0; i < start.length; i++) {
        const s = start[i].times;
        const e = end[i].times;

        idleDiff += e.idle - s.idle;
        totalDiff +=
          (e.user + e.nice + e.sys + e.irq + e.idle) -
          (s.user + s.nice + s.sys + s.irq + s.idle);
      }

      const usage = 1 - idleDiff / totalDiff;
      resolve(usage);
    }, 800); // ambil sample 0.8 detik
  });
}

exports.getStats = async (req, res) => {
  try {
    const cpuUsage = await getCpuUsage(); // FLOAT 0–1

    const totalMemGb = os.totalmem() / 1024 / 1024 / 1024;
    const freeMemGb = os.freemem() / 1024 / 1024 / 1024;
    const usedMemGb = totalMemGb - freeMemGb;

    const data = {
      cpuLoad: cpuUsage,      // contoh: 0.43
      cpuCores: os.cpus().length,
      ramUsedGb: usedMemGb,
      uptime: os.uptime(),     // detik
      timestamp: Date.now()
    };

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to get stats", details: err.message });
  }
};

exports.getLogs = async (req, res) => {
  const fs = require("fs");

  try {
    const logs = fs.readFileSync("./logs/system.log", "utf8");
    res.send(logs);
  } catch (err) {
    res.send("Failed to load logs: " + err.message);
  }
};
