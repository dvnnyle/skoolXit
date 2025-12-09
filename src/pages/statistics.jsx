import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import Footer from '../pages/widget/footer'
import './statistics.css'

function Statistics() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    completedQuestions: 0,
    correctAnswers: 0,
    totalCorrectFromAllAttempts: 0,
    averageScore: 0,
    chapterProgress: []
  })

  const loadStats = () => {
    // Load statistics from localStorage - organized by modules
    const quizCategories = {
      module1: [
        { id: 'module1a', name: 'Module 1A', total: 39 },
        { id: 'module1b', name: 'Module 1B', total: 16 }
      ],
      module2: [
        { id: 'module2a', name: 'Module 2A', total: 24 },
        { id: 'module2b', name: 'Module 2B', total: 24 },
        { id: 'module2c', name: 'Module 2C', total: 21 }
      ],
      module3: [
        { id: 'module3a', name: 'Module 3A', total: 22 },
        { id: 'module3b', name: 'Module 3B', total: 21 },
        { id: 'module3c', name: 'Module 3C', total: 20 }
      ],
      module4: [
        { id: 'module4a', name: 'Module 4A', total: 19 },
        { id: 'module4b', name: 'Module 4B', total: 20 }
      ],
      module5: [
        { id: 'module5a', name: 'Module 5A', total: 25 },
        { id: 'module5b', name: 'Module 5B', total: 25 }
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
      let questionsAnswered = 0
      let attemptHistory = []
      let bestAccuracy = 0
      let accuracy = 0

      if (storedData) {
        const parsed = JSON.parse(storedData)
        attempts = parsed.attempts || 0
        bestScore = parsed.bestScore || 0
        lastScore = parsed.lastScore || 0
        questionsAnswered = parsed.questionsAnswered || 0
        attemptHistory = parsed.attemptHistory || []
        bestAccuracy = parsed.bestAccuracy || 0
        accuracy = parsed.accuracy || 0
        
        // If questionsAnswered field doesn't exist in old data but we have attempts, use total
        // This handles old data that doesn't have questionsAnswered field
        if (!parsed.questionsAnswered && attempts > 0) {
          questionsAnswered = chapter.total
        }
        
        // If lastScore is still 0 but we have attempt history, use the last attempt's score
        if (lastScore === 0 && attemptHistory.length > 0) {
          lastScore = attemptHistory[attemptHistory.length - 1].score || 0
        }
      }

      return {
        ...chapter,
        attempts,
        bestScore,
        lastScore,
        questionsAnswered,
        attemptHistory,
        bestAccuracy,
        accuracy
      }
    })

    const totalQuestions = chapters.reduce((sum, ch) => sum + ch.total, 0)
    const completedQuestions = chapterProgress.reduce((sum, ch) => sum + ch.attempts, 0)
    const correctAnswers = chapterProgress.reduce((sum, ch) => sum + ch.lastScore, 0)
    // Calculate total correct answers from ALL attempts across all quizzes
    const totalCorrectFromAllAttempts = chapterProgress.reduce((sum, ch) => {
      return sum + (ch.attemptHistory?.reduce((attSum, att) => attSum + (att.score || 0), 0) || 0)
    }, 0)

    setStats({
      totalQuestions,
      completedQuestions,
      correctAnswers,
      totalCorrectFromAllAttempts,
      chapterProgress
    })
  }

  useEffect(() => {
    // Load stats on mount
    loadStats()

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = () => {
      loadStats()
    }
    window.addEventListener('storage', handleStorageChange)

    // Also listen for page visibility change to refresh when returning to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadStats()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
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
              <div className="stat-value">{accuracyPercentage}%</div>
              <div className="stat-label">Accuracy</div>
              <div className="stat-sublabel">{stats.correctAnswers} out of {stats.completedQuestions}</div>
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

        <div className="medals-progress-card">
          <div className="medals-progress-left">
            <div className="progress-stat">
              <span className="progress-label">Questions Completed</span>
              <span className="progress-value">{stats.completedQuestions}</span>
            </div>
            <div className="progress-stat">
              <span className="progress-label">All-Time Correct Answer</span>
              <span className="progress-value">{stats.totalCorrectFromAllAttempts}</span>
            </div>
            <div className="progress-stat">
              <span className="progress-label">Accuracy</span>
              <span className="progress-value">{accuracyPercentage}%</span>
            </div>
            <div className="progress-stat">
              <span className="progress-label">Overall Progress</span>
              <span className="progress-value">{overallPercentage}%</span>
            </div>
          </div>
          
          <div className="medals-progress-right">
            <h3>🏆 Medal Progress</h3>
            <div className="medal-milestone">
              <img src="/icons/bronze-medal.svg" alt="Bronze Medal" className={`medal-icon-stats ${stats.totalCorrectFromAllAttempts >= 100 ? 'unlocked' : ''}`} />
              <div className="medal-milestone-info">
                <p>Bronze: 100 correct answers</p>
                <div className="milestone-bar">
                  <div className="milestone-fill" style={{ width: `${Math.min((Math.max(0, stats.totalCorrectFromAllAttempts) / 100) * 100, 100)}%` }}></div>
                </div>
                <span className="milestone-text">{Math.min(Math.max(0, stats.totalCorrectFromAllAttempts), 100)}/100</span>
              </div>
            </div>
            
            <div className="medal-milestone">
              <img src="/icons/silver-medal.svg" alt="Silver Medal" className={`medal-icon-stats ${stats.totalCorrectFromAllAttempts >= 250 ? 'unlocked' : ''}`} />
              <div className="medal-milestone-info">
                <p>Silver: 250 correct answers</p>
                <div className="milestone-bar">
                  <div className="milestone-fill" style={{ width: `${Math.min((Math.max(0, stats.totalCorrectFromAllAttempts) / 250) * 100, 100)}%` }}></div>
                </div>
                <span className="milestone-text">{Math.min(Math.max(0, stats.totalCorrectFromAllAttempts), 250)}/250</span>
              </div>
            </div>
            
            <div className="medal-milestone">
              <img src="/icons/gold-medal.svg" alt="Gold Medal" className={`medal-icon-stats ${stats.totalCorrectFromAllAttempts >= 500 ? 'unlocked' : ''}`} />
              <div className="medal-milestone-info">
                <p>Gold: 500 correct answers</p>
                <div className="milestone-bar">
                  <div className="milestone-fill" style={{ width: `${Math.min((Math.max(0, stats.totalCorrectFromAllAttempts) / 500) * 100, 100)}%` }}></div>
                </div>
                <span className="milestone-text">{Math.min(Math.max(0, stats.totalCorrectFromAllAttempts), 500)}/500</span>
              </div>
            </div>
            
            <div className="medal-milestone">
              <img src="/icons/emerald.svg" alt="Emerald" className={`medal-icon-stats ${stats.totalCorrectFromAllAttempts >= 750 ? 'unlocked' : ''}`} />
              <div className="medal-milestone-info">
                <p>Emerald: 750 correct answers</p>
                <div className="milestone-bar">
                  <div className="milestone-fill" style={{ width: `${Math.min((Math.max(0, stats.totalCorrectFromAllAttempts) / 750) * 100, 100)}%` }}></div>
                </div>
                <span className="milestone-text">{Math.min(Math.max(0, stats.totalCorrectFromAllAttempts), 750)}/750</span>
              </div>
            </div>
            
            <div className="medal-milestone">
              <img src="/icons/platinum.svg" alt="Platinum" className={`medal-icon-stats ${stats.totalCorrectFromAllAttempts >= 1000 ? 'unlocked' : ''}`} />
              <div className="medal-milestone-info">
                <p>Platinum: 1000 correct answers</p>
                <div className="milestone-bar">
                  <div className="milestone-fill" style={{ width: `${Math.min((Math.max(0, stats.totalCorrectFromAllAttempts) / 1000) * 100, 100)}%` }}></div>
                </div>
                <span className="milestone-text">{Math.min(Math.max(0, stats.totalCorrectFromAllAttempts), 1000)}/1000</span>
              </div>
            </div>
            
            <div className="medal-milestone">
              <img src="/icons/diamond.svg" alt="Diamond" className={`medal-icon-stats ${stats.totalCorrectFromAllAttempts >= 1234 ? 'unlocked' : ''}`} />
              <div className="medal-milestone-info">
                <p>Diamond: 1234 correct answers</p>
                <div className="milestone-bar">
                  <div className="milestone-fill" style={{ width: `${Math.min((Math.max(0, stats.totalCorrectFromAllAttempts) / 1234) * 100, 100)}%` }}></div>
                </div>
                <span className="milestone-text">{Math.min(Math.max(0, stats.totalCorrectFromAllAttempts), 1234)}/1234</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chapter-stats">
          <h2>📚 Module 1</h2>
          <div className="bar-graph-container">
            {stats.chapterProgress.filter(ch => ['module1a', 'module1b'].includes(ch.id)).map((chapter) => {
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
            {stats.chapterProgress.filter(ch => ['module2a', 'module2b', 'module2c'].includes(ch.id)).map((chapter) => {
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
            {stats.chapterProgress.filter(ch => ['module3a', 'module3b', 'module3c'].includes(ch.id)).map((chapter) => {
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
            {stats.chapterProgress.filter(ch => ['module4a', 'module4b'].includes(ch.id)).map((chapter) => {
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
            {stats.chapterProgress.filter(ch => ['module5a', 'module5b'].includes(ch.id)).map((chapter) => {
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
                    style={{ width: `${chapter.attempts > 0 ? (chapter.lastScore / chapter.total) * 100 : 0}%` }}
                  />
                </div>
                <div className="chapter-stat-info">
                  <span>Total: {chapter.total} questions</span>
                  {chapter.attempts > 0 && (
                    <>
                      <span className="chapter-accuracy">
                        Completed: {chapter.lastScore}/{chapter.total}
                      </span>
                      <span className="chapter-accuracy">
                        {chapter.attempts} attempt{chapter.attempts > 1 ? 's' : ''}
                      </span>
                    </>
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
