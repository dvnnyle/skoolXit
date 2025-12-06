import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Statistics from './pages/Statistics'
import Module1a from './pages/moduleChapters/module1a'
import Module1b from './pages/moduleChapters/module1b'
import Module2a from './pages/moduleChapters/module2a'
import Module2b from './pages/moduleChapters/module2b'
import Module2c from './pages/moduleChapters/module2c'
import Module3a from './pages/moduleChapters/module3a'
import Module3b from './pages/moduleChapters/module3b'
import Module3c from './pages/moduleChapters/module3c'
import Module4a from './pages/moduleChapters/module4a'
import Module4b from './pages/moduleChapters/module4b'
import Module5a from './pages/moduleChapters/module5a'
import Module5b from './pages/moduleChapters/module5b'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/module1a" element={<Module1a />} />
        <Route path="/module1b" element={<Module1b />} />
        <Route path="/module2a" element={<Module2a />} />
        <Route path="/module2b" element={<Module2b />} />
        <Route path="/module2c" element={<Module2c />} />
        <Route path="/module3a" element={<Module3a />} />
        <Route path="/module3b" element={<Module3b />} />
        <Route path="/module3c" element={<Module3c />} />
        <Route path="/module4a" element={<Module4a />} />
        <Route path="/module4b" element={<Module4b />} />
        <Route path="/module5a" element={<Module5a />} />
        <Route path="/module5b" element={<Module5b />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
