import React, { useState } from 'react'
import useSpeechToText from '../hooks/useSpeechToText'

export default function STTPanel(){
  const { listening, transcript, startListening, stopListening, error, level } = useSpeechToText()
  const [exported, setExported] = useState('')
  
  React.useEffect(() => {
    console.log('[STTPanel] render transcript:', transcript);
  }, [transcript]);

  const handleCopy = () => {
    if (!transcript) return
    navigator.clipboard.writeText(transcript)
      .then(() => {
        alert('✓ Copied to clipboard!')
      })
      .catch(() => {
        alert('Failed to copy')
      })
  }

  return (
    <div>
      {/* Detailed help section */}
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-300 mb-2">
          <strong>💡 How to use:</strong>
        </p>
        <ul className="text-sm text-blue-900 dark:text-blue-300 list-disc ml-5 space-y-1">
          <li>Make sure your microphone is connected and working</li>
          <li>Click "🎤 Start Recording" to begin</li>
          <li>Speak clearly and at a normal pace into your microphone</li>
          <li>Wait a moment after finishing (the system detects when you stop)</li>
          <li>Click "⏹ Stop Recording" to end, or it will auto-stop after silence</li>
        </ul>
      </div>

      {/* VU Meter */}
      <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">🎙️ Microphone Level:</p>
        <div className="w-full h-6 bg-slate-300 dark:bg-slate-700 rounded overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
            style={{ width: `${level * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {level === 0 ? '🔇 Silent' : level < 0.3 ? '🔉 Quiet' : level < 0.7 ? '🔊 Good' : '📢 Loud'}
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            <strong>⚠️ Issue:</strong> {error}
          </p>
          {error.includes('No speech detected') && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              💡 <strong>Try:</strong> Check the VU meter above. If it's silent, your microphone isn't picking up audio. Check Windows Sound settings or browser site settings (🔒 icon).
            </p>
          )}
          {error.includes('Microphone access blocked') && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              💡 <strong>Try:</strong> Click the 🔒 icon in the address bar → Allow microphone → Reload page.
            </p>
          )}
        </div>
      )}

      {/* Control buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[160px]">
          <button 
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              listening 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-md' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
            }`} 
            onClick={listening ? stopListening : startListening}
            title={listening ? 'Stop recording' : 'Start recording'}
          >
              {listening ? (
              <>
                <span className="inline-block animate-pulse" aria-hidden="true">●</span>
                <span>⏹ Stop Recording</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">🎤</span>
                <span>Start Recording</span>
              </>
            )}
          </button>
        </div>

        <div className="flex-1 min-w-[120px]">
          <button 
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={handleCopy}
            disabled={!transcript}
            title="Copy transcript to clipboard"
          >
            <span aria-hidden="true">📋</span>
            <span>Copy</span>
          </button>
        </div>

        <div className="flex-1 min-w-[120px]">
          <button 
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={()=>setExported(transcript)}
            disabled={!transcript}
            title="Export to Text-to-Speech"
          >
            <span aria-hidden="true">🔊</span>
            <span>Export to TTS</span>
          </button>
        </div>

        <div className="flex-1 min-w-[120px]">
          <button 
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={() => window.location.reload()}
            disabled={!transcript}
            title="Clear transcript"
          >
            <span aria-hidden="true">🗑️</span>
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Live status */}
      {listening && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="inline-block animate-pulse text-2xl">🎙️</span>
            <div>
              <p className="font-semibold text-green-900 dark:text-green-300">Listening...</p>
              <p className="text-sm text-green-800 dark:text-green-200">Speak clearly into your microphone. System will detect when you pause.</p>
            </div>
          </div>
        </div>
      )}

      {/* Transcript display */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          📝 Your Transcript:
        </label>
        <textarea 
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm" 
          rows={8} 
          value={transcript} 
          readOnly 
          aria-label="STT transcript" 
          placeholder="🎤 Press 'Start Recording', speak clearly, then the text will appear here..."
        />
        {/* Debug: raw transcript value */}
        <pre className="mt-2 p-2 text-xs bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 rounded">raw transcript: {JSON.stringify(transcript)}</pre>
      </div>

      {/* Success message */}
      {exported && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
          <h4 className="font-semibold text-green-900 dark:text-green-300">✓ Ready for TTS</h4>
          <p className="text-sm text-green-800 dark:text-green-200">Go to the TTS page to hear this text read aloud.</p>
        </div>
      )}

      {/* Word/character count */}
      {transcript && !listening && (
        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300">
          <strong>📊 Statistics:</strong> {transcript.length} characters | {transcript.split(/\s+/).filter(w => w.length > 0).length} words
        </div>
      )}
    </div>
  )
}
