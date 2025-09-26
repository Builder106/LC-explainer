## Content Data Model (High Level)

### Core fields
- `id`, `title`, `leetcodeSlug`, `difficulty`, `pattern[]`, `tags[]`
- `objectives[]`, `recognitionCues[]`
- `approaches[]` (name, intuition, complexity, whenToUse)
- `codeSnippets[]` (language, runnable, complexity)
- `storyboard[]` (timecode, visual, voiceover, overlay)
- `quizzes[]` (question, choices, answer, rationale)
- `accessibility` (captions, transcript)
- `distribution` (title, description, keywords, chapters, thumbnailSpec)
- `analytics` (retention, quizStats, CTR)

### Storage format
- Markdown with front matter or JSON
- Validated by JSON Schema; round-trip stable authoring → render → authoring

### Example front matter (sketch)
```yaml
id: two-sum
leetcodeSlug: two-sum
pattern: [hash-map]
objectives:
  - Recognize when value-pair problems map to complements
recognitionCues:
  - Ask: can I store prior info to find complement?
```
