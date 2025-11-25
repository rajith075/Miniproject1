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
    // Voice selection: prefer explicit voiceURI, otherwise try matching language
    try {
      const voices = synth.getVoices() || []
      if(opts.voiceURI) {
        const v = voices.find(v => v.voiceURI === opts.voiceURI || v.name === opts.voiceURI)
        if(v) u.voice = v
      } else if(opts.lang) {
        // prefer exact match, then prefix match
        let v = voices.find(v => v.lang === opts.lang)
        if(!v) v = voices.find(v => v.lang && v.lang.startsWith(opts.lang.split('-')[0]))
        if(v) u.voice = v
      }
    } catch (e) {
      // ignore voice selection errors
    }
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
