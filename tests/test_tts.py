import pytest
from packages.animations.tts import TTSGenerator


def test_tts_generator_initialization():
    """Test TTSGenerator initializes correctly."""
    tts = TTSGenerator()
    # Should work with or without credentials (fallback)
    assert tts.tts_available is False or tts.client is not None


def test_generate_audio_basic():
    """Test basic audio generation with fallback."""
    tts = TTSGenerator(use_fallback=True)
    audio = tts.generate_audio("Hello, world!")
    assert isinstance(audio, bytes)
    assert len(audio) > 0


def test_generate_segments():
    """Test generating multiple audio segments."""
    tts = TTSGenerator(use_fallback=True)
    segments = [{"text": "Hello"}, {"text": "World"}]
    audios = tts.generate_segments(segments)
    assert len(audios) == 2
    for audio in audios:
        assert isinstance(audio, bytes)


def test_tts_with_custom_voice():
    """Test TTS with custom voice settings (uses fallback)."""
    tts = TTSGenerator(use_fallback=True)
    audio = tts.generate_audio("Test", voice_name="en-US-Wavenet-F", speaking_rate=1.2)
    assert isinstance(audio, bytes)
