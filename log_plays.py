"""Save recently played tracks to data/plays.db.

Spotify only returns the last 50 plays, so run this regularly (about hourly)
to build up a full listening history. Run it from the project root so the
Spotipy token cache (.cache) is found:

    python log_plays.py
"""
from src.auth import get_client
from src.db import DB_PATH, count_plays, get_connection, insert_plays
from src.fetch import get_recently_played


def main():
    sp = get_client()
    items = get_recently_played(sp, limit=50)

    conn = get_connection()
    try:
        added = insert_plays(conn, items)
        total = count_plays(conn)
    finally:
        conn.close()

    print(f"Added {added} new plays ({len(items)} fetched, {total:,} total in {DB_PATH})")


if __name__ == "__main__":
    main()
