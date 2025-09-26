## Architecture (Cloud + Self-Host)

### Components
- Frontend: Next.js authoring/preview
- Backend: Node/TS or FastAPI for content CRUD and jobs
- LLM: Gemini for outlines/quizzes/cues
- Workers: Remotion renderer, captions, thumbnails
- Storage: Postgres (metadata), S3/GCS (media), Redis/Queue (jobs)
- Deploy: Docker Compose (self-host) or Cloud Run/Kubernetes (cloud)
- Secrets: SOPS/Doppler; per-env configs

### Rendering stack
- Remotion (React/TS) + FFmpeg
- Scenes: code walkthrough, pseudocode, diagrams (SVG), quizzes, titles
- Code rendering: Shiki/Prism → HTML/SVG → token/line highlights/diffs
- Timing: TTS segments drive scene durations; BGM ducking; captions from TTS

### Alternatives
- Python: Manim + MoviePy; Coqui/Piper for self-host TTS
