## TDD Plan (Tests First)

### Schema
- Required fields present; invalid combinations rejected
- Round-trip stability authoring → JSON → render → JSON unchanged

### Renderer
- TTS-aligned timing; sum(scene durations) ≈ sum(TTS segments)
- Tracks non-overlapping (except intended overlays)
- Code highlight steps match specified line ranges
- Captions valid SRT/WebVTT and within bounds

### Distribution
- Chapters strictly increasing; all within total duration
- Deep link present and well-formed

### Safety
- Missing assets fail fast with actionable errors
- No outbound calls to `leetcode.com` during render
