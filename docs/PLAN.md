## Code-Driven, Faceless LeetCode Explainer Videos — Plan

### Vision and principles
- **Goal**: Programmatically render concise, pattern-focused explainers that teach recognition and decision-making, not just code.
- **Format**: 6–9 minutes, single-concept focus, consistent style, fully reproducible from data.
- **Rules**: TDD-first; cloud and self-host deployment; Gemini for drafting; no live interaction with LeetCode.

### Audience and scope
- **Audience**: Beginner → intermediate interview prep; time-constrained learners.
- **Scope**: Core patterns (two pointers, sliding window, BFS/DFS, DP, greedy, graphs, trees, heaps) and trade-offs.

### Episode structure
- Hook (what you’ll learn; where it applies)
- Problem restatement (constraints, examples)
- Naive baseline → intuition and pattern choice
- Step-by-step walkthrough (dry-run visuals)
- Complexity and trade-offs
- Alternative approach in 30–60 seconds
- Pitfalls and interview gotchas
- Wrap-up rule of thumb (“If you see X, consider Y”)
- Practice prompts (1–2 similar problems)
- Deep link to problem

### Non-interaction with LeetCode
- No automated browsing, scraping, login, or submission
- Simulate editor/typing/highlights in renderer
- Optional static B‑roll only (no live UI automation)

### Deep links
- Canonical: `https://leetcode.com/problems/{slug}/` (+ optional `.cn`)
- Optional redirect: `https://yourdomain.com/go/leetcode/{slug}?src=youtube`
- Use in on-screen CTA, description, pinned comment; QR optional

### Risks and mitigations
- Scope creep → single-pattern episodes; strict templates
- Flaky renders → deterministic timing via TTS; scene unit tests
- LLM drift → prompt guardrails, examples, human-in-the-loop
- Overproduction time → reusable templates; timeboxed scripting
