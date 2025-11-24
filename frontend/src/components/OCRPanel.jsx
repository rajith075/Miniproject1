import React, { useState } from 'react'
import useOCR from '../hooks/useOCR'
import useTextToSpeech from '../hooks/useTextToSpeech'

export default function OCRPanel(){
  const { recognizeImage, loading, result } = useOCR()
  const { speak } = useTextToSpeech()
  const [file, setFile] = useState(null)

  return (
    <div>
      <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-fit">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e)=>{ if(e.target.files && e.target.files[0]) setFile(e.target.files[0]) }}
              className="hidden" 
              id="file-input"
            />
            <label htmlFor="file-input" className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors inline-block">
              📁 Choose Image
            </label>
          </div>
          {file && <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{file.name}</span>}
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              file && !loading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                : 'bg-slate-400 text-white cursor-not-allowed'
            }`}
            onClick={()=>{ if(file) recognizeImage(file) }} 
            disabled={!file || loading}
          >
            {loading ? '⏳ Processing...' : '✨ Process'}
          </button>
        </div>
      </div>

      {loading && <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg text-blue-900 dark:text-blue-300 font-medium">⏳ Processing image...</div>}

      {result && (
        <div className="space-y-3">
          <textarea 
            rows={8} 
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
            value={result} 
            readOnly 
          />
          <button 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition-all"
            onClick={()=>speak(result)}
          >
            🔊 Read Aloud
          </button>
        </div>
      )}
    </div>
  )
}
