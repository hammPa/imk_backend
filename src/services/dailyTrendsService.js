const { serpGet } = require("./serpApiClient");
const { readCache, writeCache, isToday } = require("../utils/cache");

async function getDailyTrends(geo = "US") {
  const file = `daily_${geo}.json`;
  const cache = readCache("daily", file);

  // Use cache if still fresh
  if (cache && isToday(cache.lastUpdate)) {
    return cache.data;
  }

  const url =
    `https://serpapi.com/search.json?engine=google_trends_trending_now`
    + `&geo=${geo}&hl=en&api_key=${process.env.SERPAPI_KEY}`;

  try {
    const data = await serpGet(url);

    const mapped = data.trending_searches.map((item, i) => ({
      rank: i + 1,
      query: item.query,
      searchVolume: item.search_volume || 0,
      category: item.category || "General",
    }));

    writeCache("daily", file, {
      lastUpdate: new Date().toDateString(),
      data: mapped,
    });

    return mapped;
  }
  catch (err) {
    // fallback on old cache
    if (cache) return cache.data;
    throw err;
  }
}

module.exports = { getDailyTrends };
