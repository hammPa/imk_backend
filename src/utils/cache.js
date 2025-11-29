const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "../../cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

function readCache(sub, file) {
  const dir = path.join(CACHE_DIR, sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const full = path.join(dir, file);
  if (!fs.existsSync(full)) return null;

  try {
    return JSON.parse(fs.readFileSync(full, "utf8"));
  } catch {
    return null;
  }
}

function writeCache(sub, file, data) {
  const dir = path.join(CACHE_DIR, sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  fs.writeFileSync(
    path.join(dir, file),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

function loadCache(sub, key) {
  const dir = path.join(CACHE_DIR, sub);
  const file = path.join(dir, key + ".json");

  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  if (!fs.existsSync(file)) return null;

  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function saveCache(sub, key, data) {
  const dir = path.join(CACHE_DIR, sub);
  const file = path.join(dir, key + ".json");

  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}


const isToday = (d) => d === new Date().toDateString();

module.exports = { readCache, writeCache, loadCache, saveCache, isToday };
