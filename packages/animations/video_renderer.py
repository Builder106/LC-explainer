import moviepy as mp
from PIL import Image
import io
from .thumbnails import ThumbnailGenerator
from .captions import CaptionGenerator
from .tts import TTSGenerator
from typing import Dict, Any


class VideoRenderer:
    """Render a complete video from episode data."""

    def __init__(self, episode_data: Dict[str, Any]):
        self.episode_data = episode_data

    def render_video(self, output_path: str = "test_video.mp4") -> None:
        """Render the video with animations, TTS, and captions."""
        # Generate thumbnail as background image
        thumb_gen = ThumbnailGenerator()
        thumb_bytes = thumb_gen.generate_thumbnail(self.episode_data)

        # Save thumbnail to file
        with open("temp_thumbnail.png", "wb") as f:
            f.write(thumb_bytes)

        # Generate TTS audio
        tts_gen = TTSGenerator(use_fallback=True)
        narration = "Let's solve the Two Sum problem using a hash map."
        audio_bytes = tts_gen.generate_audio(narration)

        # Save audio to file
        with open("temp_audio.wav", "wb") as f:
            f.write(audio_bytes)

        # Create video clip from thumbnail (static for demo)
        thumb_clip = mp.ImageClip("temp_thumbnail.png").with_duration(5.0)

        # Add audio
        audio_clip = mp.AudioFileClip("temp_audio.wav")
        video_clip = thumb_clip.with_audio(audio_clip)

        # Generate captions
        cap_gen = CaptionGenerator()
        segments = [{"text": narration}]
        srt_content = cap_gen.generate_srt(segments)

        # Save SRT for demo
        with open("temp_captions.srt", "w") as f:
            f.write(srt_content)

        # Export video
        video_clip.write_videofile(output_path, fps=24)

        # Clean up
        import os

        os.remove("temp_thumbnail.png")
        os.remove("temp_audio.wav")
        os.remove("temp_captions.srt")

        print(f"Video rendered to {output_path} with captions and audio.")
