# Movie Explorer

Search movies, view details and ratings, watch trailers, and play a trivia quiz — powered by TMDB and YouTube.

## Project structure

- `server/` — Express backend that proxies TMDB and YouTube so API keys never reach the browser.
- `client/` — React (Vite) frontend.

## 1. Get API keys

### TMDB (movies, ratings, cast, posters)
1. Create a free account at https://www.themoviedb.org/signup
2. Go to https://www.themoviedb.org/settings/api and request an API key (choose "Developer", any hobby project description is fine).
3. Copy the **API Key (v3 auth)** value.

### YouTube Data API v3 (trailer fallback)
TMDB's `/videos` endpoint already returns an official YouTube trailer for most movies, so this key is only used as a fallback when TMDB has none.
1. Go to https://console.cloud.google.com/ and create a project (or use an existing one).
2. Go to **APIs & Services > Library**, search for "YouTube Data API v3", and enable it.
3. Go to **APIs & Services > Credentials**, click **Create Credentials > API key**, and copy it.

## 2. Configure environment variables

```bash
cd server
cp .env.example .env
# edit .env and paste your TMDB_API_KEY and YOUTUBE_API_KEY
```

```bash
cd client
cp .env.example .env
# default VITE_API_BASE_URL=http://localhost:5000/api works if you keep the server on port 5000
```

## 3. Install & run

In one terminal:
```bash
cd server
npm install
npm run dev
```

In another terminal:
```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Features

- **Search** — type a title, see a poster grid of matching movies with year and rating.
- **Details** — overview, rating, runtime, genres, director, and top cast.
- **Trailer** — embedded YouTube player using TMDB's linked trailer (or a YouTube search fallback).
- **Trivia** — auto-generated multiple-choice questions about the movie (release year, director, genre, cast) based on its own data — no extra API calls needed.
