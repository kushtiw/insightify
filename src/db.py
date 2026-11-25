import sqlite3
from pathlib import Path

# Resolved from this file's location so the app and scripts share one database
# no matter which directory they are launched from.
DB_PATH = Path(__file__).resolve().parent.parent / "data" / "plays.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS plays (
    played_at   TEXT PRIMARY KEY,
    track_id    TEXT,
    track_name  TEXT,
    artist_name TEXT,
    album_name  TEXT,
    duration_ms INTEGER
)
"""


def get_connection(db_path: Path = DB_PATH) -> sqlite3.Connection:
    """Open the plays database, creating the data directory and table if needed."""
    db_path = Path(db_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute(SCHEMA)
    return conn


def _to_row(item: dict) -> tuple:
    """Convert a Spotify play history object into a plays table row."""
    track = item["track"]
    artists = track.get("artists") or []
    return (
        item["played_at"],
        track.get("id"),
        track.get("name"),
        # First artist only, matching how analytics.py counts artists.
        artists[0]["name"] if artists else "Unknown",
        (track.get("album") or {}).get("name"),
        track.get("duration_ms"),
    )


def insert_plays(conn: sqlite3.Connection, items: list[dict]) -> int:
    """Insert play history items, skipping ones already stored.

    Args:
        conn: Open connection from get_connection().
        items: Play history objects from get_recently_played().

    Returns:
        Number of plays that were newly added.
    """
    before = conn.total_changes
    with conn:
        conn.executemany(
            "INSERT OR IGNORE INTO plays "
            "(played_at, track_id, track_name, artist_name, album_name, duration_ms) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            [_to_row(item) for item in items],
        )
    return conn.total_changes - before


def count_plays(conn: sqlite3.Connection) -> int:
    """Return the total number of plays stored."""
    return conn.execute("SELECT COUNT(*) FROM plays").fetchone()[0]


def load_plays(conn: sqlite3.Connection, since: str | None = None) -> list[dict]:
    """Return stored plays, oldest first.

    Args:
        conn: Open connection from get_connection().
        since: Optional UTC timestamp in Spotify's format (e.g. '2026-11-01T00:00:00.000Z');
            only plays at or after it are returned.

    Returns:
        List of dicts with played_at, track_name, artist_name and duration_ms.
    """
    query = "SELECT played_at, track_name, artist_name, duration_ms FROM plays"
    params: tuple = ()
    if since:
        query += " WHERE played_at >= ?"
        params = (since,)
    query += " ORDER BY played_at"
    cursor = conn.execute(query, params)
    columns = [c[0] for c in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]
