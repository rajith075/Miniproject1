import React, { useEffect, useState } from 'react'
import { getSupportedLanguages } from '../lib/api'

export default function LanguageSelector({ value, onChange }){
  const [langs, setLangs] = useState({})

  // Allowed languages: enforce the five requested codes
  const ALLOWED = {
    'en-US': 'English',
    'kn-IN': 'Kannada',
    'hi-IN': 'Hindi',
    'ta-IN': 'Tamil',
    'te-IN': 'Telugu'
  }

  useEffect(()=>{
    let mounted = true
    getSupportedLanguages().then(res => {
      if(mounted && res && res.languages) {
        // Filter to allowed languages only (defensive)
        const incoming = res.languages || {}
        const filtered = {}
        Object.keys(ALLOWED).forEach(code => {
          if(incoming[code]) filtered[code] = incoming[code]
          else filtered[code] = ALLOWED[code]
        })
        setLangs(filtered)
      }
    }).catch(()=>{})
    return ()=> { mounted = false }
  }, [])

  return (
    <select
      value={value}
      onChange={(e)=> onChange?.(e.target.value) }
      className="px-2 py-1 rounded border bg-white dark:bg-slate-800 text-sm"
      aria-label="Choose language"
    >
      {Object.keys(langs).length === 0 && (
        // fallback: show allowed languages
        Object.entries(ALLOWED).map(([code,label])=> (
          <option key={code} value={code}>{label} ({code})</option>
        ))
      )}
      {Object.entries(langs).map(([code,label])=> (
        <option key={code} value={code}>{label} ({code})</option>
      ))}
    </select>
  )
}
