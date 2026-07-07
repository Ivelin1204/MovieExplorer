export default function GenreSidebar({ genres, value, onChange }) {
  return (
    <aside className="genre-sidebar">
      <h2 className="genre-sidebar__title">Genres</h2>
      <ul className="genre-sidebar__list">
        <li>
          <button
            type="button"
            className={`genre-sidebar__item${value === '' ? ' genre-sidebar__item--active' : ''}`}
            onClick={() => onChange('')}
          >
            All genres
          </button>
        </li>
        {genres.map((genre) => (
          <li key={genre.id}>
            <button
              type="button"
              className={`genre-sidebar__item${String(value) === String(genre.id) ? ' genre-sidebar__item--active' : ''}`}
              onClick={() => onChange(String(genre.id))}
            >
              {genre.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
