import React from 'react'
import STTPanel from '../components/STTPanel'
import ScreenReaderPanel from '../components/ScreenReaderPanel'

export default function STTPage(){
  return (
    <div className="space-y-6 pb-8">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🎤</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Speech → Text (STT)</h2>
        </div>
        <STTPanel />
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Screen Reader</h3>
        <ScreenReaderPanel />
      </div>
    </div>
  )
}
