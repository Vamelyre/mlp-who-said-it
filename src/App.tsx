import { Quiz } from './Quiz'
import { quizData } from './quizData'

function App() {
  return (
    <div className="app">
      <main className="app-main">
        <Quiz questions={quizData} />
      </main>
    </div>
  )
}

export default App
