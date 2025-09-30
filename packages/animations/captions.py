import srt
from typing import List, Dict, Any


class CaptionGenerator:
    """Generate SRT/WebVTT captions and transcripts from TTS segments."""

    def __init__(self, language: str = "en"):
        self.language = language

    def generate_srt(self, segments: List[Dict[str, Any]]) -> str:
        """Generate SRT caption file from text segments with timings."""
        subtitles = []
        start_time = 0.0
        for i, seg in enumerate(segments):
            # Estimate duration based on text length (rough heuristic)
            duration = len(seg["text"]) * 0.1  # 0.1s per character
            end_time = start_time + duration

            subtitle = srt.Subtitle(
                index=i + 1,
                start=srt.timedelta(seconds=start_time),
                end=srt.timedelta(seconds=end_time),
                content=seg["text"],
            )
            subtitles.append(subtitle)
            start_time = end_time

        return srt.compose(subtitles)

    def generate_webvtt(self, segments: List[Dict[str, Any]]) -> str:
        """Generate WebVTT caption file."""
        vtt_lines = ["WEBVTT", ""]
        start_time = 0.0
        for seg in segments:
            duration = len(seg["text"]) * 0.1
            end_time = start_time + duration
            vtt_lines.append(
                f"{self._format_time(start_time)} --> {self._format_time(end_time)}"
            )
            vtt_lines.append(seg["text"])
            vtt_lines.append("")
            start_time = end_time
        return "\n".join(vtt_lines)

    def generate_transcript(self, segments: List[Dict[str, Any]]) -> str:
        """Generate a plain text transcript."""
        return "\n".join(seg["text"] for seg in segments)

    def _format_time(self, seconds: float) -> str:
        """Format seconds as WebVTT time (HH:MM:SS.mmm)."""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:03d}"
