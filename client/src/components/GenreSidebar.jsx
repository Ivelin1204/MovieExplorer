import { useEffect, useRef } from 'react';

const DESKTOP_QUERY = '(min-width: 721px)';

export default function GenreSidebar({ genres, value, onChange }) {
  const detailsRef = useRef(null);
  const selected = value ? genres.find((g) => String(g.id) === String(value)) : null;

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    function sync() {
      if (detailsRef.current) detailsRef.current.open = mq.matches;
    }
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  function handleSelect(genreId) {
    onChange(genreId);
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
    if (!isDesktop && detailsRef.current) detailsRef.current.open = false;
  }

  return (
    <aside className="genre-sidebar">
      <details className="genre-dropdown" ref={detailsRef}>
        <summary className="genre-dropdown__summary">
          <span>Genres</span>
          <span className="genre-dropdown__selected">{selected ? selected.name : 'All genres'}</span>
        </summary>

        <h2 className="genre-sidebar__title">Genres</h2>
        <ul className="genre-sidebar__list">
          <li>
            <button
              type="button"
              className={`genre-sidebar__item${value === '' ? ' genre-sidebar__item--active' : ''}`}
              onClick={() => handleSelect('')}
            >
              All genres
            </button>
          </li>
          {genres.map((genre) => (
            <li key={genre.id}>
              <button
                type="button"
                className={`genre-sidebar__item${String(value) === String(genre.id) ? ' genre-sidebar__item--active' : ''}`}
                onClick={() => handleSelect(String(genre.id))}
              >
                {genre.name}
              </button>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  );
}
