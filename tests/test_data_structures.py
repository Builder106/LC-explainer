from packages.animations.mobjects.data_structures import DataItem, Stack


def test_data_item_initialization():
    """Test DataItem initializes correctly."""
    item = DataItem(value=42, position=(0, 0), color="green")
    assert item.value == 42
    assert item.position == (0, 0)
    assert item.color == "green"


def test_data_item_to_dict():
    """Test DataItem serialization."""
    item = DataItem(value="test", size=1.5)
    data = item.to_dict()
    assert data["value"] == "test"
    assert data["size"] == 1.5


def test_stack_initialization():
    """Test Stack initializes correctly."""
    stack = Stack(items=[1, 2, 3])
    assert stack.items == [1, 2, 3]


def test_stack_operations():
    """Test Stack push, pop, peek."""
    stack = Stack()
    stack.push(1)
    stack.push(2)
    assert stack.peek() == 2
    assert stack.pop() == 2
    assert stack.items == [1]


def test_stack_pop_empty():
    """Test pop on empty stack."""
    stack = Stack()
    assert stack.pop() is None
    assert stack.peek() is None


def test_stack_to_dict():
    """Test Stack serialization."""
    stack = Stack(items=[1, 2])
    data = stack.to_dict()
    assert data["items"] == [1, 2]
