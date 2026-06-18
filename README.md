# Insightify

Personal Spotify analytics dashboard. Connects to your Spotify account and shows your top tracks, top artists, recently played, and listening pattern charts — all in a minimal black and green UI.

![stack](https://img.shields.io/badge/stack-Python%20%7C%20Flask%20%7C%20React%20%7C%20Chart.js-1db954?style=flat-square)

## What it does

- **Now Playing** — live card that polls every 5 seconds and shows the current track with a progress bar
- **Top Tracks / Artists** — ranked lists switchable across 4 weeks, 6 months, and all time
- **Recently Played** — last 50 tracks with relative timestamps
- **Listening Patterns** — bar charts showing your listening broken down by hour of day, day of week, and most played artists, built from a pandas pipeline on the backend

## Stack

- **Backend** — Python, Flask, Spotipy (Authorization Code flow)
- **Data** — pandas (aggregates recently played into hourly/daily/artist distributions)
- **Frontend** — React 18 + Vite, Chart.js via react-chartjs-2
- **API** — Flask REST endpoints, Vite proxies `/api` requests to Flask in dev

## Project structure

```
insightify/
├── app.py                  # Flask server, all API routes
├── src/
│   ├── auth.py             # Spotify OAuth setup
│   ├── fetch.py            # Spotify API calls
│   └── analytics.py        # pandas pipeline (hourly, daily, top artists)
├── client/
│   ├── src/
│   │   ├── App.jsx         # root component, data fetching
│   │   └── components/
│   │       ├── NowPlaying.jsx
│   │       ├── StatCards.jsx
│   │       ├── TopTracks.jsx
│   │       ├── TopArtists.jsx
│   │       ├── RecentlyPlayed.jsx
│   │       └── Analytics.jsx
│   └── vite.config.js      # proxies /api to Flask port 5000
└── requirements.txt
```

## Getting started

You need a Spotify app. Go to the [Spotify developer dashboard](https://developer.spotify.com/dashboard), create an app, and add `http://127.0.0.1:8888/callback` as a redirect URI. Copy the client ID and secret.

**1. Set up the Python environment:**

```bash
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

**2. Add your credentials to `.env`:**

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback
```

**3. Install frontend dependencies:**

```bash
cd client
npm install
```

**4. Run both servers:**

In one terminal:
```bash
python app.py
```

In another terminal:
```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser. The first run will open a Spotify login page — after that the token is cached locally.

## Notes

Spotify restricted several endpoints for new apps in November 2024 (audio features, recommendations, related artists). Everything here uses only what's still available: top tracks, top artists, recently played, now playing, and basic metadata.
