from .base_scene import LeetCodeScene
from ..mobjects.data_structures import Stack
from ..tts import TTSGenerator
from ..captions import CaptionGenerator


class NarratedStackScene(LeetCodeScene):
    """A narrated scene demonstrating stack operations with TTS and captions."""

    def construct(self) -> None:
        """Define the scene with narration and captions."""
        stack = Stack(items=[1, 2])
        self.add_mobject(stack)
        self.duration = 5.0

        # Generate TTS for narration
        tts = TTSGenerator(use_fallback=True)
        narration = "Let's push 3 onto the stack and then pop it."
        audio = tts.generate_audio(narration)

        # Generate captions from narration
        cap_gen = CaptionGenerator()
        segments = [{"text": narration}]
        srt = cap_gen.generate_srt(segments)
        vtt = cap_gen.generate_webvtt(segments)
        transcript = cap_gen.generate_transcript(segments)

        # In a full implementation, save captions and sync with animations
        print(f"SRT: {srt[:50]}...")  # Example output
