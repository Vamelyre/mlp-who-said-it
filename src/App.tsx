import { Quiz } from './Quiz'
import { quizData } from './quizData'
import './App.css'
import logo from '../media/My_Little_Pony_Friendship_is_Magic_logo.svg.png'

function App() {
  return (
    <div className="app">
      <img className="app-logo" src={logo} alt="Quiz logo" />
      <main className="app-main">
        <Quiz questions={quizData} />
      </main>
    </div>
  )
}

export default App




