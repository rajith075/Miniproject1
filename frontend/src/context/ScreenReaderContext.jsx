import React, { createContext, useContext, useState, useEffect } from 'react'
import useTextToSpeech from '../hooks/useTextToSpeech'

const ScreenReaderContext = createContext()

export function ScreenReaderProvider({ children }) {
  const { speak, cancel, speaking } = useTextToSpeech()
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem('screenReaderEnabled') !== 'false' } catch { return true }
  })

  // Persist preference
  useEffect(() => {
    try { localStorage.setItem('screenReaderEnabled', String(enabled)) } catch {}
  }, [enabled])

  // Global mouseover and focus listeners
  useEffect(() => {
    if (!enabled) return

    const handleMouseOver = (e) => {
      const target = e.target
      if (target && target.innerText && target.innerText.trim()) {
        speak(target.innerText.trim())
      }
    }

    const handleFocus = (e) => {
      const target = e.target
      if (target && target.innerText && target.innerText.trim()) {
        speak(target.innerText.trim())
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('focusin', handleFocus)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('focusin', handleFocus)
    }
  }, [enabled, speak])

  return (
    <ScreenReaderContext.Provider value={{ enabled, setEnabled, speaking, cancel }}>
      {children}
    </ScreenReaderContext.Provider>
  )
}

export function useScreenReader() {
  const context = useContext(ScreenReaderContext)
  if (!context) {
    throw new Error('useScreenReader must be used within ScreenReaderProvider')
  }
  return context
}
