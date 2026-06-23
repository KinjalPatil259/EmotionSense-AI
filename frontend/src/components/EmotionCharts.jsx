/**
 * EmotionCharts Component
 * Displays a Bar chart of scans over the last 7 days on the Dashboard.
 */

import React, { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement)

function EmotionCharts({ history }) {
  // --- Last 7 days bar chart data ---
  const barData = useMemo(() => {
    const days = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().slice(0, 10))
    }

    const dayLabels = days.map(d => {
      const dt = new Date(d + 'T00:00:00')
      return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    })

    const countsPerDay = days.map(day =>
      history.filter(h => {
        const hDate = new Date(h.timestamp || h.created_at || h.date)
        return hDate.toISOString().slice(0, 10) === day
      }).length
    )

    return { dayLabels, countsPerDay }
  }, [history])

  const chartFont = {
    family: "'Poppins', sans-serif",
  }

  const barConfig = {
    data: {
      labels: barData.dayLabels,
      datasets: [{
        label: 'Scans',
        data: barData.countsPerDay,
        backgroundColor: 'rgba(107, 142, 35, 0.6)',
        borderColor: '#7DA32A',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(125, 163, 42, 0.8)',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#162D1F',
          titleColor: '#E8F5E9',
          bodyColor: '#A8C5AB',
          borderColor: '#2A4A34',
          borderWidth: 1,
          titleFont: { ...chartFont, size: 13, weight: '600' },
          bodyFont: { ...chartFont, size: 12 },
          padding: 12,
          cornerRadius: 10,
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(42, 74, 52, 0.4)', drawBorder: false },
          ticks: { color: '#6D8F70', font: { ...chartFont, size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(42, 74, 52, 0.4)', drawBorder: false },
          ticks: {
            color: '#6D8F70',
            font: { ...chartFont, size: 11 },
            stepSize: 1,
            precision: 0,
          },
        },
      },
    },
  }

  if (history.length === 0) {
    return (
      <div className="card chart-card" style={{ marginBottom: '2rem' }}>
        <div className="card-title">Scans (Last 7 Days)</div>
        <div className="chart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.3}}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          <p>No activity yet — your weekly scan chart will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card chart-card" style={{ marginBottom: '2rem' }}>
      <div className="card-title">Scans (Last 7 Days)</div>
      <div className="chart-wrapper bar-wrapper">
        <Bar {...barConfig} />
      </div>
    </div>
  )
}

export default EmotionCharts
