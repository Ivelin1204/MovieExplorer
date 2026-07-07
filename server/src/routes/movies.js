const express = require('express');
const tmdb = require('../services/tmdb');
const youtube = require('../services/youtube');

const router = express.Router();

router.get('/search', async (req, res) => {
  const { query, page } = req.query;
  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'query parameter is required' });
  }
  try {
    const results = await tmdb.searchMovies(query, page ? Number(page) : 1);
    res.json(results);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/genres', async (req, res) => {
  try {
    const genres = await tmdb.getGenres();
    res.json({ genres });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/discover', async (req, res) => {
  const { genre, page } = req.query;
  if (!genre) {
    return res.status(400).json({ error: 'genre parameter is required' });
  }
  try {
    const results = await tmdb.discoverByGenre(genre, page ? Number(page) : 1);
    res.json(results);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/now-playing', async (req, res) => {
  try {
    const results = await tmdb.getNowPlaying(req.query.page ? Number(req.query.page) : 1);
    res.json(results);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await tmdb.getMovieDetails(req.params.id);

    if (!movie.trailerYoutubeKey && process.env.YOUTUBE_API_KEY) {
      try {
        movie.trailerYoutubeKey = await youtube.findTrailer(movie.title, movie.year);
      } catch (err) {
        console.warn(`YouTube trailer fallback failed for "${movie.title}":`, err.message);
      }
    }

    res.json(movie);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
