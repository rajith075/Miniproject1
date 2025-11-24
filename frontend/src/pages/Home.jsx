import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div id="home" className="space-y-8 pb-8">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Assistive Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/stt" className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🎤</span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Speech → Text</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Live transcription from microphone with export options.</p>
          </Link>

          <Link to="/tts" className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🔊</span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Text → Speech</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Paste or type text and listen with adjustable rate and voice options.</p>
          </Link>

          <Link to="/ocr" className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">📸</span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Image → Text</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Upload images to extract text and read aloud.</p>
          </Link>
        </div>
      </section>

      <section>
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg shadow-md border-l-4 border-indigo-600">
          <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Screen Reader Demo</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300">Use the screen reader on any page to hover or focus text to have it read aloud. Great for accessibility testing.</p>
        </div>
      </section>
    </div>
  )
}
