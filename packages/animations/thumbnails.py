from PIL import Image, ImageDraw, ImageFont
import io
from typing import Dict, Any


class ThumbnailGenerator:
    """Generate dynamic thumbnails from episode metadata."""

    def __init__(
        self,
        width: int = 1280,
        height: int = 720,
        bg_color: str = "#1a1a1a",
        text_color: str = "#ffffff",
    ):
        self.width = width
        self.height = height
        self.bg_color = bg_color
        self.text_color = text_color

    def generate_thumbnail(self, episode_data: Dict[str, Any]) -> bytes:
        """Generate thumbnail image bytes."""
        img = Image.new("RGB", (self.width, self.height), self.bg_color)
        draw = ImageDraw.Draw(img)

        # Add title
        title = episode_data.get("title", "LeetCode Explainer")
        self._draw_text(draw, title, 50, self.height // 2 - 50, font_size=60)

        # Add difficulty badge
        difficulty = episode_data.get("difficulty", "Unknown")
        badge_color = {"Easy": "#4caf50", "Medium": "#ff9800", "Hard": "#f44336"}.get(
            difficulty, "#757575"
        )
        self._draw_badge(draw, difficulty, 50, self.height - 100, badge_color)

        # Convert to bytes
        output = io.BytesIO()
        img.save(output, format="PNG")
        return output.getvalue()

    def _draw_text(
        self, draw: ImageDraw.ImageDraw, text: str, x: int, y: int, font_size: int = 40
    ):
        """Draw text on the image."""
        try:
            font = ImageFont.truetype("DejaVuSans-Bold.ttf", font_size)
        except OSError:
            font = ImageFont.load_default()
        draw.text((x, y), text, fill=self.text_color, font=font)

    def _draw_badge(
        self, draw: ImageDraw.ImageDraw, text: str, x: int, y: int, color: str
    ):
        """Draw a colored badge."""
        # Simple rectangle badge
        draw.rectangle([x, y, x + 100, y + 40], fill=color)
        self._draw_text(draw, text, x + 10, y + 5, font_size=20)
