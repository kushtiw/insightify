# Insightify


A Spotify listening-data analyzer. Pulls your top tracks, top artists, and recently played history from the Spotify API and lets you explore trends with pandas and matplotlib.

## Setup

### 1. Create a Spotify app

1. Go to [Spotify for Developers](https://developer.spotify.com/dashboard) and create a new app.
2. In the app settings, add `http://127.0.0.1:8888/callback` as a Redirect URI.
3. Copy your **Client ID** and **Client Secret**.

### 2. Configure credentials

Edit `.env` and fill in your values:

```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback
```

### 3. Install dependencies

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 4. Run the connection test

```bash
python main.py
```

A browser window will open for Spotify login and permission grant. After authorizing, the terminal will print your Spotify display name.

## Project structure

```
spotlight/
├── src/
│   ├── auth.py       # SpotifyOAuth client setup
│   └── fetch.py      # Data-fetching functions
├── main.py           # Connection test entry point
├── requirements.txt
├── .env              # Credentials (never commit this)
└── .gitignore
```

## Notes

- Spotify deprecated audio-features, audio-analysis, recommendations, and related-artists for new apps (Nov 27, 2024). This project does not use those endpoints.
- The `.cache` token file (created by Spotipy after first login) is excluded from git.
