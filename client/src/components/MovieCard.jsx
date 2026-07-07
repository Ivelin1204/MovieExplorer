import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card__poster">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
        ) : (
          <div className="movie-card__poster movie-card__poster--placeholder">No image</div>
        )}
      </div>
      <div className="movie-card__body">
        <h3>{movie.title}</h3>
        <p className="movie-card__meta">
          {movie.year || 'Unknown year'} · ⭐ {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
        </p>
      </div>
    </Link>
  );
}
