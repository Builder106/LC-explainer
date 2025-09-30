from typing import List, Dict, Any
from ..mobjects.base import Mobject


class LeetCodeScene:
    """Base class for LeetCode animation scenes, inspired by Manim's Scene."""

    def __init__(
        self, episode_data: Dict[str, Any], theme: Dict[str, Any] = None
    ):
        self.episode_data = episode_data
        self.theme = theme or {}
        self.mobjects: List[Mobject] = []
        self.duration = 0.0  # Total scene duration

    def construct(self) -> None:
        """Override in subclasses to define the scene's animation."""
        raise NotImplementedError("Subclasses must implement construct()")

    def add_mobject(self, mobj: Mobject) -> None:
        """Add an Mobject to the scene."""
        self.mobjects.append(mobj)

    def render(self) -> Dict[str, Any]:
        """Render the scene and return metadata (e.g., for video assembly)."""
        self.construct()
        return {
            "mobjects": len(self.mobjects),
            "duration": self.duration,
            "episode_id": self.episode_data.get("id"),
        }
