function timeAgo(iso) {
  const secs = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (secs < 60) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

export default function RecentlyPlayed({ items }) {
  if (!items.length) return null

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Recently Played</h2>
      </div>
      <div className="track-list">
        {items.slice(0, 20).map((item, i) => {
          const t = item.track
          const art = t.album?.images?.[2]?.url || t.album?.images?.[0]?.url || ''
          const artists = (t.artists || []).map(a => a.name).join(', ')
          return (
            <div key={i} className="track-row recent">
              <img className="track-art" src={art} alt="" loading="lazy" />
              <div className="track-info">
                <div className="track-name">{t.name}</div>
                <div className="track-artist">{artists}</div>
              </div>
              <span className="recent-time">{timeAgo(item.played_at)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
