from .base import Mobject
from typing import List, Any


class DataItem(Mobject):
    """Represents a single item in a data structure (e.g., stack element)."""

    def __init__(self, value: Any, **kwargs):
        super().__init__(**kwargs)
        self.value = value

    def to_dict(self) -> dict:
        data = super().to_dict()
        data["value"] = self.value
        return data


class Stack(Mobject):
    """A stack data structure Mobject."""

    def __init__(self, items: List[Any] = None, **kwargs):
        super().__init__(**kwargs)
        self.items = items or []

    def push(self, item: Any) -> None:
        """Add an item to the top of the stack."""
        self.items.append(item)

    def pop(self) -> Any:
        """Remove and return the top item."""
        return self.items.pop() if self.items else None

    def peek(self) -> Any:
        """Return the top item without removing."""
        return self.items[-1] if self.items else None

    def to_dict(self) -> dict:
        data = super().to_dict()
        data["items"] = self.items
        return data


class Queue(Mobject):
    """A queue data structure Mobject (FIFO)."""

    def __init__(self, items: List[Any] = None, **kwargs):
        super().__init__(**kwargs)
        self.items = items or []

    def enqueue(self, item: Any) -> None:
        """Add an item to the back of the queue."""
        self.items.append(item)

    def dequeue(self) -> Any:
        """Remove and return the front item."""
        return self.items.pop(0) if self.items else None

    def peek(self) -> Any:
        """Return the front item without removing."""
        return self.items[0] if self.items else None

    def to_dict(self) -> dict:
        data = super().to_dict()
        data["items"] = self.items
        return data


class Deque(Mobject):
    """A deque data structure Mobject (double-ended queue)."""

    def __init__(self, items: List[Any] = None, **kwargs):
        super().__init__(**kwargs)
        self.items = items or []

    def push_front(self, item: Any) -> None:
        """Add an item to the front."""
        self.items.insert(0, item)

    def push_back(self, item: Any) -> None:
        """Add an item to the back."""
        self.items.append(item)

    def pop_front(self) -> Any:
        """Remove and return the front item."""
        return self.items.pop(0) if self.items else None

    def pop_back(self) -> Any:
        """Remove and return the back item."""
        return self.items.pop() if self.items else None

    def peek_front(self) -> Any:
        """Return the front item."""
        return self.items[0] if self.items else None

    def peek_back(self) -> Any:
        """Return the back item."""
        return self.items[-1] if self.items else None

    def to_dict(self) -> dict:
        data = super().to_dict()
        data["items"] = self.items
        return data
