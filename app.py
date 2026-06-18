from flask import Flask, jsonify, render_template, request
from src.auth import get_client
from src.fetch import get_top_tracks, get_top_artists, get_recently_played
from src.analytics import compute_analytics

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


@app.route('/api/analytics')
def api_analytics():
    recent = get_recently_played(sp, limit=50)
    return jsonify(compute_analytics(recent))


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
