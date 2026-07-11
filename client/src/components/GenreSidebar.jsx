import { useEffect, useState } from 'react';

const DESKTOP_QUERY = '(min-width: 721px)';

export default function GenreSidebar({ genres, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const selected = value ? genres.find((g) => String(g.id) === String(value)) : null;

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    function sync() {
      setOpen(mq.matches);
    }
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  function toggleOpen() {
    setOpen((prev) => {
      const next = !prev;
      if (next) setOpenCount((c) => c + 1);
      return next;
    });
  }

  function handleSelect(genreId) {
    onChange(genreId);
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
    if (!isDesktop) setOpen(false);
  }

  return (
    <aside className="genre-sidebar">
      <details className="genre-dropdown" open={open}>
        <summary
          className="genre-dropdown__summary"
          onClick={(e) => {
            e.preventDefault();
            toggleOpen();
          }}
        >
          <span>Genres</span>
          <span className="genre-dropdown__selected">{selected ? selected.name : 'All genres'}</span>
        </summary>

        <h2 className="genre-sidebar__title">Genres</h2>
        <ul className="genre-sidebar__list" key={openCount}>
          <li style={{ '--i': 0 }}>
            <button
              type="button"
              className={`genre-sidebar__item${value === '' ? ' genre-sidebar__item--active' : ''}`}
              onClick={() => handleSelect('')}
            >
              All genres
            </button>
          </li>
          {genres.map((genre, index) => (
            <li key={genre.id} style={{ '--i': index + 1 }}>
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
