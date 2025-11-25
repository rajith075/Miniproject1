import React, { useState, useEffect } from 'react'
import useTextToSpeech from '../hooks/useTextToSpeech'
import { useLanguage } from '../context/LanguageContext'

export default function TTSPanel(){
  const { lang } = useLanguage()
  const { speak, speaking, cancel } = useTextToSpeech()
  const [text, setText] = useState('')
  const [rate, setRate] = useState(1)
  const [voices, setVoices] = useState([])
  const [voiceURI, setVoiceURI] = useState(() => {
    try { return localStorage.getItem('tts_voice') || '' } catch { return '' }
  })

  useEffect(() => {
    if(typeof window === 'undefined') return
    const synth = window.speechSynthesis
    const update = () => {
      const v = synth.getVoices() || []
      setVoices(v)
      // if no saved voice, try to pick voice matching lang
      if(!voiceURI && v.length) {
        const match = v.find(x => x.lang === lang) || v.find(x => x.lang && x.lang.startsWith(lang.split('-')[0]))
        if(match) setVoiceURI(match.voiceURI || match.name)
      }
    }
    update()
    synth.onvoiceschanged = update
    return () => { try { synth.onvoiceschanged = null } catch(e){} }
  }, [lang, voiceURI])

  useEffect(()=>{
    try { localStorage.setItem('tts_voice', voiceURI) } catch {}
  }, [voiceURI])

  return (
    <div>
      <textarea 
        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4" 
        rows={6} 
        value={text} 
        onChange={(e)=>setText(e.target.value)} 
        placeholder="Paste or type text to read aloud..." 
      />

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Speed</label>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={rate} 
            onChange={(e)=>setRate(Number(e.target.value))}
            className="w-24 accent-indigo-600"
          />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-8">{rate.toFixed(1)}x</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Voice</label>
          <select value={voiceURI} onChange={(e)=>setVoiceURI(e.target.value)} className="px-2 py-1 rounded border bg-white dark:bg-slate-800 text-sm">
            <option value="">(default)</option>
            {voices.map(v=> (
              <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>{v.name} — {v.lang}</option>
            ))}
          </select>
        </div>

        <button 
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            speaking 
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:bg-slate-400'
          }`} 
          onClick={()=>speak(text, {rate, lang, voiceURI})} 
          disabled={speaking || !text.trim()}
        >
          {speaking ? '▶ Playing' : '▶ Play'}
        </button>
        <button 
          className={`px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg font-medium transition-colors ${
            speaking 
              ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400' 
              : 'text-slate-500 dark:text-slate-400 cursor-not-allowed'
          }`}
          onClick={cancel} 
          disabled={!speaking}
        >
          ⏹ Stop
        </button>
      </div>
    </div>
  )
}
