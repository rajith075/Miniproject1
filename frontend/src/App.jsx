import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import STTPage from './pages/STTPage'
import TTSPage from './pages/TTSPage'
import OCRPage from './pages/OCRPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <header className="bg-white dark:bg-slate-800 shadow">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Assistive Platform</h1>
            <div className="flex items-center gap-4">
              <nav className="space-x-4 hidden sm:block">
                <NavLink to="/" className={({isActive}) => isActive ? 'font-semibold' : ''}>Home</NavLink>
                <NavLink to="/stt" className={({isActive}) => isActive ? 'font-semibold' : ''}>STT</NavLink>
                <NavLink to="/tts" className={({isActive}) => isActive ? 'font-semibold' : ''}>TTS</NavLink>
                <NavLink to="/ocr" className={({isActive}) => isActive ? 'font-semibold' : ''}>OCR</NavLink>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stt" element={<STTPage />} />
            <Route path="/tts" element={<TTSPage />} />
            <Route path="/ocr" element={<OCRPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <footer className="text-center py-6 text-sm text-gray-500">
          © Assistive Platform • Built with React + Tailwind
        </footer>
      </div>
    </BrowserRouter>
  )
}

function ThemeToggle(){
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark' } catch { return false }
  })

  useEffect(() => {
    const root = document.documentElement
    if(dark) {
      root.classList.add('dark')
      try { localStorage.setItem('theme','dark') } catch {}
    } else {
      root.classList.remove('dark')
      try { localStorage.setItem('theme','light') } catch {}
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="px-3 py-1 rounded border bg-white dark:bg-slate-700 text-sm"
      aria-pressed={dark}
      aria-label="Toggle dark mode"
    >
      {dark ? 'Dark' : 'Light'}
    </button>
  )
}
