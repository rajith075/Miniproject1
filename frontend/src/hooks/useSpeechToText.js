import { useState, useCallback, useEffect } from 'react'

export default function useSpeechToText(){
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [recognition, setRecognition] = useState(null)

  useEffect(()=>{
    const anyWin = window
    const SpeechRecognition = anyWin.SpeechRecognition || anyWin.webkitSpeechRecognition
    if(!SpeechRecognition){
      setError('SpeechRecognition API not supported in this browser.')
      return
    }
    const r = new SpeechRecognition()
    r.lang = 'en-US'
    r.interimResults = true
    r.onresult = (ev)=>{
      let text = ''
      for(let i=0;i<ev.results.length;i++){
        text += ev.results[i][0].transcript
      }
      setTranscript(text)
    }
    r.onerror = (e)=> setError(e?.message || String(e))
    setRecognition(r)

    return ()=> {
      try{ r.stop() }catch(e){}
    }
  }, [])

  const startListening = useCallback(()=>{
    if(!recognition) return
    try{
      recognition.start()
      setListening(true)
    }catch(e){
      setError(String(e))
    }
  }, [recognition])

  const stopListening = useCallback(()=>{
    if(!recognition) return
    recognition.stop()
    setListening(false)
  }, [recognition])

  return { listening, transcript, startListening, stopListening, error }
}
