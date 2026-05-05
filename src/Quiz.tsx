import { useEffect, useState } from 'react'
import { QuizQuestion } from './types'
import './Quiz.css'
import fluttershyPause from '../media/fluttershyPause.gif'
import acedGif from '../media/aced.gif'
import failGif from '../media/fail.gif'
import decorationGif from '../media/decoration.gif'

interface QuizProps {
  questions: QuizQuestion[]
  start: boolean
  onStartChange: (showStart: boolean) => void
}

export function Quiz({ questions, start, onStartChange }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizVersion, setQuizVersion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 720px)')
    const updateIsMobile = () => setIsMobile(mediaQuery.matches)

    updateIsMobile()
    mediaQuery.addEventListener('change', updateIsMobile)
    return () => mediaQuery.removeEventListener('change', updateIsMobile)
  }, [])

  const getTimeForDifficulty = (difficulty: string) => {
    if (difficulty === 'easy') return 10
    if (difficulty === 'medium') return 8
    return 6
  }

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(getTimeForDifficulty(questions[0].difficulty))

  const advanceToNextQuestion = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowScore(true)
    }
  }

  const shuffleOptions = (options: string[]) => {
    const shuffled = [...options]
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = shuffled[i]
      shuffled[i] = shuffled[j]
      shuffled[j] = temp
    }
    return shuffled
  }

  useEffect(() => {
    const question = questions[currentQuestion]
    const nextOptions = shuffleOptions(question.options)
    setShuffledOptions(nextOptions)
    setCorrectAnswerIndex(nextOptions.indexOf(question.characer))
    setTimeLeft(getTimeForDifficulty(question.difficulty))
    setAnswered(false)
    setSelectedAnswerIndex(null)
  }, [currentQuestion, questions, quizVersion])

  useEffect(() => {
    if (start || showScore || answered || isPaused || timeLeft <= 0) return

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [answered, showScore, isPaused, start, timeLeft])

  useEffect(() => {
    if (!start && !showScore && !isPaused && !answered && timeLeft === 0) {
      setAnswered(true)
      advanceToNextQuestion()
    }
  }, [answered, showScore, isPaused, start, timeLeft])

  const handleSelectOption = (index: number) => {
    if (answered) return
    setSelectedAnswerIndex(index)

    if (isMobile) {
      setAnswered(true)
      if (index === correctAnswerIndex) {
        setScore((s) => s + 1)
      }
      advanceToNextQuestion()
    }
  }

  const handleConfirmAnswer = () => {
    if (answered || selectedAnswerIndex === null) return
    setAnswered(true)

    if (selectedAnswerIndex === correctAnswerIndex) {
      setScore((s) => s + 1)
    }

    advanceToNextQuestion()
  }

  const restartQuiz = () => {
    setQuizVersion((v) => v + 1)
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setIsPaused(false)
    setAnswered(false)
    setSelectedAnswerIndex(null)
    onStartChange(false)
  }

  const totalTime = getTimeForDifficulty(questions[currentQuestion].difficulty)
  const timerPercent = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100))
  const isTimerWarning = timerPercent <= 50
  const isTimerDanger = timerPercent <= 25

  const passThreshold = Math.ceil(questions.length / 2)
  const passed = score >= passThreshold

  return (
    <div className="quiz-container">
      {start ? (
        <div className="start-section">
          <img className="decoration-gif" src={decorationGif} alt="Decoration" />
          <h2>Welcome to the quiz</h2>
          <p className="start-rules">
            Answer each quote correctly before time runs out.
            Click confirm to move to the next question, and use pause if you need a break.
          </p>
          <button className="start-btn" onClick={() => onStartChange(false)}>
            Start Quiz
          </button>
        </div>
      ) : showScore ? (
        <div className="score-section">
          <h2>Quiz Complete!</h2>
          <img
            className="result-gif"
            src={passed ? acedGif : failGif}
            alt={passed ? 'Aced it celebration' : 'Quiz fail reaction'}
          />
          <p className="score">
            You scored <span>{score}</span> out of <span>{questions.length}</span>
          </p>
          <button className="restart-btn" onClick={restartQuiz}>
            Restart Quiz
          </button>
        </div>
      ) : isPaused ? (
        <div className="paused-section">
          <h2>Quiz Paused</h2>
          <img className="pause-gif" src={fluttershyPause} alt="Fluttershy pause" />
          <button onClick={() => setIsPaused(false)}>Resume</button>
        </div>
      ) : (
        <div className="question-section">
          <div
            className={`timer-top-line ${isTimerDanger ? 'danger' : isTimerWarning ? 'warning' : ''}`}
            role="progressbar"
            aria-valuenow={timeLeft}
            aria-valuemin={0}
            aria-valuemax={totalTime}
            aria-label={`Time remaining: ${timeLeft} seconds`}
          >
            <div
              className="timer-top-line-fill"
              style={{ width: `${timerPercent}%` }}
            />
          </div>
          <div className="question-section-body">
            <div className="quiz-topbar">
              <div className="question-counter">
                <span>Question {currentQuestion + 1}</span>
              </div>
              <button className="pause-btn" onClick={() => setIsPaused(true)} aria-label="Pause quiz">
                ⏸
              </button>
            </div>
            <div className="quiz-meta">
              <p>Difficulty: {questions[currentQuestion].difficulty}</p>
            </div>

            <div className="quote-box">
              <blockquote className="quote">
                "{questions[currentQuestion].quote}"
              </blockquote>
              <p className="question-text">Who said this quote?</p>
            </div>

            <div className="answers-section">
              {shuffledOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className={`answer-option ${selectedAnswerIndex === index ? 'answer-option-selected' : ''}`}
                  onClick={() => handleSelectOption(index)}
                  disabled={answered}
                  aria-pressed={selectedAnswerIndex === index}
                >
                  {option}
                </button>
              ))}
            </div>

            {!isMobile && (
              <button
                type="button"
                className="confirm-answer-btn"
                onClick={handleConfirmAnswer}
                disabled={selectedAnswerIndex === null || answered}
              >
                Confirm answer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
