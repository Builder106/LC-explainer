## Scene Library (Remotion)

### Core scenes
- Code Walkthrough: line/token highlights, diff reveals, cursor path
- Pseudocode Board: staged reveals with callouts
- Pattern Diagrams: two pointers/sliding window, trees, graphs, DP tables, union-find, tries, bit manipulation, matrix operations (see `docs/DIAGRAMS.md`)
- Data Structure Animations: stacks, queues, deques (see `docs/DIAGRAMS.md`)
- Quiz Checkpoint: multiple-choice with timed pause
- Titles/Lower-thirds/End-card: brand-consistent

### Timing
- Driven by TTS segment durations; overlays auto-fit beats

### Assets
- Code via Shiki/Prism → HTML/SVG
- Diagrams via React-SVG/Mermaid/Graphviz

### Data structure animations
- See `docs/DIAGRAMS.md` for goals, operations, invariants, and API sketches.
- Components expose declarative `items` and `ops` props; scenes schedule animations per op.

```tsx
<Stack items={[1,2,3]} ops={[{type:'push', value:4},{type:'pop'}]} />
<Queue items={[1,2,3]} ops={[{type:'enqueue', value:4},{type:'dequeue'}]} />
<Deque items={[1,2,3]} ops={[{type:'push_back', value:4},{type:'pop_front'}]} />
```
