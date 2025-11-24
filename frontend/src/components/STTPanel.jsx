import React, { useState } from 'react'
import useSpeechToText from '../hooks/useSpeechToText'

export default function STTPanel(){
  const { listening, transcript, startListening, stopListening, error } = useSpeechToText()
  const [exported, setExported] = useState('')

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button 
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            listening 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-md' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
          }`} 
          onClick={listening ? stopListening : startListening}
        >
          {listening ? '⏹ Stop' : '🎤 Start'}
        </button>
        <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors" onClick={()=>navigator.clipboard.writeText(transcript)}>📋 Copy</button>
        <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors" onClick={()=>setExported(transcript)}>🔊 Export to TTS</button>
      </div>

      <textarea className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent" rows={8} value={transcript} readOnly aria-label="STT transcript" placeholder="Your speech transcript will appear here..." />

      {error && <p className="text-sm text-red-600 dark:text-red-400 mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</p>}

      {exported && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
          <h4 className="font-semibold text-green-900 dark:text-green-300">✓ Exported to TTS</h4>
          <p className="text-sm text-green-800 dark:text-green-200">The text is ready in the TTS panel or copy from above.</p>
        </div>
      )}
    </div>
  )
}
