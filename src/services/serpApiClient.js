async function serpGet(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`SerpAPI Error ${res.status}`);
  }

  const json = await res.json();
  return json;
}

module.exports = { serpGet };
