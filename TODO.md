# Development TODO - Code-Driven LeetCode Explainer Videos

## Overview
This document outlines the development roadmap for building a code-driven, faceless LeetCode explainer video framework using a custom Python-based animation library inspired by Manim. All development follows TDD principles - write tests first, then implement.

## Phase 1: MVP (2-3 weeks) - Core Infrastructure

### 1.1 Project Setup & Schema Foundation
- [x] Initialize monorepo structure (`packages/`, `content/`, `infrastructure/`)
- [x] Set up Python project with virtualenv, black, flake8 (for custom library)
- [x] Create JSON Schema for content model (episode metadata, storyboard, quizzes)
- [x] Write schema validation tests (required fields, invalid combinations)
- [x] Implement CLI tool for schema validation
- [x] Set up Git hooks for schema validation on content changes
- [x] Create `docs/RISKS.md` and `docs/QA.md` for risk assessment and testing strategies

### 1.2 Content Management System
- [x] Create content directory structure with Markdown + front matter format
- [x] Implement front matter parser and content loader
- [x] Write round-trip stability tests (authoring → JSON → render → JSON unchanged)
- [x] Build basic content authoring utilities
- [x] Create sample episode content files with all required fields

### 1.3 Custom Animation Library Setup (Inspired by Manim)
- [x] Set up Python-based animation library project structure (`packages/animations/`)
- [x] Configure FFmpeg integration for video rendering
- [x] Create base `LeetCodeScene` class with `construct()` method for declarative animations
- [x] Implement core Mobject classes (e.g., `DataItem`, `Stack`, `Queue`) with styling and theming
- [x] Write library setup tests (e.g., scene instantiation, basic rendering without errors)
- [x] Implement timing system (TTS segments drive scene durations via `run_time` parameters)
- [x] Write renderer tests for timing alignment and animation state management
- [x] Run initial performance and accessibility tests on base library

### 1.4 Text-to-Speech Integration
- [x] Integrate Google Cloud TTS (WaveNet/Neural2) with fallback options
- [x] Implement TTS segment generation and caching
- [x] Create audio track with BGM ducking
- [x] Write TTS timing tests (sum of scene durations ≈ sum of TTS segments)

### 1.5 Caption & Accessibility System
- [x] Implement auto-captioning from TTS output
- [x] Generate SRT/WebVTT caption files
- [x] Write caption validation tests (valid format, within bounds)
- [x] Create transcript export functionality

### 1.6 Thumbnail Generation
- [x] Set up thumbnail generator structure (inspired by Gemini image gen)
- [x] Build thumbnail generator from episode metadata using Pillow/Cairo
- [x] Implement dynamic text overlays and branding (e.g., problem title, difficulty)
- [x] Write thumbnail tests for consistency and branding compliance

### 1.7 Basic Animation Library (Using Custom Library)
- [ ] Implement Stack scene with push/pop animations (extend `LeetCodeScene`)
- [ ] Create Queue scene with enqueue/dequeue operations (include circular queue variant)
- [ ] Build Deque scene with front/back operations (add monotonic deque logic)
- [ ] Write animation reducer tests for deterministic state changes after each operation
- [ ] Test animation timing (no overlapping animations; durations match TTS segments)
- [ ] Integrate library scenes with JSON storyboard data for dynamic rendering
- [ ] Add theming and styling (e.g., colors, fonts from `docs/BRANDING.md`)

### 1.8 Distribution & Publishing
- [ ] Implement deep link generation and validation
- [ ] Create YouTube description/chapter generator
- [ ] Write distribution tests (chapters increasing, deep links present)
- [ ] Build manual upload workflow
- [ ] Set up basic analytics import system

## Phase 2: Enhanced Authoring & Automation

### 2.1 Web Authoring Interface
- [ ] Set up Next.js frontend application
- [ ] Create episode authoring forms with live preview
- [ ] Implement content validation and error feedback
- [ ] Build preview system with Remotion player integration

### 2.2 AI-Assisted Content Creation
- [ ] Integrate Google Gemini API for content drafting
- [ ] Implement script outline generation from objectives
- [ ] Create quiz generation with answer validation
- [ ] Build recognition cues suggestion system
- [ ] Write LLM integration tests with prompt guardrails

### 2.3 Advanced Pattern Diagrams (Extend Custom Library)
- [ ] Implement Two Pointers/Sliding Window scenes with pointer movement and window animations
- [ ] Create Tree visualization scenes (BST insertions/deletions, heap sift operations)
- [ ] Build Graph traversal scenes (BFS level expansion, DFS backtracking)
- [ ] Develop DP table fill scenes with cell transitions and backtrack highlights
- [ ] Add Union-Find, Trie, Bit Manipulation, and Matrix/Grid operation scenes
- [ ] Write pattern-specific invariant tests (e.g., BST ordering, heap property preservation)

### 2.4 Automated Workflows
- [ ] Set up render job queue with Redis
- [ ] Implement automated chaptering from TTS segments
- [ ] Create upload automation with retry logic
- [ ] Build CI/CD pipeline for content validation and deployment

### 2.5 Performance & Scaling
- [ ] Implement horizontal scaling for render workers
- [ ] Add caching for TTS segments and rendered assets
- [ ] Optimize memory usage for large content sets
- [ ] Write performance tests for render times

## Phase 3: Advanced Features & Polish

### 3.1 Enhanced Animation Library (Further Custom Library Extensions)
- [ ] Implement Union-Find visualization with path compression animations
- [ ] Create Trie animations for prefix operations and word insertions
- [ ] Build Bit Manipulation visualizer with bit shift and mask highlights
- [ ] Develop Matrix/Grid operation animations (spiral traversal, flood fill)
- [ ] Add greedy algorithm decision tree visualizations
- [ ] Optimize library for performance (e.g., caching, memory usage for large scenes)

### 3.2 Interactive Features
- [ ] Create interactive web player with quiz integration
- [ ] Implement branching narratives for alternative approaches
- [ ] Add pause/resume functionality with state persistence
- [ ] Build viewer progress tracking

### 3.3 Localization & Multi-language Support
- [ ] Implement multi-locale caption system
- [ ] Add alternate TTS voices per locale
- [ ] Create translation workflow for content
- [ ] Build locale-specific branding variations

### 3.4 Advanced Analytics
- [ ] Implement detailed retention analysis
- [ ] Add A/B testing for thumbnails and titles
- [ ] Create quiz performance analytics
- [ ] Build automated content performance insights

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
- [ ] MVP: Generate complete 6-9 minute video from content data
- [ ] Phase 2: Web UI allows content creation without CLI
- [ ] Phase 3: Support 100+ episodes with advanced interactions
- [ ] Performance: Render 10 videos/hour on standard hardware
- [ ] Quality: <1% render failures, >95% test pass rate

## Risk Mitigation
- [ ] Scope creep: Strict single-pattern focus per episode
- [ ] Technical debt: Regular refactoring sprints
- [ ] Burnout: Time-boxed development with clear milestones
- [ ] Dependencies: Backup providers for critical services
- [ ] Security: Regular audits of API keys and secrets

## Development Guidelines
- **TDD First**: Write tests before any implementation
- **Commit Frequently**: Small, focused commits with clear messages
- **Documentation**: Update docs alongside code changes
- **Code Reviews**: Required for all non-trivial changes
- **Testing**: All tests pass before merging to main
- **Backups**: Regular content and configuration backups

