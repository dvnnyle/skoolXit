import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import Footer from '../pages/widget/footer'
import './Statistics.css'

function Statistics() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    completedQuestions: 0,
    correctAnswers: 0,
    averageScore: 0,
    chapterProgress: []
  })

  useEffect(() => {
    // Load statistics from localStorage - organized by modules
    const quizCategories = {
      module1: [
        { id: 'modul1a', name: 'Module 1A', total: 30 },
        { id: 'modul1b', name: 'Module 1B', total: 30 }
      ],
      module2: [
        { id: 'modul2a', name: 'Module 2A', total: 25 },
        { id: 'modul2b', name: 'Module 2B', total: 25 },
        { id: 'modul2c', name: 'Module 2C', total: 25 }
      ],
      module3: [
        { id: 'modul3a', name: 'Module 3A', total: 25 },
        { id: 'modul3b', name: 'Module 3B', total: 25 },
        { id: 'modul3c', name: 'Module 3C', total: 25 }
      ],
      module4: [
        { id: 'modul4a', name: 'Module 4A', total: 25 },
        { id: 'modul4b', name: 'Module 4B', total: 25 }
      ],
      module5: [
        { id: 'modul5a', name: 'Module 5A', total: 25 },
        { id: 'modul5b', name: 'Module 5B', total: 25 }
      ]
    }

    // Flatten all quizzes for overall stats
    const chapters = [
      ...quizCategories.module1,
      ...quizCategories.module2,
      ...quizCategories.module3,
      ...quizCategories.module4,
      ...quizCategories.module5
    ]

    const chapterProgress = chapters.map(chapter => {
      const storedData = localStorage.getItem(`quiz_${chapter.id}`)
      let attempts = 0
      let bestScore = 0
      let lastScore = 0
      let attemptHistory = []
      let bestAccuracy = 0
      let accuracy = 0

      if (storedData) {
        const parsed = JSON.parse(storedData)
        attempts = parsed.attempts || 0
        bestScore = parsed.bestScore || 0
        lastScore = parsed.lastScore || 0
        attemptHistory = parsed.attemptHistory || []
        bestAccuracy = parsed.bestAccuracy || 0
        accuracy = parsed.accuracy || 0
      }

      return {
        ...chapter,
        attempts,
        bestScore,
        lastScore,
        attemptHistory,
        bestAccuracy,
        accuracy
      }
    })

    const totalQuestions = chapters.reduce((sum, ch) => sum + ch.total, 0)
    const completedQuestions = chapterProgress.reduce((sum, ch) => sum + (ch.attempts > 0 ? ch.total : 0), 0)
    const correctAnswers = chapterProgress.reduce((sum, ch) => sum + ch.lastScore, 0)

    setStats({
      totalQuestions,
      completedQuestions,
      correctAnswers,
      chapterProgress
    })
  }, [])

  const overallPercentage = stats.totalQuestions > 0 
    ? ((stats.completedQuestions / stats.totalQuestions) * 100).toFixed(1)
    : 0

  const accuracyPercentage = stats.completedQuestions > 0
    ? ((stats.correctAnswers / stats.completedQuestions) * 100).toFixed(1)
    : 0

  // Helper function to get gradient color based on percentage (red -> yellow -> green)
  const getGradientColor = (percentage) => {
    if (percentage >= 80) {
      return '#22c55e' // Green
    } else if (percentage >= 60) {
      return '#eab308' // Yellow
    } else {
      return '#ef4444' // Red
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationMenu />
      <div className="statistics-container">
        <div className="stats-header">
          <h1>📊 Your Statistics</h1>
          <p>Track your progress and performance across all modules</p>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-value">{stats.completedQuestions}</div>
              <div className="stat-label">Questions Completed</div>
              <div className="stat-sublabel">out of {stats.totalQuestions}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.correctAnswers}</div>
              <div className="stat-label">Correct Answers</div>
              <div className="stat-sublabel">{accuracyPercentage}% accuracy</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{overallPercentage}%</div>
              <div className="stat-label">Overall Progress</div>
              <div className="stat-sublabel">Keep going!</div>
            </div>
          </div>
        </div>

        <div className="chapter-stats">
          <h2>📚 Module 1</h2>
          <div className="bar-graph-container">
            {stats.chapterProgress.filter(ch => ['modul1a', 'modul1b'].includes(ch.id)).map((chapter) => {
              return (
                <div key={chapter.id} className="bar-graph-item">
                  <div className="bar-graph-label">
                    <span className="chapter-name">{chapter.name}</span>
                    <span className="chapter-score">
                      {chapter.attempts > 0 ? `${chapter.attempts} attempt${chapter.attempts > 1 ? 's' : ''}` : 'Not started'}
                    </span>
                  </div>
                  
                  {chapter.attemptHistory.length > 0 ? (
                    <div className="attempts-graph">
                      {[...chapter.attemptHistory].reverse().map((attempt, reverseIndex) => {
                        const attemptNumber = chapter.attemptHistory.length - reverseIndex
                        const percentage = (attempt.score / chapter.total) * 100
                        const isLatest = reverseIndex === 0
                        const isBest = attempt.score === chapter.bestScore
                        return (
                          <div key={reverseIndex} className="attempt-bar-wrapper">
                            <div className="attempt-percentage">
                              {percentage.toFixed(0)}%
                            </div>
                            <div className="attempt-bar-container">
                              <div 
                                className={`attempt-bar ${isLatest ? 'latest' : ''} ${isBest ? 'best' : ''}`}
                                style={{ 
                                  height: `${percentage}%`,
                                  backgroundColor: getGradientColor(percentage)
                                }}
                              />
                            </div>
                            <div className="attempt-label">
                              <span className="attempt-number">Attempt {attemptNumber}</span>
                              <span className="attempt-score">{attempt.score}/{chapter.total}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="no-attempts">
                      <p>No attempts yet. Start the quiz to see your progress!</p>
                    </div>
                  )}
                  
                  <div className="bar-graph-stats">
                    {chapter.attempts > 0 && (
                      <>
                        <span>Best Score: {chapter.bestScore}/{chapter.total} ({((chapter.bestScore / chapter.total) * 100).toFixed(0)}%)</span>
                        <span>Average: {(chapter.attemptHistory.reduce((sum, att) => sum + att.score, 0) / chapter.attemptHistory.length / chapter.total * 100).toFixed(0)}%</span>
                        <span>Latest: {chapter.lastScore}/{chapter.total}</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="chapter-stats">
          <h2>📚 Module 2</h2>
          <div className="bar-graph-container">
            {stats.chapterProgress.filter(ch => ['modul2a', 'modul2b', 'modul2c'].includes(ch.id)).map((chapter) => {
              return (
                <div key={chapter.id} className="bar-graph-item">
                  <div className="bar-graph-label">
                    <span className="chapter-name">{chapter.name}</span>
                    <span className="chapter-score">
                      {chapter.attempts > 0 ? `${chapter.attempts} attempt${chapter.attempts > 1 ? 's' : ''}` : 'Not started'}
                    </span>
                  </div>
                  
                  {chapter.attemptHistory.length > 0 ? (
                    <div className="attempts-graph">
                      {[...chapter.attemptHistory].reverse().map((attempt, reverseIndex) => {
                        const attemptNumber = chapter.attemptHistory.length - reverseIndex
                        const percentage = (attempt.score / chapter.total) * 100
                        const isLatest = reverseIndex === 0
                        const isBest = attempt.score === chapter.bestScore
                        return (
                          <div key={reverseIndex} className="attempt-bar-wrapper">
                            <div className="attempt-percentage">
                              {percentage.toFixed(0)}%
                            </div>
                            <div className="attempt-bar-container">
                              <div 
                                className={`attempt-bar ${isLatest ? 'latest' : ''} ${isBest ? 'best' : ''}`}
                                style={{ 
                                  height: `${percentage}%`,
                                  backgroundColor: getGradientColor(percentage)
                                }}
                              />
                            </div>
                            <div className="attempt-label">
                              <span className="attempt-number">Attempt {attemptNumber}</span>
                              <span className="attempt-score">{attempt.score}/{chapter.total}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="no-attempts">
                      <p>No attempts yet. Start the quiz to see your progress!</p>
                    </div>
                  )}
                  
                  <div className="bar-graph-stats">
                    {chapter.attempts > 0 && (
                      <>
                        <span>Best Score: {chapter.bestScore}/{chapter.total} ({((chapter.bestScore / chapter.total) * 100).toFixed(0)}%)</span>
                        <span>Average: {(chapter.attemptHistory.reduce((sum, att) => sum + att.score, 0) / chapter.attemptHistory.length / chapter.total * 100).toFixed(0)}%</span>
                        <span>Latest: {chapter.lastScore}/{chapter.total}</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="chapter-stats">
          <h2>📚 Module 3</h2>
          <div className="bar-graph-container">
            {stats.chapterProgress.filter(ch => ['modul3a', 'modul3b', 'modul3c'].includes(ch.id)).map((chapter) => {
              return (
                <div key={chapter.id} className="bar-graph-item">
                  <div className="bar-graph-label">
                    <span className="chapter-name">{chapter.name}</span>
                    <span className="chapter-score">
                      {chapter.attempts > 0 ? `${chapter.attempts} attempt${chapter.attempts > 1 ? 's' : ''}` : 'Not started'}
                    </span>
                  </div>
                  
                  {chapter.attemptHistory.length > 0 ? (
                    <div className="attempts-graph">
                      {[...chapter.attemptHistory].reverse().map((attempt, reverseIndex) => {
                        const attemptNumber = chapter.attemptHistory.length - reverseIndex
                        const percentage = (attempt.score / chapter.total) * 100
                        const isLatest = reverseIndex === 0
                        const isBest = attempt.score === chapter.bestScore
                        return (
                          <div key={reverseIndex} className="attempt-bar-wrapper">
                            <div className="attempt-percentage">
                              {percentage.toFixed(0)}%
                            </div>
                            <div className="attempt-bar-container">
                              <div 
                                className={`attempt-bar ${isLatest ? 'latest' : ''} ${isBest ? 'best' : ''}`}
                                style={{ 
                                  height: `${percentage}%`,
                                  backgroundColor: getGradientColor(percentage)
                                }}
                              />
                            </div>
                            <div className="attempt-label">
                              <span className="attempt-number">Attempt {attemptNumber}</span>
                              <span className="attempt-score">{attempt.score}/{chapter.total}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="no-attempts">
                      <p>No attempts yet. Start the quiz to see your progress!</p>
                    </div>
                  )}
                  
                  <div className="bar-graph-stats">
                    {chapter.attempts > 0 && (
                      <>
                        <span>Best Score: {chapter.bestScore}/{chapter.total} ({((chapter.bestScore / chapter.total) * 100).toFixed(0)}%)</span>
                        <span>Average: {(chapter.attemptHistory.reduce((sum, att) => sum + att.score, 0) / chapter.attemptHistory.length / chapter.total * 100).toFixed(0)}%</span>
                        <span>Latest: {chapter.lastScore}/{chapter.total}</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="chapter-stats">
          <h2>📚 Module 4</h2>
          <div className="bar-graph-container">
            {stats.chapterProgress.filter(ch => ['modul4a', 'modul4b'].includes(ch.id)).map((chapter) => {
              return (
                <div key={chapter.id} className="bar-graph-item">
                  <div className="bar-graph-label">
                    <span className="chapter-name">{chapter.name}</span>
                    <span className="chapter-score">
                      {chapter.attempts > 0 ? `${chapter.attempts} attempt${chapter.attempts > 1 ? 's' : ''}` : 'Not started'}
                    </span>
                  </div>
                  
                  {chapter.attemptHistory.length > 0 ? (
                    <div className="attempts-graph">
                      {[...chapter.attemptHistory].reverse().map((attempt, reverseIndex) => {
                        const attemptNumber = chapter.attemptHistory.length - reverseIndex
                        const percentage = (attempt.score / chapter.total) * 100
                        const isLatest = reverseIndex === 0
                        const isBest = attempt.score === chapter.bestScore
                        return (
                          <div key={reverseIndex} className="attempt-bar-wrapper">
                            <div className="attempt-percentage">
                              {percentage.toFixed(0)}%
                            </div>
                            <div className="attempt-bar-container">
                              <div 
                                className={`attempt-bar ${isLatest ? 'latest' : ''} ${isBest ? 'best' : ''}`}
                                style={{ 
                                  height: `${percentage}%`,
                                  backgroundColor: getGradientColor(percentage)
                                }}
                              />
                            </div>
                            <div className="attempt-label">
                              <span className="attempt-number">Attempt {attemptNumber}</span>
                              <span className="attempt-score">{attempt.score}/{chapter.total}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="no-attempts">
                      <p>No attempts yet. Start the quiz to see your progress!</p>
                    </div>
                  )}
                  
                  <div className="bar-graph-stats">
                    {chapter.attempts > 0 && (
                      <>
                        <span>Best Score: {chapter.bestScore}/{chapter.total} ({((chapter.bestScore / chapter.total) * 100).toFixed(0)}%)</span>
                        <span>Average: {(chapter.attemptHistory.reduce((sum, att) => sum + att.score, 0) / chapter.attemptHistory.length / chapter.total * 100).toFixed(0)}%</span>
                        <span>Latest: {chapter.lastScore}/{chapter.total}</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="chapter-stats">
          <h2>📚 Module 5</h2>
          <div className="bar-graph-container">
            {stats.chapterProgress.filter(ch => ['modul5a', 'modul5b'].includes(ch.id)).map((chapter) => {
              return (
                <div key={chapter.id} className="bar-graph-item">
                  <div className="bar-graph-label">
                    <span className="chapter-name">{chapter.name}</span>
                    <span className="chapter-score">
                      {chapter.attempts > 0 ? `${chapter.attempts} attempt${chapter.attempts > 1 ? 's' : ''}` : 'Not started'}
                    </span>
                  </div>
                  
                  {chapter.attemptHistory.length > 0 ? (
                    <div className="attempts-graph">
                      {[...chapter.attemptHistory].reverse().map((attempt, reverseIndex) => {
                        const attemptNumber = chapter.attemptHistory.length - reverseIndex
                        const percentage = (attempt.score / chapter.total) * 100
                        const isLatest = reverseIndex === 0
                        const isBest = attempt.score === chapter.bestScore
                        return (
                          <div key={reverseIndex} className="attempt-bar-wrapper">
                            <div className="attempt-percentage">
                              {percentage.toFixed(0)}%
                            </div>
                            <div className="attempt-bar-container">
                              <div 
                                className={`attempt-bar ${isLatest ? 'latest' : ''} ${isBest ? 'best' : ''}`}
                                style={{ 
                                  height: `${percentage}%`,
                                  backgroundColor: getGradientColor(percentage)
                                }}
                              />
                            </div>
                            <div className="attempt-label">
                              <span className="attempt-number">Attempt {attemptNumber}</span>
                              <span className="attempt-score">{attempt.score}/{chapter.total}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="no-attempts">
                      <p>No attempts yet. Start the quiz to see your progress!</p>
                    </div>
                  )}
                  
                  <div className="bar-graph-stats">
                    {chapter.attempts > 0 && (
                      <>
                        <span>Best Score: {chapter.bestScore}/{chapter.total} ({((chapter.bestScore / chapter.total) * 100).toFixed(0)}%)</span>
                        <span>Average: {(chapter.attemptHistory.reduce((sum, att) => sum + att.score, 0) / chapter.attemptHistory.length / chapter.total * 100).toFixed(0)}%</span>
                        <span>Latest: {chapter.lastScore}/{chapter.total}</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="chapter-stats">
          <h2>📋 Detailed Progress - All Modules</h2>
          <div className="chapter-stats-list">
            {stats.chapterProgress.map((chapter) => (
              <div key={chapter.id} className="chapter-stat-card">
                <div className="chapter-stat-header">
                  <h3>{chapter.name}</h3>
                  <span className="chapter-stat-score">
                    {chapter.attempts > 0 
                      ? `${chapter.lastScore}/${chapter.total} (${((chapter.lastScore / chapter.total) * 100).toFixed(0)}%)`
                      : 'Not started'
                    }
                  </span>
                </div>
                <div className="chapter-progress-bar">
                  <div 
                    className="chapter-progress-fill"
                    style={{ width: `${(chapter.lastScore / chapter.total) * 100}%` }}
                  />
                </div>
                <div className="chapter-stat-info">
                  <span>Total: {chapter.total} questions</span>
                  {chapter.attempts > 0 && (
                    <span className="chapter-accuracy">
                      {chapter.attempts} attempt{chapter.attempts > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-actions">
          <a href="/" className="stats-button primary">
            Continue Learning
          </a>
          <button 
            className="stats-button secondary"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
                stats.chapterProgress.forEach(chapter => {
                  localStorage.removeItem(`quiz_${chapter.id}`)
                })
                window.location.reload()
              }
            }}
          >
            Reset Statistics
          </button>
        </div>
      </div>
      <Footer />
    </motion.div>
  )
}

export default Statistics
