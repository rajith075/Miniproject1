import React, { useState } from 'react'
import useTextToSpeech from '../hooks/useTextToSpeech'

export default function TTSPanel(){
  const { speak, speaking, cancel } = useTextToSpeech()
  const [text, setText] = useState('')
  const [rate, setRate] = useState(1)

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
        <button 
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            speaking 
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:bg-slate-400'
          }`} 
          onClick={()=>speak(text, {rate})} 
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
