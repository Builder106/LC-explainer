from packages.animations.captions import CaptionGenerator


def test_caption_generator_initialization():
    """Test CaptionGenerator initializes correctly."""
    gen = CaptionGenerator(language="en")
    assert gen.language == "en"


def test_generate_srt():
    """Test SRT caption generation."""
    gen = CaptionGenerator()
    segments = [{"text": "Hello world"}, {"text": "Test caption"}]
    srt_content = gen.generate_srt(segments)
    assert "1" in srt_content  # Subtitle index
    assert "Hello world" in srt_content
    assert isinstance(srt_content, str)


def test_generate_webvtt():
    """Test WebVTT caption generation."""
    gen = CaptionGenerator()
    segments = [{"text": "Hello"}, {"text": "World"}]
    vtt_content = gen.generate_webvtt(segments)
    assert "WEBVTT" in vtt_content
    assert "Hello" in vtt_content
    assert "00:00:00.000 --> 00:00:00.500" in vtt_content  # Estimated timing


def test_generate_transcript():
    """Test transcript generation."""
    gen = CaptionGenerator()
    segments = [{"text": "Line 1"}, {"text": "Line 2"}]
    transcript = gen.generate_transcript(segments)
    assert transcript == "Line 1\nLine 2"


def test_format_time():
    """Test time formatting for WebVTT."""
    gen = CaptionGenerator()
    assert gen._format_time(0) == "00:00:00.000"
    assert gen._format_time(3661.5) == "01:01:01.500"  # 1 hour, 1 min, 1.5 sec
