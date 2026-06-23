/**
 * HistoryTable Component
 * Displays emotion history in a clean, modern table format.
 */

import React from 'react'

const EMOTION_EMOJIS = {
  Angry: '😡',
  Disgust: '😒',
  Fear: '😟',
  Happy: '😁',
  Sad: '😔',
  Surprise: '😮',
  Neutral: '🙂',
}

function formatDateTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function HistoryTable({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="empty-table-state">
        <p>No detections yet — start a scan to see your history.</p>
      </div>
    )
  }

  return (
    <div className="history-table-container">
      <table className="history-table">
        <thead>
          <tr>
            <th>DATE & TIME</th>
            <th>EMOTION</th>
            <th>CONFIDENCE</th>
            <th>MESSAGE</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td className="time-col">{formatDateTime(item.timestamp)}</td>
              <td className="emot-col">
                <span className="emoji">{EMOTION_EMOJIS[item.emotion] || '🤔'}</span>
                {item.emotion}
              </td>
              <td className="conf-col">
                <span className="confidence-badge">{item.confidence}%</span>
              </td>
              <td className="msg-col">{item.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTable
