import { useState, useCallback } from 'react'
import Tesseract from 'tesseract.js'

export default function useOCR(){
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const recognizeImage = useCallback(async (file)=>{
    setLoading(true)
    setResult(null)
    try{
      const buffer = await file.arrayBuffer()
      const { data } = await Tesseract.recognize(buffer, 'eng', { logger: m => console.log(m) })
      setResult(data?.text || '')
    }catch(e){
      setResult('Error recognizing image: ' + (e?.message || String(e)))
    }finally{
      setLoading(false)
    }
  }, [])

  return { recognizeImage, loading, result }
}
