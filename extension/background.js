// Background script for the extension

// Initialize extension
chrome.runtime.onInstalled.addListener(function() {
  console.log('LeetCode Explainer extension installed');

  // Set default API key if available
  initializeAPIKey();
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'open-editor') {
    console.log('Opening editor...');
  }

  if (request.action === 'get-api-key') {
    // Return stored API key
    chrome.storage.sync.get(['geminiApiKey'], function(result) {
      sendResponse({ apiKey: result.geminiApiKey || null });
    });
    return true; // Keep message channel open for async response
  }

  if (request.action === 'set-api-key') {
    // Store API key
    chrome.storage.sync.set({ geminiApiKey: request.apiKey }, function() {
      sendResponse({ success: true });
    });
    return true; // Keep message channel open for async response
  }

  if (request.action === 'analyze-code') {
    // Handle code analysis requests
    handleCodeAnalysis(request.code, request.context, sendResponse);
    return true; // Keep message channel open for async response
  }
});

// Initialize API key from storage or environment
function initializeAPIKey() {
  // Check for API key in storage first
  chrome.storage.sync.get(['geminiApiKey'], function(result) {
    if (result.geminiApiKey) {
      console.log('API key loaded from storage');
      return;
    }

    // Check for API key in manifest or environment variables
    const manifest = chrome.runtime.getManifest();
    if (manifest.gemini_api_key) {
      chrome.storage.sync.set({ geminiApiKey: manifest.gemini_api_key });
      console.log('API key loaded from manifest');
    }
  });
}

// Handle code analysis (can be expanded to call actual API)
async function handleCodeAnalysis(code, context, sendResponse) {
  try {
    console.log('Analyzing code in background:', code.substring(0, 50) + '...');

    // For now, simulate analysis - can be replaced with actual API call
    const analysis = await simulateCodeAnalysis(code, context);

    sendResponse({ success: true, analysis });
  } catch (error) {
    console.error('Background analysis failed:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Simulate code analysis (replace with actual Gemini API integration)
async function simulateCodeAnalysis(code, context) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Basic pattern detection
  const lowerCode = code.toLowerCase();

  let approach = 'General';
  if (lowerCode.includes('stack')) approach = 'Stack-based';
  else if (lowerCode.includes('queue')) approach = 'Queue-based';
  else if (lowerCode.includes('two pointers') || (lowerCode.includes('left') && lowerCode.includes('right'))) approach = 'Two Pointers';
  else if (lowerCode.includes('dp') || lowerCode.includes('memo')) approach = 'Dynamic Programming';

  return {
    approach: approach,
    complexity: 'O(n)',
    confidence: 0.8,
    explanation: `Detected ${approach} approach for this problem.`,
    suggestions: ['Consider edge cases', 'Test with sample inputs'],
    key_insights: ['Algorithm follows standard patterns'],
    potential_issues: ['Verify boundary conditions']
  };
}
