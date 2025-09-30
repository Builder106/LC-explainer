from typing import Dict, Any


class Mobject:
    """Base class for animated objects, inspired by Manim's Mobject."""

    def __init__(
        self, position: tuple = (0, 0), color: str = "white", size: float = 1.0
    ):
        self.position = position
        self.color = color
        self.size = size
        self.visible = True

    def animate(self, action: str, duration: float = 1.0) -> Dict[str, Any]:
        """Define an animation for this Mobject."""
        return {
            "type": action,
            "duration": duration,
            "mobject": self.__class__.__name__,
        }

    def to_dict(self) -> Dict[str, Any]:
        """Serialize Mobject for rendering."""
        return {
            "position": self.position,
            "color": self.color,
            "size": self.size,
            "visible": self.visible,
        }
