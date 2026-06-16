import os
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth

load_dotenv()

SCOPES = " ".join([
    "user-top-read",
    "user-read-recently-played",
    "user-read-currently-playing",
    "user-library-read",
    "playlist-read-private",
])


def get_client() -> spotipy.Spotify:
    """Return an authenticated Spotipy client using Authorization Code flow."""
    client_id = os.environ["SPOTIFY_CLIENT_ID"]
    client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]
    redirect_uri = os.environ["SPOTIFY_REDIRECT_URI"]

    auth_manager = SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope=SCOPES,
    )
    return spotipy.Spotify(auth_manager=auth_manager)
