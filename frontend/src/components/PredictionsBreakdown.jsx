/**
 * PredictionsBreakdown Component
 * Shows bar chart of all emotion prediction percentages.
 */

import React from 'react'

function PredictionsBreakdown({ predictions, topEmotion }) {
  if (!predictions) return null

  // Sort predictions by value descending
  const sorted = Object.entries(predictions).sort((a, b) => b[1] - a[1])

  return (
    <div className="predictions-card">
      <div className="card-title">Prediction Breakdown</div>
      {sorted.map(([emotion, value]) => (
        <div className="prediction-bar" key={emotion}>
          <span className="bar-label">{emotion}</span>
          <div className="bar-track">
            <div
              className={`bar-fill ${emotion === topEmotion ? 'top' : ''}`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="bar-value">{value}%</span>
        </div>
      ))}
    </div>
  )
}

export default PredictionsBreakdown
