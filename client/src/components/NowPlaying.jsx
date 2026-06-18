import { useEffect, useState } from 'react'

export default function NowPlaying() {
  const [data, setData] = useState(null)

  async function poll() {
    try {
      const r = await fetch('/api/now-playing')
      const json = await r.json()
      setData(json)
    } catch {
      setData(null)
    }
  }

  useEffect(() => {
    poll()
    const t = setInterval(poll, 5000)
    return () => clearInterval(t)
  }, [])

  if (!data) return null

  const pct = Math.min(100, Math.round((data.progress_ms / data.duration_ms) * 100))

  return (
    <div className="now-playing">
      <span className="np-dot" />
      <span className="np-label">Now Playing</span>
      {data.album_art && <img className="np-art" src={data.album_art} alt="" />}
      <div className="np-info">
        <div className="np-name">{data.name}</div>
        <div className="np-artist">{data.artists.join(', ')}</div>
      </div>
      <div className="np-bar-wrap">
        <div className="np-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
