import { useState } from 'react'
import { Quiz } from './Quiz'
import { quizData } from './quizData'
import './App.css'
import logo from '../media/My_Little_Pony_Friendship_is_Magic_logo.svg.png'

function App() {
  const [showStart, setShowStart] = useState(true)

  return (
    <div className="app">
      <img
        className="app-logo"
        src={logo}
        alt="Quiz logo"
        onClick={() => setShowStart(true)}
        style={{ cursor: 'pointer' }}
      />
      <main className="app-main">
        <Quiz questions={quizData} start={showStart} onStartChange={setShowStart} />
      </main>
    </div>
  )
}

export default App




