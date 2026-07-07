const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export function searchMovies(query, page = 1) {
  return request(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
}

export function getMovieDetails(id) {
  return request(`/movies/${id}`);
}

export function getGenres() {
  return request('/movies/genres');
}

export function discoverByGenre(genreId, page = 1) {
  return request(`/movies/discover?genre=${genreId}&page=${page}`);
}

export function getNowPlaying(page = 1) {
  return request(`/movies/now-playing?page=${page}`);
}
