import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import GenreSidebar from '../components/GenreSidebar';
import MovieGrid from '../components/MovieGrid';
import { searchMovies, discoverByGenre, getGenres, getNowPlaying } from '../api';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') || '';

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [mode, setMode] = useState(initialGenre ? 'genre' : 'search');
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState(initialQuery || initialGenre ? 'loading' : 'idle');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsStatus, setSuggestionsStatus] = useState('loading');
  const [suggestionsPage, setSuggestionsPage] = useState(1);
  const [suggestionsTotalPages, setSuggestionsTotalPages] = useState(1);
  const [loadingMoreSuggestions, setLoadingMoreSuggestions] = useState(false);

  useEffect(() => {
    getGenres()
      .then((data) => setGenres(data.genres))
      .catch(() => setGenres([]));

    getNowPlaying()
      .then((data) => {
        setSuggestions(data.results);
        setSuggestionsPage(data.page);
        setSuggestionsTotalPages(data.totalPages);
        setSuggestionsStatus('done');
      })
      .catch(() => setSuggestionsStatus('error'));
  }, []);

  async function runSearch(query) {
    setMode('search');
    setSelectedGenre('');
    setSearchParams({ q: query });
    setStatus('loading');
    setError(null);
    try {
      const data = await searchMovies(query);
      setMovies(data.results);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  async function runGenre(genreId) {
    setMode('genre');
    setSelectedGenre(genreId);
    if (!genreId) {
      setSearchParams({});
      setMovies([]);
      setStatus('idle');
      return;
    }
    setSearchParams({ genre: genreId });
    setStatus('loading');
    setError(null);
    try {
      const data = await discoverByGenre(genreId);
      setMovies(data.results);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  async function loadMoreMovies() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = mode === 'genre'
        ? await discoverByGenre(selectedGenre, nextPage)
        : await searchMovies(searchParams.get('q') || '', nextPage);
      setMovies((prev) => [...prev, ...data.results]);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function loadMoreSuggestions() {
    setLoadingMoreSuggestions(true);
    try {
      const nextPage = suggestionsPage + 1;
      const data = await getNowPlaying(nextPage);
      setSuggestions((prev) => [...prev, ...data.results]);
      setSuggestionsPage(data.page);
      setSuggestionsTotalPages(data.totalPages);
    } catch {
      // ignore — suggestions are best-effort
    } finally {
      setLoadingMoreSuggestions(false);
    }
  }

  useEffect(() => {
    if (initialGenre) runGenre(initialGenre);
    else if (initialQuery) runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GenreSidebar genres={genres} value={selectedGenre} onChange={runGenre} />

      <div className="page page--has-sidebar">
        <h1>Movie Explorer</h1>
        <p className="subtitle">Search movies, view details, watch trailers, and test your knowledge.</p>

        <div className="controls-row">
          <SearchBar initialValue={initialQuery} onSearch={runSearch} />
        </div>

        {status === 'loading' && <p>Loading...</p>}
        {status === 'error' && <p className="error">{error}</p>}
        {status === 'done' && movies.length === 0 && <p>No results found.</p>}
        {status !== 'idle' && (
          <>
            <MovieGrid movies={movies} />
            {status === 'done' && page < totalPages && (
              <button className="load-more" onClick={loadMoreMovies} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            )}
          </>
        )}

        {status === 'idle' && (
          <section className="suggestions">
            <h2>New releases</h2>
            {suggestionsStatus === 'loading' && <p>Loading...</p>}
            {suggestionsStatus === 'error' && <p className="error">Couldn't load suggestions.</p>}
            <MovieGrid movies={suggestions} />
            {suggestionsStatus === 'done' && suggestionsPage < suggestionsTotalPages && (
              <button className="load-more" onClick={loadMoreSuggestions} disabled={loadingMoreSuggestions}>
                {loadingMoreSuggestions ? 'Loading...' : 'Load more'}
              </button>
            )}
          </section>
        )}
      </div>
    </>
  );
}
