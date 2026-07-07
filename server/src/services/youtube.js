const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function apiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('YOUTUBE_API_KEY is not set in server/.env');
  return key;
}

async function findTrailer(movieTitle, year) {
  const url = new URL(YOUTUBE_SEARCH_URL);
  url.searchParams.set('key', apiKey());
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '1');
  url.searchParams.set('q', `${movieTitle} ${year || ''} official trailer`.trim());

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`YouTube request failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  const item = (data.items || [])[0];
  return item ? item.id.videoId : null;
}

module.exports = { findTrailer };
