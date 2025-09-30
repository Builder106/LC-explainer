from .base_scene import LeetCodeScene
from ..mobjects.data_structures import Deque


class DequeScene(LeetCodeScene):
    """Scene for visualizing deque operations."""

    def construct(self) -> None:
        """Define deque animations."""
        deque = Deque(items=[1, 2, 3])
        self.add_mobject(deque)
        self.duration = 5.0  # Example duration
