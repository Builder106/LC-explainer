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
