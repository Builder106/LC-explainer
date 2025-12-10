# Development TODO - Interactive LeetCode Explainer Chrome Extension

## Overview
This document outlines the development roadmap for building a Chrome extension that integrates interactive, code-driven LeetCode explainer videos directly into the LeetCode website. The extension will use a custom Python-based animation library (inspired by Manim) for video generation, TTS, Gemini AI for content assistance, and frontend JavaScript for seamless LeetCode integration. All development follows TDD principles - write tests first, then implement.

## Phase 1: Foundation

### 1.1 Extension Setup
- [x] Initialize monorepo structure (`packages/`, `content/`, `infrastructure/`)
- [x] Set up Python project with virtualenv, black, flake8 (for custom library)
- [x] Create JSON Schema for content model (episode metadata, storyboard, quizzes)
- [x] Write schema validation tests (required fields, invalid combinations)
- [x] Implement CLI tool for schema validation
- [x] Set up Git hooks for schema validation on content changes
- [x] Create `docs/RISKS.md` and `docs/QA.md` for risk assessment and testing strategies
- [x] Set up Chrome extension project structure (`extension/` folder)
- [x] Create `manifest.json` with permissions for LeetCode domain and content script injection
- [ ] Write tests for extension manifest validation and basic DOM manipulation
- [ ] Ensure compliance with Chrome Web Store policies (no violation of LeetCode TOS)

### 1.2 Content Script Development
- [x] Create content directory structure with Markdown + front matter format
- [x] Implement front matter parser and content loader
- [x] Write round-trip stability tests (authoring → JSON → render → JSON unchanged)
- [x] Build basic content authoring utilities
- [x] Create sample episode content files with all required fields
- [x] Develop content scripts to inject the interactive code editor into LeetCode problem pages
- [x] Add pill element in the same column as the 'Leet' AI helper
- [ ] Ensure seamless integration with LeetCode's existing UI

## Phase 2: Interactive Features

### 2.1 Interactive Video Player
- [x] Set up Python-based animation library project structure (`packages/animations/`)
- [x] Configure FFmpeg integration for video rendering
- [x] Create base `LeetCodeScene` class with `construct()` method for declarative animations
- [x] Implement core Mobject classes (e.g., `DataItem`, `Stack`, `Queue`) with styling and theming
- [x] Write library setup tests (e.g., scene instantiation, basic rendering without errors)
- [x] Implement timing system (TTS segments drive scene durations via `run_time` parameters)
- [x] Write renderer tests for timing alignment and animation state management
- [x] Run initial performance and accessibility tests on base library
- [ ] Implement a video player that supports interactive elements, such as pausing for user input
- [ ] Synchronize video content with code editor states

### 2.2 Code Editor Integration
- [x] Integrate Google Cloud TTS (WaveNet/Neural2) with fallback options
- [x] Implement TTS segment generation and caching
- [x] Create audio track with BGM ducking
- [x] Write TTS timing tests (sum of scene durations ≈ sum of TTS segments)
- [x] Implement auto-captioning from TTS output
- [x] Generate SRT/WebVTT caption files
- [x] Write caption validation tests (valid format, within bounds)
- [x] Create transcript export functionality
- [ ] Embed a code editor alongside the video player
- [ ] Allow users to modify the presented solution code in real-time
- [ ] Implement functionality to run and test user-modified code

### 2.3 Alternative Solution Suggestions
- [ ] Set up Gemini API client with safety settings and thinking mode
- [ ] Implement pseudo-LeetCode interface for problem fetching and simulation (for extension embedding)
- [ ] Build UMPIRE method integration (Understand, Match, Plan, Implement, Review, Evaluate) into extension hints
- [ ] Create script outline generation from objectives using structured output
- [ ] Generate code with comments and explanations via Gemini for interactive tooltips
- [ ] Implement quiz generation with answer validation and rationale (embedded in extension)
- [ ] Build recognition cues suggestion system based on patterns for contextual help
- [ ] Provide users with the ability to suggest and submit alternative solutions
- [ ] Implement a system to review and display community-suggested solutions
- [ ] Enable editable code snippets in extension videos (allow users to modify and run solutions)
- [ ] Integrate alternative solution suggestions via Gemini (e.g., different algorithms or optimizations)
- [ ] Write LLM integration tests with prompt guardrails and extension-specific video understanding

## Phase 3: User Experience Enhancements

### 3.1 Theming and Styling
- [x] Implement Stack scene with push/pop animations (extend `LeetCodeScene`)
- [x] Create Queue scene with enqueue/dequeue operations (include circular queue variant)
- [x] Build Deque scene with front/back operations (add monotonic deque logic)
- [x] Write animation reducer tests for deterministic state changes after each operation
- [x] Test animation timing (no overlapping animations; durations match TTS segments)
- [x] Integrate library scenes with JSON storyboard data for dynamic rendering
- [ ] Design a cohesive theme that aligns with LeetCode's aesthetics
- [ ] Ensure responsive design for various screen sizes
- [ ] Add theming and styling (e.g., colors, fonts from `docs/BRANDING.md`)

### 3.2 Animation Library Integration
- [ ] Implement Two Pointers/Sliding Window scenes with pointer movement and window animations
- [ ] Create Tree visualization scenes (BST insertions/deletions, heap sift operations)
- [ ] Build Graph traversal scenes (BFS level expansion, DFS backtracking)
- [ ] Develop DP table fill scenes with cell transitions and backtrack highlights
- [ ] Add Union-Find, Trie, Bit Manipulation, and Matrix/Grid operation scenes
- [ ] Write pattern-specific invariant tests (e.g., BST ordering, heap property preservation)
- [ ] Incorporate animations to enhance user engagement
- [ ] Use animations to guide users through interactive elements

