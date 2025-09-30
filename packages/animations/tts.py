import os
from google.cloud import texttospeech
from typing import List, Dict, Any
import pyttsx3


class TTSGenerator:
    """Generate audio from text using Google Cloud TTS with pyttsx3 fallback."""

    def __init__(self, credentials_path: str = None, use_fallback: bool = True):
        self.use_fallback = use_fallback
        if credentials_path and os.path.exists(credentials_path):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
            self.client = texttospeech.TextToSpeechClient()
            self.tts_available = True
        else:
            self.client = None
            self.tts_available = False

    def generate_audio(
        self, text: str, voice_name: str = "en-US-Wavenet-D", speaking_rate: float = 1.0
    ) -> bytes:
        """Generate audio bytes from text, using fallback if needed."""
        if self.tts_available:
            try:
                synthesis_input = texttospeech.SynthesisInput(text=text)
                voice = texttospeech.VoiceSelectionParams(
                    language_code="en-US", name=voice_name
                )
                audio_config = texttospeech.AudioConfig(
                    audio_encoding=texttospeech.AudioEncoding.LINEAR16,
                    speaking_rate=speaking_rate,
                )
                response = self.client.synthesize_speech(
                    input=synthesis_input, voice=voice, audio_config=audio_config
                )
                return response.audio_content
            except Exception as e:
                if self.use_fallback:
                    return self._generate_fallback_audio(text)
                raise e
        else:
            return self._generate_fallback_audio(text)

    def _generate_fallback_audio(self, text: str) -> bytes:
        """Generate audio using pyttsx3 as fallback."""
        engine = pyttsx3.init()
        engine.save_to_file(text, "temp_audio.wav")
        engine.runAndWait()
        with open("temp_audio.wav", "rb") as f:
            audio = f.read()
        os.remove("temp_audio.wav")
        return audio

    def generate_segments(self, segments: List[Dict[str, Any]]) -> List[bytes]:
        """Generate audio for multiple text segments."""
        return [self.generate_audio(seg["text"]) for seg in segments]
