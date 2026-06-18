import { useState } from 'react'

const RANGES = [
  { label: '4 Weeks', value: 'short_term' },
  { label: '6 Months', value: 'medium_term' },
  { label: 'All Time', value: 'long_term' },
]

export default function TopTracks({ initial }) {
  const [range, setRange] = useState('medium_term')
  const [tracks, setTracks] = useState(initial)
  const [loading, setLoading] = useState(false)

  async function switchRange(r) {
    if (r === range) return
    setRange(r)
    setLoading(true)
    try {
      const res = await fetch(`/api/top-tracks?time_range=${r}`)
      setTracks(await res.json())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Top Tracks</h2>
        <div className="time-tabs">
          {RANGES.map(r => (
            <button
              key={r.value}
              className={`tab ${range === r.value ? 'active' : ''}`}
              onClick={() => switchRange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="track-list">
        {loading && <p className="empty">Loading…</p>}
        {!loading && tracks.slice(0, 20).map((t, i) => {
          const art = t.album?.images?.[2]?.url || t.album?.images?.[0]?.url || ''
          const artists = (t.artists || []).map(a => a.name).join(', ')
          return (
            <div key={t.id} className="track-row ranked">
              <span className="rank">{i + 1}</span>
              <img className="track-art" src={art} alt="" loading="lazy" />
              <div className="track-info">
                <div className="track-name">{t.name}</div>
                <div className="track-artist">{artists}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
