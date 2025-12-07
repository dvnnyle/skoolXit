import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import NavigationMenu from '../widget/navigationMenu'
import CelebrationBackground from '../../components/CelebrationBackground'
import questionsData from '../../../dataBank/modul2c.json'
import './modules.css'


const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function Module2c() {
  const [questions] = useState(() => shuffleArray(questionsData))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [streak, setStreak] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerClick = (index) => {
    if (selectedAnswer !== null) return // Already answered

    setSelectedAnswer(index)
    const isCorrect = index === currentQuestion.answerIndex

    // Store the answer
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = { selectedIndex: index, isCorrect }
    setUserAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      const nextAnswer = userAnswers[currentQuestionIndex + 1]
      setSelectedAnswer(nextAnswer ? nextAnswer.selectedIndex : null)
      setAnsweredQuestions(answeredQuestions + 1)
    } else {
      setAnsweredQuestions(answeredQuestions + 1)
      const finalScore = score + (currentQuestion.answerIndex === selectedAnswer ? 1 : 0)
      
      // Save to localStorage
      const existingData = localStorage.getItem('quiz_module2c')
      const previousData = existingData ? JSON.parse(existingData) : { bestScore: 0, attempts: 0, attemptHistory: [] }
      
      const newAttempt = { score: finalScore, date: new Date().toISOString() }
      const attemptHistory = [...(previousData.attemptHistory || []), newAttempt]
      
      localStorage.setItem('quiz_module2c', JSON.stringify({
        lastScore: finalScore,
        completed: questions.length,
        total: questions.length,
        bestScore: Math.max(finalScore, previousData.bestScore || 0),
        attempts: attemptHistory.length,
        lastAttempt: new Date().toISOString(),
        attemptHistory: attemptHistory
      }))
      
      setShowResult(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      const prevAnswer = userAnswers[currentQuestionIndex - 1]
      setSelectedAnswer(prevAnswer ? prevAnswer.selectedIndex : null)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowReview(false)
    setScore(0)
    setAnsweredQuestions(0)
    setUserAnswers([])
    setStreak(0)
  }

  const handleShowReview = () => {
    setShowReview(true)
  }

  const handleBackToResults = () => {
    setShowReview(false)
  }

  if (showResult) {
    const percentage = ((score / questions.length) * 100).toFixed(1)
    
    if (showReview) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <NavigationMenu />
          <div className="quiz-container">
            <div className="quiz-header">
              <h2>Answer Review - Module 2C</h2>
              <div className="progress-info">
                <span>Score: {score}/{questions.length} ({percentage}%)</span>
              </div>
            </div>

            <div className="review-container">
              {questions.map((question, qIndex) => {
                const userAnswer = userAnswers[qIndex]
                const isCorrect = userAnswer?.isCorrect
                const userSelectedIndex = userAnswer?.selectedIndex

                return (
                  <div key={question.id} className="review-question-card">
                    <div className="review-header">
                      <span className="question-number">Question {qIndex + 1}</span>
                      <span className={`result-badge ${isCorrect ? 'correct-badge' : 'wrong-badge'}`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    
                    <h3 className="question-text">{question.question}</h3>
                    
                    <div className="review-options">
                      {question.options.map((option, optIndex) => {
                        const isCorrectOption = optIndex === question.answerIndex
                        const isUserSelection = optIndex === userSelectedIndex
                        
                        let optionClass = 'review-option'
                        if (isCorrectOption) optionClass += ' correct-option'
                        if (isUserSelection && !isCorrect) optionClass += ' wrong-option'
                        
                        return (
                          <div key={optIndex} className={optionClass}>
                            <span className="option-letter">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className="option-text">{option}</span>
                            {isUserSelection && (
                              <span className="selection-badge">Your answer</span>
                            )}
                            {isCorrectOption && (
                              <span className="correct-badge-mini">Correct</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="review-explanation">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="review-actions">
              <button onClick={handleBackToResults} className="next-button">
                ← Back to Results
              </button>
              <button onClick={handleRestart} className="restart-button">
                Try Again
              </button>
            </div>
          </div>
        </motion.div>
      )
    }
    
    return (
      <>
        <NavigationMenu />
        <CelebrationBackground score={score} total={questions.length} />
        <div className="quiz-container">
          <div className="result-card">
            <h1>Quiz Complete!</h1>
            <div className="score-display">
              <div className="score-number">{score}</div>
              <div className="score-total">out of {questions.length}</div>
            </div>
            <div className="score-percentage">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <div className="button-group">
              <button onClick={handleShowReview} className="next-button" style={{ marginBottom: '10px' }}>
                Review Answers
              </button>
              <button onClick={handleRestart} className="restart-button">
                Try Again
              </button>
              <Link to="/" className="home-link">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationMenu />
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Module 2C: Prosjektkultur</h2>
          <div className="progress-info">
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <div style={{ flex: 1 }}></div>
              {streak >= 2 && (
                <span className="streak-fire" style={{ marginRight: '1.5rem' }}>🔥 {streak}</span>
              )}
              <span>Score: {score}/{answeredQuestions}</span>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="question-card">
          <div className="section-badge">Section {currentQuestion.section}</div>
          <h3 className="question-text">{currentQuestion.question}</h3>
          
          <div className="options-list">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.answerIndex
              const showCorrect = selectedAnswer !== null && isCorrect
              const showWrong = selectedAnswer !== null && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`option-button ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}`}
                  disabled={selectedAnswer !== null}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                  {isSelected && <span className="you-chose">You chose</span>}
                </button>
              )
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="explanation-box">
              <div className="explanation-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Explanation</span>
              </div>
              <div className="correct-answer">
                The correct answer is: {currentQuestion.options[currentQuestion.answerIndex]}
              </div>
              {currentQuestion.shortExplanation && (
                <p 
                  className="short-explanation"
                  dangerouslySetInnerHTML={{ 
                    __html: currentQuestion.shortExplanation.replace(
                      /'([^']+)'/g, 
                      "<span class='highlight'>$1</span>"
                    )
                  }}
                />
              )}
              <p 
                className="explanation-text"
                dangerouslySetInnerHTML={{ 
                  __html: currentQuestion.explanation.replace(
                    /'([^']+)'/g, 
                    "<span class='highlight'>$1</span>"
                  )
                }}
              />
            </div>
          )}

          <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
              <button onClick={handlePrevious} className="previous-button">
                Previous
              </button>
            )}
            <button 
              onClick={handleNext} 
              className="next-button"
              disabled={selectedAnswer === null}
            >
              {selectedAnswer === null ? '🔒 Select an answer' : (currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Module2c
