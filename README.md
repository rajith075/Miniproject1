# Assistive Platform

Comprehensive accessibility platform with:
- 🎙️ **Speech-to-Text (STT)** - Browser Web Speech API + Python backend
- 🔊 **Text-to-Speech (TTS)** - Browser native synthesis
- 👁️ **Optical Character Recognition (OCR)** - Image text extraction
- 🔈 **Global Screen Reader** - Accessibility features

## Project Structure

```
assistive-platform/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Home, STT, TTS, OCR)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # Context API (ScreenReader)
│   │   ├── lib/             # Utilities (api.js)
│   │   └── styles/          # Global CSS + Tailwind
│   ├── public/              # Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.cjs
│
├── backend/                  # Python Flask server
│   ├── app.py               # Main Flask app
│   ├── requirements.txt      # Python dependencies
│   ├── uploads/             # Audio file storage
│   └── README.md
│
├── README.md                # This file
└── SETUP.md                 # Installation & run guide
```

## Quick Start

### Frontend (React + Vite)
```powershell
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

### Backend (Python Flask)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
# Server running on http://localhost:5000
```

## Features

### Speech-to-Text (STT)
- **Browser**: Native Web Speech API with visual feedback
- **Server**: Flask + Python SpeechRecognition library
- Supports multiple languages
- Real-time transcript display

### Text-to-Speech (TTS)
- Browser native synthesis
- Adjustable speed/pitch
- Multiple voices available

### Optical Character Recognition (OCR)
- Upload images and extract text
- Support for multiple image formats

### Accessibility
- Global screen reader (reads text on mouseover/focus)
- Keyboard navigation
- ARIA labels and roles
- Dark mode support

## Technologies

**Frontend:**
- React 18.2
- React Router 6.14
- Vite 5.4
- Tailwind CSS 3.4
- Web APIs (Speech, Audio, Storage)

**Backend:**
- Python 3.x
- Flask 3.0
- SpeechRecognition 3.14
- Flask-CORS 4.0

## Environment Setup

### Windows (PowerShell)

**Frontend:**
```powershell
cd frontend
npm install
npm run dev
```

**Backend:**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

### Linux/Mac (Bash)

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## API Integration

Frontend calls backend via `src/lib/api.js`:

```javascript
// Transcribe audio file
const result = await transcribeAudio(audioFile);
// { transcript: "...", confidence: 0.95 }

// Get supported languages
const langs = await getSupportedLanguages();
// { en-US: "English (US)", ... }
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Microphone not working | Allow mic access in browser settings |
| Backend port conflict | Change port in `backend/app.py` |
| Python not found | Install Python 3.8+ from python.org |
| CORS errors | Ensure backend is running on :5000 |
| Module not found (frontend) | Run `npm install` in frontend/ |
| Module not found (backend) | Run `pip install -r requirements.txt` in backend/ |

## Development

### Adding new features

1. **Frontend component**: Add to `src/components/` or `src/pages/`
2. **Backend endpoint**: Add to `backend/app.py`
3. **API integration**: Update `src/lib/api.js`

### Run both simultaneously (PowerShell)

```powershell
# Terminal 1 - Frontend
cd frontend; npm run dev

# Terminal 2 - Backend
cd backend; .\venv\Scripts\Activate.ps1; python app.py
```

## License

MIT

## Contributing

Pull requests welcome! Please follow the existing code style.
