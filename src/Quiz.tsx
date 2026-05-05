import { useEffect, useState } from 'react'
import { QuizQuestion } from './types'
import './Quiz.css'

interface QuizProps {
  questions: QuizQuestion[]
}

export function Quiz({ questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  const getTimeForDifficulty = (difficulty: string) => {
    if (difficulty === 'easy') return 10
    if (difficulty === 'medium') return 8
    return 5
  }

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
  }, [currentQuestion, questions])

  useEffect(() => {
    if (showScore || answered || isPaused || timeLeft <= 0) return

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [answered, showScore, isPaused, timeLeft])

  useEffect(() => {
    if (!showScore && !isPaused && !answered && timeLeft === 0) {
      setAnswered(true)
      advanceToNextQuestion()
    }
  }, [answered, showScore, isPaused, timeLeft])

  const handleAnswerClick = (index: number) => {
    if (answered) return

    setAnswered(true)

    if (index === correctAnswerIndex) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    advanceToNextQuestion()
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setIsPaused(false)
    setAnswered(false)
  }

  return (
    <div className="quiz-container">
      {showScore ? (
        <div className="score-section">
          <h2>Quiz Complete!</h2>
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
          <button onClick={() => setIsPaused(false)}>Resume</button>
        </div>
      ) : (
        <div className="question-section">
          <div className="quiz-topbar">
            <div className="question-counter">
              <span>Question {currentQuestion + 1}</span>
            </div>
            <button className="pause-btn" onClick={() => setIsPaused(true)}>
              Pause
            </button>
          </div>
          <div className="quiz-meta">
            <p>Difficulty: {questions[currentQuestion].difficulty}</p>
            <p>Time left: {timeLeft}s</p>
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
                onClick={() => handleAnswerClick(index)}
                disabled={answered}
              >
                {option}
              </button>
            ))}
          </div>

          {answered && (
            <button className="next-btn" onClick={handleNextQuestion}>
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
