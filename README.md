# Insightify

Personal Spotify analytics dashboard. Pulls listening history from the Spotify API and surfaces it in a clean web UI — top tracks, top artists, and recently played, all switchable across time ranges.

Built with Flask on the backend and vanilla JS on the front. No frameworks, no build step.

![black and green minimal UI](https://img.shields.io/badge/stack-Python%20%7C%20Flask%20%7C%20Vanilla%20JS-1db954?style=flat-square)

## Stack

- **Backend** — Python / Flask, Spotipy (Authorization Code flow)
- **Frontend** — HTML, CSS, vanilla JS (no framework)
- **Data** — pandas, matplotlib (for future analysis notebooks)

## Getting started

You'll need a Spotify app. Head to the [developer dashboard](https://developer.spotify.com/dashboard), create one, and add `http://127.0.0.1:8888/callback` as a redirect URI. Grab the client ID and secret from the app settings.

Clone the repo and set up the environment:

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Copy your credentials into `.env`:

```
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback
```

Run it:

```bash
python app.py
```

First run opens a browser for Spotify auth. After that the token is cached locally.

## Notes

Spotify deprecated audio features, audio analysis, recommendations, and related artists for new apps in November 2024 — none of those endpoints are used here. Everything is built around what's still available: top tracks, top artists, recently played, and basic track/artist metadata.
