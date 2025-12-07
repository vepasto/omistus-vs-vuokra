import './App.css'
import { Calculator } from './components/Calculator'

function App() {
  return (
    <>
      <h1>Omistus vs Vuokra</h1>
      <Calculator />
      <footer className="footer">
        Vibe coded by <a href="https://github.com/vepasto" target="_blank" rel="noopener noreferrer">@vepasto</a>
      </footer>
    </>
  )
}

export default App
