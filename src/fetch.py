import spotipy


def get_top_tracks(sp: spotipy.Spotify, limit: int = 50, time_range: str = "medium_term") -> list[dict]:
    """Fetch the current user's top tracks.

    Args:
        sp: Authenticated Spotipy client.
        limit: Number of tracks to return (1–50).
        time_range: 'short_term' (4 weeks), 'medium_term' (6 months), or 'long_term' (all time).

    Returns:
        List of track objects from the Spotify API.
    """
    pass


def get_top_artists(sp: spotipy.Spotify, limit: int = 50, time_range: str = "medium_term") -> list[dict]:
    """Fetch the current user's top artists.

    Args:
        sp: Authenticated Spotipy client.
        limit: Number of artists to return (1–50).
        time_range: 'short_term' (4 weeks), 'medium_term' (6 months), or 'long_term' (all time).

    Returns:
        List of artist objects from the Spotify API, each including genres and popularity.
    """
    pass


def get_recently_played(sp: spotipy.Spotify, limit: int = 50) -> list[dict]:
    """Fetch the current user's recently played tracks.

    Args:
        sp: Authenticated Spotipy client.
        limit: Number of items to return (1–50).

    Returns:
        List of play history objects, each containing a 'track' and 'played_at' timestamp.
    """
    pass
