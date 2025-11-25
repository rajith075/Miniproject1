import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'flac', 'ogg'}
MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

recognizer = sr.Recognizer()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'assistive-platform-backend'}), 200

@app.route('/api/stt/upload', methods=['POST'])
def transcribe_audio():
    """
    Transcribe audio file
    Expected: multipart form-data with 'audio' file field
    Returns: { "transcript": "...", "confidence": 0.95 }
    """
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Transcribe
        with sr.AudioFile(filepath) as source:
            audio = recognizer.record(source)
        # Read requested language (optional)
        language = request.form.get('language', 'en-US')
        try:
            # Try Google Speech Recognition first
            text = recognizer.recognize_google(audio, language=language)
            return jsonify({
                'transcript': text,
                'confidence': 0.95,  # Google doesn't provide confidence scores
                'engine': 'google'
            }), 200
        except sr.UnknownValueError:
            return jsonify({'error': 'Could not understand audio'}), 400
        except sr.RequestError as e:
            return jsonify({'error': f'API error: {str(e)}'}), 500
        finally:
            # Clean up
            if os.path.exists(filepath):
                os.remove(filepath)
    
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/stt/stream', methods=['POST'])
def transcribe_stream():
    """
    Transcribe audio stream (for real-time transcription)
    Expected: raw audio bytes in request body
    Returns: { "transcript": "...", "confidence": 0.95 }
    """
    try:
        audio_data = request.get_data()
        
        if not audio_data:
            return jsonify({'error': 'No audio data provided'}), 400
        # Determine language: query param or header
        language = request.args.get('language') or request.headers.get('X-STT-Language') or 'en-US'
        # Convert bytes to AudioData (client must send raw PCM matching these params)
        audio = sr.AudioData(audio_data, 16000, 2)  # 16kHz, 2 bytes per sample
        
        try:
            text = recognizer.recognize_google(audio, language=language)
            return jsonify({
                'transcript': text,
                'confidence': 0.95,
                'engine': 'google'
            }), 200
        except sr.UnknownValueError:
            return jsonify({'error': 'Could not understand audio'}), 400
        except sr.RequestError as e:
            return jsonify({'error': f'API error: {str(e)}'}), 500
    
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/stt/supported-languages', methods=['GET'])
def supported_languages():
    """Return list of supported languages"""
    languages = {
        'en-US': 'English',
        'kn-IN': 'Kannada',
        'hi-IN': 'Hindi',
        'ta-IN': 'Tamil',
        'te-IN': 'Telugu',
    }
    return jsonify({'languages': languages}), 200

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({'error': 'File too large. Max 50MB allowed'}), 413

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Set debug=False for production
    app.run(host='0.0.0.0', port=5000, debug=True)
