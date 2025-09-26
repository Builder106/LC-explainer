## Deep Links Policy

### Definition
Deep links are URLs that take viewers directly to a problem page.

### Patterns
- `https://leetcode.com/problems/{slug}/`
- Optional: `https://leetcode.cn/problems/{slug}/`

### Usage
- On-screen CTA, description, pinned comment; optional QR code
- Optional redirector: `https://yourdomain.com/go/leetcode/{slug}?src=youtube` → 302 to canonical

### Tests to enforce
- Valid `{slug}` present per episode
- At least one deep link per episode
- No network calls to LeetCode during render
