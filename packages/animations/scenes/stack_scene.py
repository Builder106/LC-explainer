from .base_scene import LeetCodeScene
from ..mobjects.data_structures import Stack


class StackScene(LeetCodeScene):
    """Scene for visualizing stack operations."""

    def construct(self) -> None:
        """Define stack animations."""
        stack = Stack(items=[1, 2, 3])
        self.add_mobject(stack)
        self.duration = 3.0  # Example duration
