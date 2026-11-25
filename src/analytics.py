import pandas as pd
from dateutil.tz import tzlocal

DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


def compute_analytics(plays: list[dict]) -> dict:
    """Process stored plays into chart-ready aggregations.

    Args:
        plays: Rows from db.load_plays() (played_at, artist_name, duration_ms).

    Returns:
        Dict with hourly, daily and top_artists counts plus a summary of the period.
    """
    if not plays:
        return {
            'hourly': {str(h): 0 for h in range(24)},
            'daily': {d: 0 for d in DAY_ORDER},
            'top_artists': {},
            'summary': {'plays': 0, 'minutes': 0, 'first_played': None, 'last_played': None},
        }

    df = pd.DataFrame(plays)
    # Spotify timestamps are UTC; convert to this machine's local time (DST-aware)
    # so "hour of day" and "day of week" match when you actually listened.
    df['played_at'] = pd.to_datetime(df['played_at'], utc=True, format='ISO8601').dt.tz_convert(tzlocal())
    df['artist_name'] = df['artist_name'].fillna('Unknown')

    hourly = df.groupby(df['played_at'].dt.hour).size()
    daily = df.groupby(df['played_at'].dt.day_name()).size()
    top_artists = df['artist_name'].value_counts().head(10)

    return {
        'hourly': {str(h): int(hourly.get(h, 0)) for h in range(24)},
        'daily': {d: int(daily.get(d, 0)) for d in DAY_ORDER},
        'top_artists': {k: int(v) for k, v in top_artists.items()},
        'summary': {
            'plays': len(df),
            'minutes': int(df['duration_ms'].fillna(0).sum() // 60000),
            'first_played': df['played_at'].min().isoformat(),
            'last_played': df['played_at'].max().isoformat(),
        },
    }
