## Explanatory Animation Library — Stacks, Queues, Deques

### Goals
- Visualize operations and invariants clearly and consistently.
- Reusable, parameterized components for different problem contexts.
- Deterministic timing aligned to TTS beats.

### Shared design
- Items: rounded rectangles with labels; color by role (new/head/tail/popped).
- Transitions: slide, fade, scale; 200–400ms depending on beat.
- Callouts: arrows and brief labels (e.g., `push`, `pop`, `enqueue`, `dequeue`).
- Complexity badge: optional O(1) overlay when appropriate.

### Stack (LIFO)
- Operations:
  - `push(x)`: animate `x` rising to top; compress stack height; highlight top.
  - `pop()`: lift top; fade out; highlight next top.
  - `peek()`: pulse top without removal.
- State cues:
  - Empty stack: placeholder with dashed outline.
  - Overflow/limit (optional): shake + warning color.
- Variants:
  - Monotonic stack: color by comparator (increasing/decreasing); auto-pop loop animation.

### Queue (FIFO)
- Layout: horizontal boxes with `head` and `tail` markers.
- Operations:
  - `enqueue(x)`: insert at tail; slide markers; wrap if circular.
  - `dequeue()`: remove from head; slide remaining left.
  - `peek()`: pulse head.
- State cues:
  - Empty/full for circular queue; wrap-around animation.

### Deque (double-ended queue)
- Layout: horizontal with both `front` and `back` markers.
- Operations:
  - `push_front(x)`: insert at front; shift right.
  - `push_back(x)`: insert at back; extend right.
  - `pop_front()`: remove from front; shift left.
  - `pop_back()`: remove from back; contract right.
- Invariants:
  - Monotonic deque (sliding window max/min): pop-from-back while violating order; maintain window bounds.
  - Window movement: advance front index; expire indices outside window.

### API sketch (Remotion/React)
```tsx
<Stack items={[1,2,3]} ops={[
  {type:'push', value:4},
  {type:'pop'},
]} theme={theme} />

<Queue items={[1,2,3]} ops={[
  {type:'enqueue', value:4},
  {type:'dequeue'},
]} circular={false} theme={theme} />

<Deque items={[1,2,3]} ops={[
  {type:'push_back', value:4},
  {type:'push_front', value:0},
  {type:'pop_back'},
]} monotonic="decreasing" theme={theme} />
```

## Algorithm Pattern Diagrams

### Two Pointers / Sliding Window
- **Layout**: Horizontal array with left/right pointers; window highlight.
- **Operations**:
  - `move_left()` / `move_right()`: slide pointers with trailing effects.
  - `expand_window()`: grow highlight; update max/min counters.
  - `shrink_window()`: contract highlight; slide left pointer.
- **State cues**:
  - Current window sum/product/count; validity indicators.
  - Optimal position markers for fast/slow variants.

### Trees (Binary Trees, BSTs, Heaps)
- **Layout**: Node-link with levels; root at top.
- **Operations**:
  - `insert(value)`: traverse + place; color by BST property.
  - `delete(value)`: find + restructure (rotation animations).
  - `search(value)`: highlight path; pulse target.
  - Traversal: highlight BFS/DFS/inorder path.
- **Variants**:
  - Binary heap: parent-child relationships; sift-up/down animations.
  - Balanced trees: rotation sequences; balance factor overlays.

### Graphs
- **Layout**: Force-directed or grid; nodes as circles, edges as lines.
- **Operations**:
  - BFS: level-by-level expansion; queue visualization.
  - DFS: recursive stack unwind; backtrack highlights.
  - Shortest path: Dijkstra/Bellman-Ford step animations.
- **State cues**:
  - Visited nodes; distance/weight labels; cycle detection.

### Dynamic Programming Tables
- **Layout**: 2D grid with row/col indices; cell values.
- **Operations**:
  - Fill order: highlight current cell + dependencies.
  - Transition: arrow from source cells; formula overlay.
  - Optimal path: backtrack highlights.
- **Variants**:
  - 1D arrays: sliding fills with carry-over.
  - Memoization: cache hit/miss animations.

### Union-Find / Disjoint Sets
- **Layout**: Node groups with parent pointers.
- **Operations**:
  - `find(x)`: path compression animation.
  - `union(x,y)`: merge groups; rank/size updates.
- **State cues**:
  - Component count; connected components highlight.

### Tries
- **Layout**: Tree with character edges; word endings.
- **Operations**:
  - `insert(word)`: traverse + add nodes.
  - `search(word)`: highlight path; end marker.
  - `prefix_search(prefix)`: stop at prefix end.
- **State cues**:
  - Common prefixes; word count overlays.

### Bit Manipulation
- **Layout**: Binary representation; bit grid.
- **Operations**:
  - `XOR`, `AND`, `OR`: highlight affected bits.
  - `shift_left/right`: slide bits; overflow indicators.
  - `count_bits`: popcount animation.
- **State cues**:
  - Binary vs decimal; mask highlights.

### Matrix/Grid Operations
- **Layout**: 2D grid with row/col indices.
- **Operations**:
  - Spiral traversal: path animation.
  - Flood fill: BFS/DFS expansion.
  - Rotation: 90-degree animations.
- **State cues**:
  - Visited cells; boundary highlights.

### Testing (TDD)
- Deterministic state after each op matches reference reducer.
- No overlapping animations beyond configured overlays.
- Op durations sum to scene duration within epsilon.
- Monotonic structures maintain invariant after each op.
- Pattern-specific invariants (e.g., BST ordering, heap property) preserved.
