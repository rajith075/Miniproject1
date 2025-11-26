import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import speech_recognition as sr
from werkzeug.utils import secure_filename
from gtts import gTTS
from gtts.lang import tts_langs
from io import BytesIO

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
BASE_DIR = os.path.dirname(__file__)
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"wav", "mp3", "flac", "ogg", "webm", "m4a"}
MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "assistive-platform-backend"}), 200


# ============================================================
# 1️⃣ FILE UPLOAD STT
# ============================================================
@app.route("/api/stt/upload", methods=["POST"])
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided (field 'audio')"}), 400

    file = request.files["audio"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": f"Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    try:
        file.save(filepath)
        recognizer = sr.Recognizer()

        with sr.AudioFile(filepath) as source:
            audio = recognizer.record(source)

        language = request.form.get("language", "en-US")
        text = recognizer.recognize_google(audio, language=language)

        return jsonify({"transcript": text, "engine": "google", "confidence": 0.95}), 200

    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 422
    except sr.RequestError as e:
        return jsonify({"error": f"Google STT error: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)


# ============================================================
# 2️⃣ STREAMING STT (multipart or raw WAV/MP3/OGG)
# ============================================================
@app.route("/api/stt/stream", methods=["POST"])
def transcribe_stream():
    try:
        # Case 1: multipart form-data audio
        if "audio" in request.files:
            audio_bytes = request.files["audio"].read()
        else:
            # Case 2: raw body (Content-Type: audio/wav or audio/ogg)
            audio_bytes = request.get_data()

        if not audio_bytes:
            return jsonify({"error": "No audio data provided"}), 400

        language = (
            request.args.get("language")
            or request.headers.get("X-STT-Language")
            or "en-US"
        )

        recognizer = sr.Recognizer()
        bio = BytesIO(audio_bytes)

        # Use AudioFile so SpeechRecognition can decode WAV/OGG/MP3
        try:
            with sr.AudioFile(bio) as source:
                audio = recognizer.record(source)
        except Exception as e:
            return jsonify({"error": f"Invalid audio container: {str(e)}"}), 400

        text = recognizer.recognize_google(audio, language=language)

        return jsonify({"transcript": text, "engine": "google", "confidence": 0.95}), 200

    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 422
    except sr.RequestError as e:
        return jsonify({"error": f"Google API error: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


# ============================================================
# 3️⃣ SUPPORTED LANGUAGES
# ============================================================
@app.route("/api/stt/supported-languages", methods=["GET"])
def supported_languages():
    return jsonify(
        {
            "languages": {
                "en-US": "English (US)",
                "hi-IN": "Hindi",
                "kn-IN": "Kannada",
                "ta-IN": "Tamil",
                "te-IN": "Telugu",
            }
        }
    )


# ============================================================
# 4️⃣ TTS USING gTTS
# ============================================================
@app.route("/api/tts/synthesize", methods=["POST"])
def synthesize_tts():
    try:
        data = request.get_json(force=True)
        text = data.get("text", "")
        lang = data.get("language", "en-US")

        if not text:
            return jsonify({"error": "No text provided"}), 400

        lang_map = {
            "en-US": "en",
            "hi-IN": "hi",
            "kn-IN": "kn",
            "ta-IN": "ta",
            "te-IN": "te",
        }
        g_lang = lang_map.get(lang, "en")

        if g_lang not in tts_langs():
            g_lang = "en"

        tts = gTTS(text=text, lang=g_lang)
        bio = BytesIO()
        tts.write_to_fp(bio)
        bio.seek(0)

        return send_file(
            bio,
            mimetype="audio/mpeg",
            as_attachment=False,
            download_name="tts.mp3",
        )

    except Exception as e:
        return jsonify({"error": f"TTS error: {str(e)}"}), 500


# ============================================================
# RUN SERVER
# ============================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
