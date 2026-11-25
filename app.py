from datetime import datetime, timedelta, timezone

from flask import Flask, jsonify, render_template, request
from src.auth import get_client
from src.fetch import get_top_tracks, get_top_artists, get_recently_played
from src.analytics import compute_analytics
from src.db import get_connection, insert_plays, load_plays

app = Flask(__name__)
sp = get_client()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/me')
def api_me():
    return jsonify(sp.current_user())


@app.route('/api/top-tracks')
def api_top_tracks():
    time_range = request.args.get('time_range', 'medium_term')
    return jsonify(get_top_tracks(sp, limit=50, time_range=time_range))


@app.route('/api/top-artists')
def api_top_artists():
    time_range = request.args.get('time_range', 'medium_term')
    return jsonify(get_top_artists(sp, limit=50, time_range=time_range))


@app.route('/api/recently-played')
def api_recently_played():
    return jsonify(get_recently_played(sp, limit=50))


ANALYTICS_RANGES = {'7d': 7, '30d': 30, 'all': None}


@app.route('/api/analytics')
def api_analytics():
    range_key = request.args.get('range', 'all')
    if range_key not in ANALYTICS_RANGES:
        return jsonify({'error': f"range must be one of {', '.join(ANALYTICS_RANGES)}"}), 400

    conn = get_connection()
    try:
        # Save the latest plays first so the charts are current and history
        # keeps growing whenever the dashboard is open.
        try:
            insert_plays(conn, get_recently_played(sp, limit=50))
        except Exception:
            app.logger.exception('Could not fetch recently played; using stored history only')

        days = ANALYTICS_RANGES[range_key]
        since = None
        if days:
            cutoff = datetime.now(timezone.utc) - timedelta(days=days)
            since = cutoff.strftime('%Y-%m-%dT%H:%M:%S.000Z')
        plays = load_plays(conn, since=since)
    finally:
        conn.close()

    result = compute_analytics(plays)
    result['range'] = range_key
    return jsonify(result)


@app.route('/api/now-playing')
def api_now_playing():
    try:
        result = sp.currently_playing()
    except Exception:
        return jsonify(None)
    if not result or not result.get('is_playing') or not result.get('item'):
        return jsonify(None)
    item = result['item']
    return jsonify({
        'name': item['name'],
        'artists': [a['name'] for a in item.get('artists', [])],
        'album_art': (item.get('album', {}).get('images') or [{}])[0].get('url'),
        'progress_ms': result.get('progress_ms', 0),
        'duration_ms': item.get('duration_ms', 1),
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
