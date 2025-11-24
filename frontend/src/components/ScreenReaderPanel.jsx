import React, { useEffect, useRef, useState } from 'react'
import useTextToSpeech from '../hooks/useTextToSpeech'

export default function ScreenReaderPanel(){
  const { speak, cancel, speaking } = useTextToSpeech()
  const [enabled, setEnabled] = useState(true)
  const demoRef = useRef(null)

  useEffect(()=>{
    const node = demoRef.current
    if(!node) return

    function handleMouseOver(e){
      if(!enabled) return
      const target = e.target
      if(target && target.innerText) speak(target.innerText)
    }

    function handleFocus(e){
      if(!enabled) return
      const target = e.target
      if(target && target.innerText) speak(target.innerText)
    }

    node.addEventListener('mouseover', handleMouseOver)
    node.addEventListener('focusin', handleFocus)

    return ()=>{
      node.removeEventListener('mouseover', handleMouseOver)
      node.removeEventListener('focusin', handleFocus)
    }
  }, [enabled, speak])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={enabled} 
            onChange={(e)=>setEnabled(e.target.checked)}
            className="w-4 h-4 accent-indigo-600 cursor-pointer"
          />
          <span className="font-medium text-slate-700 dark:text-slate-300">Enable Hover/Focus Read-Aloud</span>
        </label>
        <button 
          className={`px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg font-medium transition-colors ${
            speaking 
              ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400' 
              : 'text-slate-500 dark:text-slate-400 cursor-not-allowed'
          }`}
          onClick={()=>cancel()} 
          disabled={!speaking}
        >
          ⏹ Stop
        </button>
      </div>

      <div ref={demoRef} className="p-4 border-2 border-slate-300 dark:border-slate-600 rounded-lg space-y-3 bg-slate-50 dark:bg-slate-900" tabIndex={0} aria-label="Screen reader demo">
        <p tabIndex={0} className="p-3 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-text transition-colors">👋 This is a demo paragraph. Hover or focus here to hear it read aloud.</p>
        <p tabIndex={0} className="p-3 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-text transition-colors">🎯 Place your cursor over any text block or use Tab to navigate and the text will be spoken.</p>
        <button tabIndex={0} className="w-full px-4 py-3 bg-indigo-100 dark:bg-indigo-900/40 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">🎤 Demo button (focus me)</button>
      </div>
    </div>
  )
}
