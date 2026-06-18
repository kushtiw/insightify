import { useEffect, useState } from 'react'
import './App.css'
import NowPlaying from './components/NowPlaying'
import StatCards from './components/StatCards'
import TopTracks from './components/TopTracks'
import TopArtists from './components/TopArtists'
import RecentlyPlayed from './components/RecentlyPlayed'
import Analytics from './components/Analytics'

async function fetchJSON(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(r.statusText)
  return r.json()
}

export default function App() {
  const [user, setUser] = useState(null)
  const [recent, setRecent] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [topTracks, setTopTracks] = useState([])
  const [topArtists, setTopArtists] = useState([])

  useEffect(() => {
    Promise.all([
      fetchJSON('/api/me'),
      fetchJSON('/api/recently-played'),
      fetchJSON('/api/analytics'),
      fetchJSON('/api/top-tracks?time_range=medium_term'),
      fetchJSON('/api/top-artists?time_range=medium_term'),
    ]).then(([u, r, a, t, ar]) => {
      setUser(u)
      setRecent(r)
      setAnalytics(a)
      setTopTracks(t)
      setTopArtists(ar)
    }).catch(console.error)

    const recentTimer = setInterval(async () => {
      const r = await fetchJSON('/api/recently-played').catch(() => null)
      if (r) setRecent(r)
    }, 30000)

    return () => clearInterval(recentTimer)
  }, [])

  return (
    <>
      <nav>
        <div className="nav-inner">
          <span className="logo">Insightify</span>
          <div className="user-pill">
            {user?.images?.[0]?.url && <img src={user.images[0].url} alt="" />}
            <span>{user?.display_name || '...'}</span>
          </div>
        </div>
      </nav>

      <main>
        <NowPlaying />
        <StatCards topTracks={topTracks} topArtists={topArtists} recentCount={recent.length} />
        <TopTracks initial={topTracks} />
        <TopArtists initial={topArtists} />
        <Analytics data={analytics} />
        <RecentlyPlayed items={recent} />
      </main>
    </>
  )
}
