import { useState } from 'react'

const RANGES = [
  { label: '4 Weeks', value: 'short_term' },
  { label: '6 Months', value: 'medium_term' },
  { label: 'All Time', value: 'long_term' },
]

export default function TopArtists({ initial }) {
  const [range, setRange] = useState('medium_term')
  const [artists, setArtists] = useState(initial)
  const [loading, setLoading] = useState(false)

  async function switchRange(r) {
    if (r === range) return
    setRange(r)
    setLoading(true)
    try {
      const res = await fetch(`/api/top-artists?time_range=${r}`)
      setArtists(await res.json())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Top Artists</h2>
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
      <div className="artist-grid">
        {loading && <p className="empty">Loading…</p>}
        {!loading && artists.slice(0, 10).map((a, i) => {
          const img = a.images?.[1]?.url || a.images?.[0]?.url || ''
          return (
            <div key={a.id} className="artist-card">
              <img className="artist-img" src={img} alt="" loading="lazy" />
              <div className="artist-num">#{i + 1}</div>
              <div className="artist-name">{a.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
