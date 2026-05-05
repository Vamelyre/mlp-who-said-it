import { useEffect, useState } from 'react'
import { QuizQuestion } from './types'

interface QuizProps {
  questions: QuizQuestion[]
}

export function Quiz({ questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)

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
    setAnswered(false)
  }, [currentQuestion, questions])

  const handleAnswerClick = (index: number) => {
    if (answered) return

    setAnswered(true)

    if (index === correctAnswerIndex) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowScore(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
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
      ) : (
        <div className="question-section">
          <div className="question-counter">
            <span>Question {currentQuestion + 1}</span>
          </div>
          <p>Difficulty: {questions[currentQuestion].difficulty}</p>

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
