# Interactive LeetCode Explainer Chrome Extension

## Installation Instructions

### Step 1: Load the Extension in Chrome

1. Open **Google Chrome** (or any Chromium-based browser like Edge, Brave, etc.)
2. Navigate to `chrome://extensions/`
3. Enable **"Developer mode"** using the toggle switch in the top-right corner
4. Click **"Load unpacked"**
5. Select this folder: `/Users/yinkavaughan/My Drive (yvaughan@wesleyan.edu)/CS/LC-explainer/extension`
6. The extension should now appear in your extensions list

### Step 2: Test the Extension

1. Navigate to any LeetCode problem, for example:
   - https://leetcode.com/problems/trapping-rain-water-ii/
   - https://leetcode.com/problems/two-sum/

2. Look for the **"Explainer"** pill button near the "Leet" tab in the interface

3. Open Chrome DevTools (press `F12` or right-click → Inspect) and check the **Console** tab for messages:
   - Success: `"Explainer pill injected successfully next to Leet tab"`
   - Debug info: Look for logs starting with `=== INJECT PILL` or `Leet panel detected`

4. Click the **"Explainer"** pill to open the algorithm visualization canvas in the Code tab

### Step 3: Inspect the Injected Editor

Scroll down on the problem page to find the **Interactive Code Editor** section that was injected below the problem description. This includes:
- An Ace Editor with syntax highlighting
- **Run Code** button (placeholder for backend integration)
- **Suggest Alternatives** button (placeholder for Gemini AI integration)

## Features

### Current Features
- ✅ "Explainer" pill injected next to "Leet" tab
- ✅ Interactive algorithm visualization canvas in Code tab
- ✅ Real-time code analysis and algorithm detection
- ✅ Light/dark mode support matching LeetCode
- ✅ Compact 28px icon-only control buttons
- ✅ Gemini AI integration for code-aware animations

### Planned Features
- 🔲 Animation library integration (Stack, Queue, Deque scenes)
- 🔲 Advanced visualizations (Trees, Graphs, DP tables)
- 🔲 Interactive debugging with step-through controls
- 🔲 Pattern recognition system

## Troubleshooting

### Extension Not Loading
- Check `chrome://extensions/` for error messages
- Ensure the manifest.json file exists and is valid
- Verify all files are present (manifest.json, content.js, popup.html, etc.)

### Pill Not Appearing
- Open DevTools Console and look for warnings
- The extension retries after 2 seconds if the DOM isn't ready
- Refresh the page and check again

### Code Editor Not Appearing
- Check Console for JavaScript errors
- Verify the content script is injecting properly
- The editor should appear below the problem description

## Development

### File Structure
```
extension/
├── manifest.json       # Extension configuration
├── content.js          # Content script (injects UI into LeetCode)
├── background.js       # Background service worker
├── popup.html          # Extension popup UI
├── popup.js            # Popup script
├── styles.css          # Additional styles
└── README.md           # This file
```

### Making Changes
1. Edit the files in the `extension/` folder
2. Go to `chrome://extensions/`
3. Click the **Reload** button on the extension card
4. Refresh the LeetCode page to see changes

## Next Steps

1. Test the extension on multiple LeetCode problems
2. Integrate with the Python backend for code execution
3. Connect to Gemini API for AI-powered suggestions
4. Add video player for explainer content
5. Implement theming to match LeetCode's design

## Support

For issues or questions, check the main project TODO.md or create an issue in the repository.

