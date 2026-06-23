/**
 * EmotionCard Component
 * Displays the detected emotion result with emoji, confidence, and message.
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

function EmotionCard({ result }) {
  if (!result) {
    return (
      <div className="emotion-placeholder">
        <div className="placeholder-icon">📷</div>
        <p>Capture a photo to detect your emotion</p>
      </div>
    )
  }

  const emoji = EMOTION_EMOJIS[result.emotion] || '🤔'

  return (
    <div className="emotion-result-card">
      <div className="emotion-emoji">{emoji}</div>
      <div className="emotion-label">{result.emotion}</div>
      <div className="emotion-confidence">{result.confidence}% confidence</div>
      <div className="emotion-message">"{result.message}"</div>
    </div>
  )
}

export default EmotionCard
