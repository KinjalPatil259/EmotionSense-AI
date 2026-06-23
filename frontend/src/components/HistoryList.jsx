/**
 * HistoryList Component
 * Displays a scrollable list of past emotion detection entries.
 */

import React from 'react'

// Emoji mapping for each emotion
const EMOTION_EMOJIS = {
  Angry: '😠',
  Disgust: '🤢',
  Fear: '😨',
  Happy: '😊',
  Sad: '😢',
  Surprise: '😲',
  Neutral: '😐',
}

function formatTime(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

function HistoryList({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <p>No emotion history yet. Start by detecting an emotion!</p>
      </div>
    )
  }

  return (
    <div className="history-list">
      {history.map((item) => (
        <div key={item.id} className="history-item">
          <span className="history-emoji">
            {EMOTION_EMOJIS[item.emotion] || '🤔'}
          </span>
          <div className="history-details">
            <div className="history-emotion">{item.emotion}</div>
            <div className="history-message">{item.message}</div>
          </div>
          <div className="history-meta">
            <div className="history-confidence">{item.confidence}%</div>
            <div className="history-time">{formatTime(item.timestamp)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HistoryList
