import MovieCard from './MovieCard';

export default function MovieGrid({ movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
