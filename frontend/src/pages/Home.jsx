/**
 * Home Page (Landing Page)
 * Simple, welcoming introduction with calling options.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Emotion Logo.png'

function Home() {
  return (
    <div className="landing-container">
      <div className="hero-section">
        <div className="app-logo">
          <img src={logo} alt="Emotion Analysis Logo" />
        </div>
        <h1>Intelligent Facial Emotion Analysis</h1>
        <p className="hero-subtitle">
          Understand your moods, enhance your wellbeing, and find your forest calm.
        </p>

        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary">
            Get Started
          </Link>

          <div className="hero-value-bar">
            <div className="value-item">
              <span className="v-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </span>
              <div className="v-text">
                <strong>Privacy First</strong>
                <span>Secure local-only processing. Your facial data never leaves your device. </span>
              </div>
            </div>
            <div className="v-divider"></div>
            <div className="value-item">
              <span className="v-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <line x1="9" y1="1" x2="9" y2="4"></line>
                  <line x1="15" y1="1" x2="15" y2="4"></line>
                  <line x1="9" y1="20" x2="9" y2="23"></line>
                  <line x1="15" y1="20" x2="15" y2="23"></line>
                  <line x1="20" y1="9" x2="23" y2="9"></line>
                  <line x1="20" y1="15" x2="23" y2="15"></line>
                  <line x1="1" y1="9" x2="4" y2="9"></line>
                  <line x1="1" y1="15" x2="4" y2="15"></line>
                </svg>
              </span>
              <div className="v-text">
                <strong>Advanced AI</strong>
                <span>Powered by MobileNetV2 Neural Engine for high-precision 48-point facial landmark detection. </span>
              </div>
            </div>
            <div className="v-divider"></div>
            <div className="value-item">
              <span className="v-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </span>
              <div className="v-text">
                <strong>Mood Care</strong>
                <span>Personalized support and motivation tailored to your emotional state.</span>
              </div>
            </div>
            <div className="v-divider"></div>
            <div className="value-item">
              <span className="v-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </span>
              <div className="v-text">
                <strong>Real-time</strong>
                <span>Instant discovery with zero-latency live facial landmark analysis.</span>
              </div>
            </div>
            <div className="v-divider"></div>
            <div className="value-item">
              <span className="v-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </span>
              <div className="v-text">
                <strong>Trends</strong>
                <span>Long-term tracking for data-driven mental wellbeing insights.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="info-section">
        <h2 className="section-title">Why Emotion Analysis?</h2>
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              {/* Brain / Intelligence Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
              </svg>
            </div>
            <h3>Deep Emotional Intelligence</h3>
            <p>Our advanced AI algorithms go beyond simple snapshots. We analyze micro-expressions and subtle facial shifts to provide a comprehensive understanding of your emotional state.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              {/* Activity / Trends Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3>Long-term Behavioral Trends</h3>
            <p>True self-awareness comes from seeing the big picture. By tracking your emotions over days, weeks, and months, you can visualize how different environments impact your mood.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              {/* Sparkles / Enhancement Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
              </svg>
            </div>
            <h3>Personalized Mood Enhancement</h3>
            <p>Based on your real-time analysis, our system provides tailored recommendations—ranging from quick mindfulness exercises to nature-inspired calming techniques.</p>
          </div>
        </div>
      </section>

      <section className="info-section alt-bg">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-flow">
          <div className="step-block">
            <div className="step-number">1</div>
            <h3>Instant Capture</h3>
            <p>Initiate a secure session through your browser. Our system uses your webcam to focus on key facial landmarks. Your privacy is our priority: the analysis happens in real-time, and no images or videos are ever uploaded or stored on our servers.</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-block">
            <div className="step-number">2</div>
            <h3>Neural Analysis</h3>
            <p>Our sophisticated CNN (Convolutional Neural Network) model, trained on thousands of diverse facial datasets, instantly interprets 48 distinct points on your face. It identifies 7 core emotions with high accuracy, providing a scientific basis for your emotional feedback.</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-block">
            <div className="step-number">3</div>
            <h3>Actionable Feedback</h3>
            <p>Get immediate results coupled with personalized "Forest Calm" suggestions. Whether it's a motivational quote, a breathing exercise, or a calming visual, the system provides exactly what you need to navigate your current emotional state effectively.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2 className="section-title">Your Path to Wellbeing</h2>
        <div className="benefits-container">
          <div className="benefit-card-open">
            <span className="check">✓</span>
            <div className="benefit-content">
              <h4>Uncompromising Privacy</h4>
              <p>We believe your emotions are personal. Our "Privacy by Design" approach ensures that all facial processing stays local to your session. We only store anonymized numerical data for your history logs, which you can delete at any time.</p>
            </div>
          </div>
          <div className="benefit-card-open">
            <span className="check">✓</span>
            <div className="benefit-content">
              <h4>Advanced AI Architecture</h4>
              <p>Built using industry-standard deep learning frameworks and a refined MobileNetV2 architecture. Our model is optimized for both accuracy and speed, ensuring you get professional-grade analysis in seconds.</p>
            </div>
          </div>
          <div className="benefit-card-open">
            <span className="check">✓</span>
            <div className="benefit-content">
              <h4>Holistic Mood Tracking</h4>
              <p>Integration with your personal history allows for a holistic view of your mental health. By logging your moods daily, you build a powerful dataset that can be used for therapy check-ins or personal reflection.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="enhanced-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="app-logo-small">
              <img src={logo} alt="Emotion Analysis Logo" />
            </div>
            <h3>Intelligent Emotion Analysis</h3>
            <p>Empowering self-awareness through advanced AI technology.</p>
          </div>

          <div className="footer-cta">
            <h4>Ready to start your journey?</h4>
            <div className="footer-actions">
              <Link to="/login" className="btn btn-primary">Get Started Now</Link>
              <Link to="/register" className="btn btn-secondary">Join the Community</Link>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h5>Platform</h5>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/detect">Real-time Detect</Link>
            </div>
            <div className="link-group">
              <h5>Resources</h5>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Documentation</a>
            </div>
            <div className="link-group">
              <h5>Connect</h5>
              <a href="#">About Us</a>
              <a href="#">Contact</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Intelligent Facial Emotion Analysis and Mood Enhancement System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}



export default Home
