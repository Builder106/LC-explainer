# Remotion Video Generator

This package handles the programmatic generation of LeetCode explainer videos using Remotion.

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the preview server:
    ```bash
    npm start
    ```
    This will open the Remotion Studio in your browser (usually http://localhost:3000).

3.  Render a video:
    ```bash
    npm run build
    ```

## Structure

- `src/components/`: Reusable animation components (e.g., `Stack`, `Queue`, `CodeEditor`).
- `src/scenes/`: Full scenes that compose components (e.g., `TwoSumWalkthrough`).
- `src/Root.tsx`: The entry point where Compositions are registered.

## Architecture

This package replaces the Python-based `packages/animations` logic for **visuals**. 
However, we might still use Python for orchestration or simply migrate the orchestration logic to TypeScript scripts here.

