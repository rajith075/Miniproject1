import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Fixed Speech-To-Text hook:
 * - Uses ONLY SpeechRecognition's native microphone (no separate getUserMedia)
 * - VU meter simulates audio via animation (visual feedback only)
 * - Simpler, more reliable, avoids device routing conflicts
 * - Full logging for diagnosis
 */
export default function useSpeechToText({ lang = "en-US", deviceId = null } = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const [level, setLevel] = useState(0);

  const recogRef = useRef(null);
  const rafRef = useRef(null);
  const keepListeningRef = useRef(false);
  const simulatedLevelRef = useRef(0);

  // Create recognition instance
  useEffect(() => {
    const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition) || null;
    if (!SpeechRecognition) {
      setError("SpeechRecognition not supported. Use Chrome/Edge and allow mic.");
      return;
    }

    const r = new SpeechRecognition();
    r.lang = lang;
    r.interimResults = true;
    r.continuous = false; // crucial: must be false to properly detect speech endpoints
    r.maxAlternatives = 1;
    
    console.log(`[STT] Recognition configured: lang=${lang}`);

    r.onaudiostart = () => {
      console.log("[STT] ✅ onaudiostart - OS microphone activated");
    };

    r.onsoundstart = () => {
      console.log("[STT] ✅ onsoundstart - sound detected");
    };

    r.onspeechstart = () => {
      console.log("[STT] ✅✅ onspeechstart - SPEECH DETECTED!!");
      setError(null);
    };

    r.onstart = () => {
      console.log("[STT] recognition started");
      setError(null);
    };

    r.onresult = (ev) => {
      console.log("[STT] onresult fired, results.length:", ev.results.length);
      let finalText = "";
      let interim = "";
      for (let i = 0; i < ev.results.length; i++) {
        const res = ev.results[i];
        const txt = res[0].transcript || "";
        const confidence = res[0].confidence || 0;
        console.log(
          `[STT] result[${i}] isFinal=${res.isFinal} transcript="${txt}" confidence=${confidence.toFixed(2)}`
        );
        if (res.isFinal) {
          finalText += txt + " ";
        } else {
          interim += txt;
        }
      }
      const combined = (finalText + " " + interim).trim();
      console.log("[STT] setting transcript:", combined);
      setTranscript(combined);
    };

    r.onerror = (e) => {
      const code = e?.error || "unknown";
      console.error("[STT] onerror fired, code:", code);

      // "no-speech" is normal - just means the timeout fired with no speech detected
      // Let it finish naturally; don't force restart here
      if (code === "no-speech") {
        console.log("[STT] no-speech (normal timeout)");
        return;
      }

      if (code === "not-allowed" || code === "service-not-allowed") {
        setError("❌ Microphone access blocked. Allow mic in browser site settings.");
      } else if (code !== "aborted") {
        setError(`Speech error: ${code}`);
      }
    };

    r.onend = () => {
      console.log("[STT] onend fired, keepListeningRef.current:", keepListeningRef.current);
      if (keepListeningRef.current) {
        console.log("[STT] user still listening, restarting...");
        setTimeout(() => {
          try {
            r.start();
            console.log("[STT] restarted");
          } catch (err) {
            console.warn("[STT] restart failed:", err);
            setListening(false);
          }
        }, 100);
      } else {
        console.log("[STT] user stopped, not restarting");
        setListening(false);
      }
    };

    recogRef.current = r;
    return () => {
      try {
        r.stop();
      } catch (e) {}
      recogRef.current = null;
    };
  }, [lang]);

  // Simulated VU meter (animates level up/down for visual feedback)
  const startVUMeter = useCallback(() => {
    console.log("[STT] VU meter simulation started");
    simulatedLevelRef.current = 0;

    const animate = () => {
      // Simulate audio levels: ramp up quickly, decay slowly
      if (Math.random() > 0.7) {
        simulatedLevelRef.current = Math.random() * 0.8 + 0.2; // spike
      } else {
        simulatedLevelRef.current *= 0.92; // decay
      }
      setLevel(simulatedLevelRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const stopVUMeter = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setLevel(0);
  }, []);

  const startListening = useCallback(async () => {
    console.log("[STT] startListening called");
    setError(null);
    setTranscript("");
    const recog = recogRef.current;
    if (!recog) {
      setError("SpeechRecognition not available");
      return;
    }

    startVUMeter();

    try {
      keepListeningRef.current = true;
      recog.start();
      setListening(true);
      console.log("[STT] recognition.start() called");
    } catch (err) {
      console.error("[STT] recog.start failed:", err);
      setError("Could not start: " + (err?.message || err));
      setListening(false);
      stopVUMeter();
    }
  }, [startVUMeter, stopVUMeter]);

  const stopListening = useCallback(() => {
    console.log("[STT] stopListening called");
    keepListeningRef.current = false;
    const recog = recogRef.current;
    try {
      recog && recog.stop();
    } catch (e) {}
    setListening(false);
    stopVUMeter();
  }, [stopVUMeter]);

  // Cleanup
  useEffect(() => {
    return () => {
      keepListeningRef.current = false;
      stopListening();
    };
  }, [stopListening]);

  return { listening, transcript, error, level, startListening, stopListening };
}

