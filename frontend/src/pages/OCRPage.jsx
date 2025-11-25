import React from 'react'
import OCRPanel from '../components/OCRPanel'

export default function OCRPage(){
  return (
    <div className="pb-8">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">📸</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Image → Text + Read-Aloud (OCR)</h2>
        </div>
        <OCRPanel />
      </div>
    </div>
  )
}
