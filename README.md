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

Open **http://localhost:5183** (the client is pinned to this port in `vite.config.js` so it won't shift if another project is already using 5173).

## Features

- **Search** — type a title, see a poster grid of matching movies with year and rating.
- **Details** — overview, rating, runtime, genres, director, and top cast.
- **Trailer** — embedded YouTube player using TMDB's linked trailer (or a YouTube search fallback).
- **Trivia** — auto-generated multiple-choice questions about the movie (release year, director, genre, cast) based on its own data — no extra API calls needed.

## Deploying

GitHub Pages only serves static files, so the client and server deploy to two different places.

### 1. Deploy the server to Render

1. Sign up at https://render.com and click **New > Web Service**, connecting this GitHub repo. Render will detect `render.yaml` in the repo root and pre-fill the service (root dir `server`, build `npm install`, start `npm start`).
2. In the service's **Environment** tab, add `TMDB_API_KEY` and `YOUTUBE_API_KEY` with your real keys (these aren't stored in the repo).
3. Deploy, then copy the service's public URL (something like `https://movie-explorer-server.onrender.com`).

Render's free tier spins the service down when idle, so the first request after inactivity can take ~30s to respond.

### 2. Deploy the client to GitHub Pages

1. In the GitHub repo, go to **Settings > Pages** and set **Source** to **GitHub Actions**.
2. Go to **Settings > Secrets and variables > Actions > Variables** and add a repository variable named `VITE_API_BASE_URL` set to `<your Render URL>/api` (e.g. `https://movie-explorer-server.onrender.com/api`).
3. Push to `main` — the `.github/workflows/deploy-pages.yml` workflow builds `client/` with that URL baked in and publishes it to GitHub Pages automatically.
4. The site will be live at `https://<your-username>.github.io/MovieExplorer/`.

The client uses `HashRouter` (URLs like `/#/movie/603`) specifically so it works on GitHub Pages without server-side routing support.