## Phase 4: Testing and Deployment

### 4.1 Testing
- [ ] Set up render job queue with Redis for on-demand video generation
- [ ] Implement automated video embedding and caching for extension
- [ ] Create CI/CD pipeline for extension updates and content validation
- [ ] Build automated testing for extension compatibility with LeetCode updates
- [ ] Conduct thorough testing across different browsers and devices
- [ ] Gather user feedback to identify areas for improvement
- [ ] Comprehensive test coverage (>90% for core modules)
- [ ] Load testing for render farm capacity
- [ ] Accessibility testing (WCAG compliance)
- [ ] Cross-browser compatibility testing

### 4.2 Deployment
- [ ] Implement horizontal scaling for render workers
- [ ] Add caching for TTS segments and rendered assets in extension storage
- [ ] Optimize memory usage for large content sets in extension context
- [ ] Write performance tests for extension load times and video playback
- [ ] Build basic extension UI (popup or sidebar) for video controls
- [ ] Integrate video embedding (e.g., via iframe or custom player) into LeetCode pages
- [ ] Implement manual upload workflow for generated videos to extension storage
- [ ] Set up basic analytics import system (e.g., track video views and interactions)
- [ ] Prepare the extension for submission to the Chrome Web Store
- [ ] Develop a marketing strategy to promote the extension to potential users

## Technical Debt & Maintenance

### Ongoing Tasks
- [ ] Regular dependency updates and security patches
- [ ] Performance monitoring and optimization
- [ ] Content backup and disaster recovery
- [ ] Documentation updates as features evolve
- [ ] Community feedback integration

### Quality Assurance
- [ ] Comprehensive test coverage (>90% for core modules)
- [ ] Load testing for render farm capacity
- [ ] Accessibility testing (WCAG compliance)
- [ ] Cross-browser compatibility testing

## Success Metrics
- [ ] MVP: Extension successfully embeds interactive videos on LeetCode problem pages (Phase 1)
- [ ] Phase 2: Full interactivity with code editing and alternative suggestions
- [ ] Phase 3: Cohesive theming and advanced animations integrated
- [ ] Phase 4: Extension deployed to Chrome Web Store with positive user adoption
- [ ] Performance: Extension loads videos in <2 seconds, <1% failures
- [ ] Quality: >95% test pass rate, seamless LeetCode integration

## Risk Mitigation
- [ ] Scope creep: Strict single-pattern focus per episode
- [ ] Technical debt: Regular refactoring sprints
- [ ] Burnout: Time-boxed development with clear milestones
- [ ] Dependencies: Backup providers for critical services
- [ ] Security: Regular audits of API keys and secrets

## Phase 4: AI-Powered Dynamic Explanation System

### 4.1 Dynamic Content Architecture
- [ ] Implement real-time code analysis engine to detect user approach patterns
- [ ] Create AI-powered content selection system using Gemini API integration
- [ ] Build adaptive explanation templates for different algorithm categories (arrays, trees, graphs, DP, etc.)
- [ ] Develop context-aware narration system with dynamic TTS generation
- [ ] Implement approach transition detection and smooth content adaptation

### 4.2 Visually Stunning Interface Design
- [ ] Design fluid, adaptive UI with smooth animations and morphing effects
- [ ] Implement dynamic canvas system with algorithm-appropriate color schemes
- [ ] Create interactive progress visualization with animated rings and particles
- [ ] Build contextual hint system with breathing animations and smart tooltips
- [ ] Develop approach transition effects with morphing backgrounds and gradients

### 4.3 Dynamic Video Integration
- [ ] Enhance existing animation system for real-time video generation
- [ ] Implement smart video caching and preloading for common approaches
- [ ] Create video segmentation system for modular, reusable content
- [ ] Build real-time video adaptation based on code analysis
- [ ] Develop progressive video loading with skeleton states

### 4.4 Advanced Interactivity Features
- [ ] Implement synchronized code highlighting with video playback
- [ ] Create interactive code editing with real-time video adaptation
- [ ] Build approach comparison system with visual diff animations
- [ ] Develop smart pause/resume system based on user typing activity
- [ ] Implement progress tracking with visual celebrations and milestones

### 4.5 Integrated LeetCode Enhancement
- [ ] Replace static alert with dynamic explanation interface injection
- [ ] Create expandable video player section above existing code editor
- [ ] Implement seamless integration with LeetCode's existing UI patterns
- [ ] Build context detection for current problem and user progress
- [ ] Develop smooth transitions between explanation modes

### 4.6 Technical Architecture Enhancements
- [ ] Create event-driven communication layer between video and code components
- [ ] Implement state synchronization system for progress and user context
- [ ] Build performance optimization with GPU-accelerated animations
- [ ] Develop accessibility features with keyboard navigation and screen reader support
- [ ] Create mobile-responsive design with adaptive layouts

## Development Guidelines
- **TDD First**: Write tests before any implementation
- **Commit Frequently**: Small, focused commits with clear messages
- **Documentation**: Update docs alongside code changes
- **Code Reviews**: Required for all non-trivial changes
- **Testing**: All tests pass before merging to main
- **Backups**: Regular content and configuration backups

