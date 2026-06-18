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

export default function Analytics({ data }) {
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
      </div>
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
            <p className="chart-title">Most Played Artists (Recent)</p>
            <Bar data={topArtistsData} options={horizontalOptions} />
          </div>
        )}
      </div>
    </div>
  )
}
