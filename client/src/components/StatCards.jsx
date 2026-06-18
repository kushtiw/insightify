export default function StatCards({ topTracks, topArtists, recentCount }) {
  const topArtist = topArtists[0]?.name || '—'
  const topTrack = topTracks[0]?.name || '—'
  const uniqueArtists = new Set(topTracks.flatMap(t => (t.artists || []).map(a => a.id))).size

  return (
    <div className="stats-row">
      <div className="stat-card">
        <span className="stat-label">Top Artist</span>
        <span className={`stat-value ${topArtist.length > 12 ? 'sm' : ''}`}>{topArtist}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Top Track</span>
        <span className={`stat-value ${topTrack.length > 12 ? 'sm' : ''}`}>{topTrack}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Artists in Mix</span>
        <span className="stat-value">{uniqueArtists || '—'}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Recent Plays</span>
        <span className="stat-value">{recentCount || '—'}</span>
      </div>
    </div>
  )
}
