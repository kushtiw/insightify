import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const GREEN = '#1db954'
const GREEN_DIM = 'rgba(29,185,84,0.5)'

const baseOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#282828',
      titleColor: '#fff',
      bodyColor: '#a0a0a0',
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: {
    x: {
      ticks: { color: '#a0a0a0', font: { size: 11 } },
      grid: { color: 'rgba(255,255,255,0.04)' },
    },
    y: {
      ticks: { color: '#a0a0a0', font: { size: 11 }, precision: 0 },
      grid: { color: 'rgba(255,255,255,0.04)' },
    },
  },
}

const RANGES = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: 'All Time', value: 'all' },
]

function formatMinutes(total) {
  const h = Math.floor(total / 60)
  const m = total % 60
  return h ? `${h}h ${m}m` : `${m}m`
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function Summary({ summary }) {
  if (!summary?.plays) {
    return <p className="chart-summary">No plays logged in this period yet.</p>
  }
  return (
    <p className="chart-summary">
      <strong>{summary.plays.toLocaleString()}</strong> plays ·{' '}
      <strong>{formatMinutes(summary.minutes)}</strong> listened · since {formatDate(summary.first_played)}
    </p>
  )
}

export default function Analytics({ initial }) {
  const [range, setRange] = useState('all')
  // Results keyed by range, so a slow response can never overwrite another range's charts.
  const [results, setResults] = useState({})
  const [loadingRange, setLoadingRange] = useState(null)

  async function switchRange(r) {
    if (r === range) return
    setRange(r)
    setLoadingRange(r)
    try {
      const res = await fetch(`/api/analytics?range=${r}`)
      if (res.ok) {
        const json = await res.json()
        setResults(prev => ({ ...prev, [r]: json }))
      }
    } finally {
      setLoadingRange(cur => (cur === r ? null : cur))
    }
  }

  // App loads the 'all' range up front; until a range's own result arrives, keep showing that.
  const data = results[range] ?? initial
  const loading = loadingRange === range

  if (!data) return null

  const hourlyData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [{
      data: Array.from({ length: 24 }, (_, i) => data.hourly[String(i)] || 0),
      backgroundColor: GREEN_DIM,
      hoverBackgroundColor: GREEN,
      borderRadius: 4,
    }],
  }

  const dailyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
        .map(d => data.daily[d] || 0),
      backgroundColor: GREEN_DIM,
      hoverBackgroundColor: GREEN,
      borderRadius: 4,
    }],
  }

  const artistEntries = Object.entries(data.top_artists)
  const topArtistsData = {
    labels: artistEntries.map(([name]) => name),
    datasets: [{
      data: artistEntries.map(([, count]) => count),
      backgroundColor: GREEN_DIM,
      hoverBackgroundColor: GREEN,
      borderRadius: 4,
    }],
  }

  const horizontalOptions = {
    ...baseOptions,
    indexAxis: 'y',
    scales: {
      ...baseOptions.scales,
      x: { ...baseOptions.scales.x, ticks: { ...baseOptions.scales.x.ticks, precision: 0 } },
      y: { ...baseOptions.scales.y, ticks: { color: '#fff', font: { size: 12 } } },
    },
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Listening Patterns</h2>
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
      {loading ? <p className="chart-summary">Loading…</p> : <Summary summary={data.summary} />}
      <div className="chart-grid">
        <div className="chart-card">
          <p className="chart-title">By Hour of Day</p>
          <Bar data={hourlyData} options={baseOptions} />
        </div>
        <div className="chart-card">
          <p className="chart-title">By Day of Week</p>
          <Bar data={dailyData} options={baseOptions} />
        </div>
        {artistEntries.length > 0 && (
          <div className="chart-card full">
            <p className="chart-title">Most Played Artists</p>
            <Bar data={topArtistsData} options={horizontalOptions} />
          </div>
        )}
      </div>
    </div>
  )
}
