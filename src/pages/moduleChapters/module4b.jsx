import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from '../../../dataBank/modul4b.json';
import './modules.css';

export default function Module4b() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [userAnswers, setUserAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [streak, setStreak] = useState(0);

  const STORAGE_KEY = 'quiz_module4b';

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      setCurrentQuestionIndex(state.currentQuestionIndex || 0);
      setScore(state.score || 0);
      setAnsweredQuestions(new Set(state.answeredQuestions || []));
      setUserAnswers(state.userAnswers || {});
      setStreak(state.streak || 0);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentQuestionIndex,
        score,
        answeredQuestions: Array.from(answeredQuestions),
        userAnswers,
        streak,
      })
    );
  }, [currentQuestionIndex, score, answeredQuestions, userAnswers, streak]);

  const currentQuestion = questionsData[currentQuestionIndex];
  const isAnswered = answeredQuestions.has(currentQuestionIndex);
  const isCorrect = userAnswers[currentQuestionIndex] === currentQuestion.answerIndex;
  const totalAnswered = answeredQuestions.size;
  const percentageCompleted = Math.round((totalAnswered / questionsData.length) * 100);

  const handleAnswerClick = (index) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setShowResult(true);

    // Update answered questions and score
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentQuestionIndex);
    setAnsweredQuestions(newAnswered);

    // Check if answer is correct
    if (index === currentQuestion.answerIndex) {
      const newScore = score + 1;
      setScore(newScore);
      // Update streak
      const newStreak = streak + 1;
      setStreak(newStreak);
    } else {
      // Reset streak on wrong answer
      setStreak(0);
    }

    // Save user answer
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: index,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      setShowReview(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
    setUserAnswers({});
    setShowReview(false);
    setStreak(0);
  };

  const handleShowReview = () => {
    setShowReview(true);
  };

  const handleBackToResults = () => {
    setShowReview(false);
  };

  if (showReview) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Module 4B: Styring, kontroll og fremdrift - Gjennomgang</h2>
          <p className="quiz-subtitle">Se gjennom alle svarene dine</p>
        </div>

        <div className="review-container">
          {questionsData.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isUserCorrect = userAnswer === question.answerIndex;

            return (
              <div key={index} className="review-item">
                <div className="review-question">
                  <span className="review-number">Spørsmål {index + 1}</span>
                  <p className="review-question-text">{question.question}</p>
                  <span className={`section-badge ${index % 3 === 0 ? 'badge-blue' : index % 3 === 1 ? 'badge-green' : 'badge-purple'}`}>
                    {question.section}
                  </span>
                </div>

                <div className="review-answer">
                  <p className="review-answer-label">Ditt svar:</p>
                  <div
                    className={`review-answer-box ${isUserCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <span className="answer-text">
                      {question.options[userAnswer]}
                    </span>
                    <span className="answer-status">
                      {isUserCorrect ? '✓ Riktig' : '✗ Feil'}
                    </span>
                  </div>
                </div>

                {!isUserCorrect && (
                  <div className="review-answer">
                    <p className="review-answer-label">Riktig svar:</p>
                    <div className="review-answer-box correct">
                      <span className="answer-text">
                        {question.options[question.answerIndex]}
                      </span>
                      <span className="answer-status">✓ Riktig</span>
                    </div>
                  </div>
                )}

                <div className="review-explanation">
                  <p className="explanation-label">Forklaring:</p>
                  <p className="explanation-text">{question.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="button-group">
          <button className="btn btn-secondary" onClick={handleBackToResults}>
            Tilbake til resultater
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (totalAnswered === questionsData.length) {
    const percentage = Math.round((score / questionsData.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className={`quiz-container ${passed ? 'passed' : 'failed'}`}>
        {passed && (
          <div className="celebration-background">
            <div className="confetti"></div>
          </div>
        )}

        <div className="results-container">
          <div className="results-header">
            <h2>Resultat!</h2>
            <p className="results-subtitle">Du fullførte quizen</p>
          </div>

          <div className="results-score">
            <div className="score-circle">
              <div className="score-text">
                <span className="score-percentage">{percentage}%</span>
                <span className="score-label">riktig</span>
              </div>
            </div>
            <p className="score-info">
              {score} av {questionsData.length} spørsmål besvart riktig
            </p>
          </div>

          {passed && (
            <div className="passed-message">
              <p>🎉 Gratulerer! Du har bestått quizen!</p>
            </div>
          )}

          {!passed && (
            <div className="failed-message">
              <p>Prøv igjen! Du er nær målet ditt!</p>
            </div>
          )}

          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleShowReview}>
              Se gjennomgang
            </button>
            <button className="btn btn-primary" onClick={handleRestart}>
              Start på nytt
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/')}
            >
              Hjem
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Module 4B: Styring, kontroll og fremdrift i prosjekter</h2>
        <p className="quiz-subtitle">20 spørsmål om ledelse, kontroll og fremdrift</p>
        <div className="quiz-info">
          <span className="info-item">
            Spørsmål {currentQuestionIndex + 1}/{questionsData.length}
          </span>
          <span className={`info-item streak ${streak >= 2 ? 'active' : ''}`}>
            {streak >= 2 && '🔥'} {streak > 0 && `Streak: ${streak}`}
          </span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${percentageCompleted}%`,
            }}
          ></div>
        </div>
        <p className="progress-text">{totalAnswered} av {questionsData.length} besvart</p>
      </div>

      <div className="question-card">
        <span className="section-badge" style={{
          backgroundColor: currentQuestionIndex % 3 === 0 ? '#3b82f6' : currentQuestionIndex % 3 === 1 ? '#10b981' : '#8b5cf6'
        }}>
          {currentQuestion.section}
        </span>
        <h3>{currentQuestion.question}</h3>
      </div>

      <div className="options-container">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              isAnswered
                ? index === currentQuestion.answerIndex
                  ? 'correct'
                  : index === selectedAnswer
                    ? 'incorrect'
                    : ''
                : selectedAnswer === index
                  ? 'selected'
                  : ''
            }`}
            onClick={() => handleAnswerClick(index)}
            disabled={isAnswered}
          >
            <span className="option-label">{String.fromCharCode(65 + index)}.</span>
            <span className="option-text">{option}</span>
            {isAnswered && index === currentQuestion.answerIndex && (
              <span className="option-status">✓</span>
            )}
            {isAnswered && index === selectedAnswer && index !== currentQuestion.answerIndex && (
              <span className="option-status">✗</span>
            )}
          </button>
        ))}
      </div>

      {showResult && (
        <div className="explanation-box">
          <div className="explanation-header">
            <span className={isCorrect ? 'correct-label' : 'incorrect-label'}>
              {isCorrect ? '✓ Korrekt!' : '✗ Feil svar'}
            </span>
          </div>
          <div className="explanation-content">
            <p className="short-explanation">{currentQuestion.shortExplanation}</p>
            <p className="full-explanation">{currentQuestion.explanation}</p>
          </div>
        </div>
      )}

      <div className="button-group">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Forrige
        </button>
        {totalAnswered < questionsData.length ? (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isAnswered}
          >
            Neste
          </button>
        ) : (
          <button className="btn btn-success" onClick={handleNext}>
            Se resultater
          </button>
        )}
      </div>
    </div>
  );
}
