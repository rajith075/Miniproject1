/**
 * Backend API integration for Assistive Platform
 * Communicates with Python Flask server on http://localhost:5000
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Health check - verify backend is running
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[API] Backend health check failed:', err);
    return null;
  }
}

/**
 * Transcribe audio file (WAV, MP3, FLAC, OGG)
 * @param {File} file - Audio file
 * @returns {Promise<{transcript: string, confidence: number, engine: string}>}
 */
export async function transcribeAudioFile(file, language = 'en-US') {
  try {
    const form = new FormData();
    form.append('audio', file);
    form.append('language', language);
    
    const res = await fetch(`${BACKEND_URL}/api/stt/upload`, {
      method: 'POST',
      body: form
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `Upload failed: ${res.status}`);
    }
    
    return await res.json();
  } catch (err) {
    console.error('[API] Audio transcription failed:', err);
    throw err;
  }
}

/**
 * Transcribe audio stream (real-time)
 * @param {Uint8Array} audioData - Raw audio bytes
 * @returns {Promise<{transcript: string, confidence: number, engine: string}>}
 */
export async function transcribeAudioStream(audioData, language = 'en-US') {
  try {
    const url = `${BACKEND_URL}/api/stt/stream?language=${encodeURIComponent(language)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: audioData
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `Stream failed: ${res.status}`);
    }
    
    return await res.json();
  } catch (err) {
    console.error('[API] Stream transcription failed:', err);
    throw err;
  }
}

/**
 * Server-side TTS synthesis (gTTS) - returns Blob
 * @param {string} text
 * @param {string} language (e.g. 'hi-IN')
 */
export async function synthesizeServerTTS(text, language = 'en-US') {
  try {
    const res = await fetch(`${BACKEND_URL}/api/tts/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || `TTS failed: ${res.status}`)
    }
    const blob = await res.blob()
    return blob
  } catch (err) {
    console.error('[API] Server TTS failed:', err)
    throw err
  }
}

/**
 * Get list of supported languages for STT
 */
export async function getSupportedLanguages() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/stt/supported-languages`);
    if (!res.ok) throw new Error(`Failed to fetch languages: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[API] Failed to fetch languages:', err);
    return { languages: {} };
  }
}

/**
 * Upload image for OCR (Placeholder for future implementation)
 */
export async function uploadImageForOCR(file) {
  try {
    const form = new FormData();
    form.append('image', file);
    
    const res = await fetch(`${BACKEND_URL}/api/ocr/upload`, {
      method: 'POST',
      body: form
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `OCR failed: ${res.status}`);
    }
    
    return await res.json();
  } catch (err) {
    console.error('[API] OCR failed:', err);
    throw err;
  }
}
