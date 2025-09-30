from .base_scene import LeetCodeScene
from ..mobjects.data_structures import Queue


class QueueScene(LeetCodeScene):
    """Scene for visualizing queue operations."""

    def construct(self) -> None:
        """Define queue animations."""
        queue = Queue(items=[1, 2, 3])
        self.add_mobject(queue)
        self.duration = 4.0  # Example duration
