const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

function apiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error('TMDB_API_KEY is not set in server/.env');
  return key;
}

async function tmdbFetch(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', apiKey());
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  }

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`TMDB request failed (${res.status}): ${body}`);
  }
  return res.json();
}

function posterUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

function backdropUrl(path, size = 'w1280') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

function mapSearchResult(movie) {
  return {
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date || null,
    year: movie.release_date ? movie.release_date.slice(0, 4) : null,
    overview: movie.overview,
    rating: movie.vote_average,
    posterUrl: posterUrl(movie.poster_path),
  };
}

async function searchMovies(query, page = 1) {
  const data = await tmdbFetch('/search/movie', { query, page, include_adult: false });
  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: (data.results || []).map(mapSearchResult),
  };
}

async function getGenres() {
  const data = await tmdbFetch('/genre/movie/list');
  return data.genres || [];
}

async function discoverByGenre(genreId, page = 1) {
  const data = await tmdbFetch('/discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page,
  });
  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: (data.results || []).map(mapSearchResult),
  };
}

async function getNowPlaying(page = 1) {
  const data = await tmdbFetch('/movie/now_playing', { page });
  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: (data.results || []).map(mapSearchResult),
  };
}

async function getMovieDetails(id) {
  const data = await tmdbFetch(`/movie/${id}`, {
    append_to_response: 'credits,videos',
  });

  const director = (data.credits?.crew || []).find((c) => c.job === 'Director');
  const cast = (data.credits?.cast || []).slice(0, 10).map((c) => ({
    id: c.id,
    name: c.name,
    character: c.character,
    profileUrl: posterUrl(c.profile_path, 'w185'),
  }));

  const youtubeTrailer = (data.videos?.results || []).find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  ) || (data.videos?.results || []).find((v) => v.site === 'YouTube');

  return {
    id: data.id,
    title: data.title,
    tagline: data.tagline,
    overview: data.overview,
    releaseDate: data.release_date || null,
    year: data.release_date ? data.release_date.slice(0, 4) : null,
    runtime: data.runtime,
    rating: data.vote_average,
    voteCount: data.vote_count,
    genres: (data.genres || []).map((g) => g.name),
    posterUrl: posterUrl(data.poster_path),
    backdropUrl: backdropUrl(data.backdrop_path),
    director: director ? director.name : null,
    cast,
    trailerYoutubeKey: youtubeTrailer ? youtubeTrailer.key : null,
  };
}

module.exports = { searchMovies, getMovieDetails, getGenres, discoverByGenre, getNowPlaying };
