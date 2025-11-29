const { serpGet } = require("./serpApiClient");
const { loadCache, saveCache } = require("../utils/cache");

async function getRegionInsight(geoCode) {
  const key = `regional_${geoCode}`;

  const cached = loadCache("region_insight", key);
  if (cached) return cached;

  const url =
    `https://serpapi.com/search.json?engine=google_trends_trending_now`
    + `&geo=${geoCode}`
    + `&category_id=7`
    + `&api_key=${process.env.SERPAPI_KEY}`;

  const data = await serpGet(url);

  // ❗ INI yang benar
  const list = data?.trending_searches || [];

  // ❗ Sesuaikan ke model RegionalTrend milik Flutter
  const mapped = list.map(item => ({
    query: item.query ?? "-",
    search_volume: item.search_volume ?? 0,
    increase_percentage: item.increase_percentage ?? 0,
    category: item.categories?.[0]?.name ?? "-"
  }));

  saveCache("region_insight", key, mapped);
  return mapped;
}

module.exports = { getRegionInsight };
