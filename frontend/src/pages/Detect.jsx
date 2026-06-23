/**
 * Detect Page
 * Webcam capture + emotion detection + result display.
 */

import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import EmotionCard from '../components/EmotionCard'
import PredictionsBreakdown from '../components/PredictionsBreakdown'

import { API_BASE_URL } from '../config'

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
}

function Detect({ user, onLogout }) {
  const webcamRef = useRef(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cameraReady, setCameraReady] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  // Capture image and send to API
  const captureAndDetect = useCallback(async () => {
    if (!webcamRef.current) return

    setError('')
    setLoading(true)

    try {
      // Capture screenshot from webcam
      const imageSrc = webcamRef.current.getScreenshot()

      if (!imageSrc) {
        setError('Failed to capture image. Please ensure camera is working.')
        setLoading(false)
        return
      }

      // Send to Flask API
      const res = await axios.post(`${API_BASE_URL}/detect-emotion`, {
        user_id: user.id,
        image: imageSrc,
      })

      setResult(res.data)
    } catch (err) {
      const msg = err.response?.data?.error || 'Detection failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        {/* Mobile header */}
        {/* <div className="mobile-header">
          <button
            className="mobile-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div> */}

        <div className="page-header">
          <h1>Detect Emotion</h1>
          <p>Position your face in the camera and click capture to analyze your emotion.</p>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <div className="detect-layout">
          {/* Camera Section */}
          <div className="camera-section">
            <div className="camera-title">
              <span>📷</span> Camera Feed
            </div>

            <div className="camera-wrapper">
              {isCameraOn ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onUserMedia={() => setCameraReady(true)}
                    onUserMediaError={() => setError('Camera access denied. Please allow camera permissions.')}
                    style={{ width: '100%', display: 'block' }}
                  />
                  {cameraReady && (
                    <div className="camera-status">
                      <span className="dot" />
                      Live
                    </div>
                  )}
                </>
              ) : (
                <div className="camera-off-placeholder">
                  <span>📷</span>
                  <p>Camera is turned off</p>
                </div>
              )}
            </div>

            <div className="camera-controls horizontal">
              <button
                className="btn btn-capture"
                onClick={captureAndDetect}
                disabled={loading || !cameraReady || !isCameraOn}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                    Analyzing...
                  </>
                ) : (
                  '📸  Capture & Detect'
                )}
              </button>

              <button
                className={`btn ${isCameraOn ? 'btn-danger' : 'btn-success'}`}
                onClick={() => {
                  setIsCameraOn(!isCameraOn)
                  if (isCameraOn) setCameraReady(false)
                }}
                disabled={loading}
              >
                {isCameraOn ? '🛑  Stop Camera' : '🟢  Start Camera'}
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="result-section">
            <EmotionCard result={result} />
            {result && (
              <PredictionsBreakdown
                predictions={result.all_predictions}
                topEmotion={result.emotion}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Detect
