import { useState, useCallback } from 'react'

export default function useTextToSpeech(){
  const [speaking, setSpeaking] = useState(false)
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  let currentUtterance = null

  const speak = useCallback((text, opts={})=>{
    if(!synth || !text) return
    // cancel any previous
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    if(opts.rate) u.rate = opts.rate
    if(opts.pitch) u.pitch = opts.pitch
    if(opts.lang) u.lang = opts.lang
    currentUtterance = u
    u.onstart = ()=> setSpeaking(true)
    u.onend = ()=> setSpeaking(false)
    synth.speak(u)
  }, [synth])

  const cancel = useCallback(()=>{
    if(!synth) return
    synth.cancel()
    setSpeaking(false)
  }, [synth])

  return { speak, speaking, cancel }
}
