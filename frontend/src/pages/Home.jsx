import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div id="home" className="space-y-8 pb-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-extrabold mb-2 text-slate-900 dark:text-white">Assistive Platform</h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">A small collection of accessibility tools — Speech-to-Text, Text-to-Speech and OCR — built for quick testing and demos.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/stt" className="flex flex-col p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all border border-slate-200 dark:border-slate-700 h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3 text-2xl"><span aria-hidden="true">🎤</span></div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Speech → Text</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Live transcription from your microphone with export and copy options.</p>
              </div>
            </div>
            <div className="mt-auto">
              <span className="inline-block px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">Try it</span>
            </div>
          </Link>

          <Link to="/tts" className="flex flex-col p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all border border-slate-200 dark:border-slate-700 h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3 text-2xl"><span aria-hidden="true">🔊</span></div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Text → Speech</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Type or paste text and hear it read aloud with voice controls.</p>
              </div>
            </div>
            <div className="mt-auto">
              <span className="inline-block px-3 py-2 bg-amber-600 text-white rounded-md text-sm">Open</span>
            </div>
          </Link>

          <Link to="/ocr" className="flex flex-col p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all border border-slate-200 dark:border-slate-700 h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-3 text-2xl"><span aria-hidden="true">📸</span></div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Image → Text</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Upload images to extract readable text and listen to it.</p>
              </div>
            </div>
            <div className="mt-auto">
              <span className="inline-block px-3 py-2 bg-emerald-600 text-white rounded-md text-sm">Upload</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
