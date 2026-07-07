import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Trailer from '../components/Trailer';
import Trivia from '../components/Trivia';
import { getMovieDetails } from '../api';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus('loading');
    getMovieDetails(id)
      .then((data) => {
        setMovie(data);
        setStatus('done');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, [id]);

  if (status === 'loading') return <div className="page">Loading...</div>;
  if (status === 'error') return <div className="page error">{error}</div>;

  return (
    <div className="page">
      <Link to="/" className="back-link">&larr; Back to search</Link>

      <div
        className="movie-detail__hero"
        style={movie.backdropUrl ? { backgroundImage: `url(${movie.backdropUrl})` } : undefined}
      >
        <div className="movie-detail__hero-overlay" />
      </div>

      <div className="movie-detail">
        <img className="movie-detail__poster" src={movie.posterUrl} alt={movie.title} />
        <div className="movie-detail__info">
          <h1>{movie.title} {movie.year && <span className="movie-detail__year">({movie.year})</span>}</h1>
          {movie.tagline && <p className="movie-detail__tagline">{movie.tagline}</p>}
          <p className="movie-detail__meta">
            ⭐ {movie.rating ? movie.rating.toFixed(1) : 'N/A'} ({movie.voteCount} votes)
            {movie.runtime ? ` · ${movie.runtime} min` : ''}
            {movie.genres.length ? ` · ${movie.genres.join(', ')}` : ''}
          </p>
          {movie.director && <p><strong>Director:</strong> {movie.director}</p>}
          <p>{movie.overview}</p>
        </div>
      </div>

      {movie.cast.length > 0 && (
        <section className="cast">
          <h2>Cast</h2>
          <div className="cast__list">
            {movie.cast.map((actor) => (
              <div className="cast__item" key={actor.id}>
                {actor.profileUrl ? (
                  <img src={actor.profileUrl} alt={actor.name} loading="lazy" />
                ) : (
                  <div className="cast__item-placeholder">No photo</div>
                )}
                <p className="cast__name">{actor.name}</p>
                <p className="cast__character">{actor.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Trailer</h2>
        <Trailer youtubeKey={movie.trailerYoutubeKey} title={movie.title} />
      </section>

      <Trivia movie={movie} />
    </div>
  );
}
