# Assistive Platform Backend

Python Flask server for speech recognition and accessibility features.

## Setup

1. **Create Python virtual environment:**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

2. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

3. **Run server:**
   ```powershell
   python app.py
   ```

Server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns: `{ "status": "ok" }`

### Upload Audio File
- **POST** `/api/stt/upload`
- Body: multipart form-data with `audio` file (WAV, MP3, FLAC, OGG)
- Returns: `{ "transcript": "text...", "confidence": 0.95, "engine": "google" }`

### Stream Audio (Real-time)
- **POST** `/api/stt/stream`
- Body: raw audio bytes
- Returns: `{ "transcript": "text...", "confidence": 0.95, "engine": "google" }`

### Supported Languages
- **GET** `/api/stt/supported-languages`
- Returns: `{ "languages": { "en-US": "English (US)", ... } }`

Note: The STT endpoints accept an optional `language` parameter. For file uploads include the language in the multipart form under the `language` field (e.g. `form.append('language', 'hi-IN')`). For the stream endpoint provide the language as a query parameter (`/api/stt/stream?language=hi-IN`) or via the `X-STT-Language` request header.

The backend currently advertises these five languages (code => label):

- `en-US`: English
- `kn-IN`: Kannada
- `hi-IN`: Hindi
- `ta-IN`: Tamil
- `te-IN`: Telugu

Example `curl` (file upload) — transcribe `sample.mp3` as Hindi:

```powershell
curl -X POST "http://localhost:5000/api/stt/upload" -F "audio=@sample.mp3" -F "language=hi-IN"
```

Example `curl` (stream, raw bytes) — send raw PCM bytes (client must supply proper PCM)

```powershell
# Send raw PCM file as application/octet-stream and include language as query
curl -X POST "http://localhost:5000/api/stt/stream?language=kn-IN" --data-binary @raw_16khz_pcm.raw -H "Content-Type: application/octet-stream"
```

Tip: For most use-cases, use the upload endpoint with standard audio containers (WAV/MP3). The stream endpoint expects raw PCM; if you need container decoding server-side, add `pydub`/`ffmpeg` decoding before creating `sr.AudioData`.

## Troubleshooting

- **Error: "No module named 'flask'"** → Run `pip install -r requirements.txt`
- **Error: "Microphone not found"** → Use file upload endpoint instead
- **Port 5000 already in use** → Change port in `app.py` line `app.run(port=5001)`

### Notes about language and streaming

- The backend uses `SpeechRecognition`'s `recognize_google` with the provided `language` code. Make sure the language codes match those returned by `/api/stt/supported-languages`.
- The `/api/stt/stream` endpoint expects raw PCM audio bytes matching the `sr.AudioData` parameters (sample rate 16000, sample width 2). If your client sends WAV/MP3 container data, the server must decode it first (e.g., with `pydub`) before creating `sr.AudioData`. For reliability, prefer file uploads (`/api/stt/upload`) unless you implement proper client-side encoding to raw PCM.
