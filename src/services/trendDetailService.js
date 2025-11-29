const { serpGet } = require("./serpApiClient");
const { loadCache, saveCache } = require("../utils/cache");

function mapRangeToDateParam(range) {
  switch (range.toLowerCase()) {
    case "1m": return "today 1-m";
    case "3m": return "today 3-m";
    case "1y": return "today 12-m";
    default:   return "today 12-m";
  }
}


function computeGrowth(raw) {
  if (!raw || raw.length < 2) return 0;

  const first = raw[0].values[0].extracted_value;
  const last = raw[raw.length - 1].values[0].extracted_value;

  if (first <= 0) return 0;

  return Math.round((((last - first) / first) * 100) * 10) / 10;
}

function extractKeywords(rq) {
  if (!rq) return [];

  // Case 1 — array langsung
  if (Array.isArray(rq)) {
    return rq.map(r => r.query).slice(0, 10);
  }

  // Case 2 — object berisi top & rising
  const top = Array.isArray(rq.top) ? rq.top : [];
  const rising = Array.isArray(rq.rising) ? rq.rising : [];

  return [
    ...top.map(r => r.query),
    ...rising.map(r => r.query)
  ].slice(0, 10);
}

async function getTrendDetail(keyword, geo, range) {
  const dateParam = mapRangeToDateParam(range);
  const key = `detail_${keyword}_${geo}_${range}`.toLowerCase();

  const cached = loadCache("trend_detail", key);
  if (cached) return cached;

  // ===== 1) TIMESERIES =====
  const urlTimeseries =
    `https://serpapi.com/search.json?engine=google_trends` +
    `&q=${encodeURIComponent(keyword)}` +
    `&geo=${geo}` +
    `&data_type=TIMESERIES` +
    `&date=${encodeURIComponent(dateParam)}` +
    `&api_key=${process.env.SERPAPI_KEY}`;

  const ts = await serpGet(urlTimeseries);

  const rawTimeline = ts.interest_over_time?.timeline_data || [];

  const timeline = rawTimeline.map(t => ({
    time: Number(t.timestamp) * 1000,
    value: Number(t.values[0].extracted_value),
  }));

  const growth = computeGrowth(rawTimeline);

  // ===== 2) RELATED QUERIES =====
  const urlRelated =
    `https://serpapi.com/search.json?engine=google_trends` +
    `&q=${encodeURIComponent(keyword)}` +
    `&geo=${geo}` +
    `&data_type=RELATED_QUERIES` +
    `&date=${encodeURIComponent(dateParam)}` +
    `&api_key=${process.env.SERPAPI_KEY}`;

  const rq = await serpGet(urlRelated);

  const relatedKeywords = extractKeywords(rq.related_queries);

  const result = {
    keyword,
    geo,
    range,
    growth,
    chart: timeline,
    relatedKeywords,
  };

  saveCache("trend_detail", key, result);
  return result;
}


module.exports = { getTrendDetail };
