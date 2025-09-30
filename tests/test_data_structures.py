from packages.animations.mobjects.data_structures import DataItem, Stack, Queue, Deque


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


def test_queue_initialization():
    """Test Queue initializes correctly."""
    queue = Queue(items=[1, 2, 3])
    assert queue.items == [1, 2, 3]


def test_queue_operations():
    """Test Queue enqueue, dequeue, peek."""
    queue = Queue()
    queue.enqueue(1)
    queue.enqueue(2)
    assert queue.peek() == 1
    assert queue.dequeue() == 1
    assert queue.items == [2]


def test_queue_dequeue_empty():
    """Test dequeue on empty queue."""
    queue = Queue()
    assert queue.dequeue() is None
    assert queue.peek() is None


def test_queue_to_dict():
    """Test Queue serialization."""
    queue = Queue(items=[1, 2])
    data = queue.to_dict()
    assert data["items"] == [1, 2]


def test_deque_initialization():
    """Test Deque initializes correctly."""
    deque = Deque(items=[1, 2, 3])
    assert deque.items == [1, 2, 3]


def test_deque_operations():
    """Test Deque push/pop from both ends."""
    deque = Deque()
    deque.push_back(1)
    deque.push_front(2)
    assert deque.peek_front() == 2
    assert deque.peek_back() == 1
    assert deque.pop_front() == 2
    assert deque.pop_back() == 1


def test_deque_empty_operations():
    """Test operations on empty deque."""
    deque = Deque()
    assert deque.pop_front() is None
    assert deque.pop_back() is None


def test_deque_to_dict():
    """Test Deque serialization."""
    deque = Deque(items=[1, 2])
    data = deque.to_dict()
    assert data["items"] == [1, 2]
