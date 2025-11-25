import React, { createContext, useState, useEffect, useContext } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }){
  const defaultLang = (() => {
    try { return localStorage.getItem('app_lang') || navigator.language || 'en-US' } catch { return 'en-US' }
  })()
  const [lang, setLang] = useState(defaultLang)

  useEffect(() => {
    try { localStorage.setItem('app_lang', lang) } catch {}
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(){
  return useContext(LanguageContext)
}

export default LanguageContext
