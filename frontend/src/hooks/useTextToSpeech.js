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
          // prefer exact match
          let v = voices.find(v => v.lang === opts.lang)
          // For Indian languages, prefer voices which are explicitly India-region or have Indian-language names
          const indianKeywords = {
            'hi': ['Hindi','India','Indian'],
            'kn': ['Kannada','India','Indian'],
            'ta': ['Tamil','India','Indian'],
            'te': ['Telugu','India','Indian']
          }
          try {
            const prefix = (opts.lang || '').split('-')[0]
            if(!v) {
              // look for same prefix with region IN
              v = voices.find(vv => vv.lang && vv.lang.toLowerCase() === `${prefix}-in`)
            }
            if(!v) {
              // look for voices containing language/India keywords
              const kws = indianKeywords[prefix] || []
              if(kws.length) {
                v = voices.find(vv => {
                  const name = (vv.name || '').toLowerCase()
                  const lang = (vv.lang || '').toLowerCase()
                  return kws.some(k => name.includes(k.toLowerCase()) || lang.includes(k.toLowerCase()))
                })
              }
            }
            // fallback to prefix match
            if(!v) v = voices.find(vv => vv.lang && vv.lang.startsWith(prefix))
          } catch(e) {
            // ignore
          }
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
