import pandas as pd


def compute_analytics(recently_played: list[dict]) -> dict:
    """Process recently played tracks into chart-ready aggregations."""
    if not recently_played:
        return {'hourly': {}, 'daily': {}, 'top_artists': {}}

    df = pd.DataFrame([{
        'artist': item['track']['artists'][0]['name'] if item['track']['artists'] else 'Unknown',
        'played_at': pd.to_datetime(item['played_at']),
    } for item in recently_played])

    df['hour'] = df['played_at'].dt.hour
    df['day'] = df['played_at'].dt.day_name()

    hourly = df.groupby('hour').size()
    hourly_out = {str(h): int(hourly.get(h, 0)) for h in range(24)}

    day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    daily = df.groupby('day').size()
    daily_out = {d: int(daily.get(d, 0)) for d in day_order}

    top_artists = df['artist'].value_counts().head(10)
    top_artists_out = {k: int(v) for k, v in top_artists.items()}

    return {
        'hourly': hourly_out,
        'daily': daily_out,
        'top_artists': top_artists_out,
    }
