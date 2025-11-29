const { serpGet } = require("./serpApiClient");

async function getTrendChart(keyword = "technology", geo = "US") {
  const url =
    `https://serpapi.com/search.json?engine=google_trends` +
    `&q=${encodeURIComponent(keyword)}` +
    `&geo=${geo}` +
    `&data_type=TIMESERIES` +
    `&date=today+12-m` +
    `&tz=420` +
    `&api_key=${process.env.SERPAPI_KEY}`;

  console.log("[SERVICE] CHART URL:", url);

  const json = await serpGet(url);

  const raw = json?.interest_over_time?.timeline_data;
  if (!raw || raw.length === 0) {
    return [];
  }

  const timeline = raw.map((t) => ({
    time: Number(t.timestamp) * 1000,
    value: Number(t.values[0].extracted_value),
  }));

  return timeline;
}

module.exports = { getTrendChart };
