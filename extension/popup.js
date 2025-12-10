// Popup script for the extension

document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('api-key-input');
  const saveApiKeyButton = document.getElementById('save-api-key');
  const clearApiKeyButton = document.getElementById('clear-api-key');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const openEditorButton = document.getElementById('open-editor');

  // Initialize popup state
  initializePopup();

  // Event listeners
  saveApiKeyButton.addEventListener('click', saveApiKey);
  clearApiKeyButton.addEventListener('click', clearApiKey);
  apiKeyInput.addEventListener('input', handleApiKeyInput);

  openEditorButton.addEventListener('click', function() {
    // Send message to content script to open explainer
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('leetcode.com/problems/')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'open-explainer' });
      } else {
        alert('Please navigate to a LeetCode problem page to use the explainer.');
      }
    });
  });

  // Initialize popup with current API key status
  function initializePopup() {
    checkApiKeyStatus();
  }

  // Check if API key is configured and update UI
  function checkApiKeyStatus() {
    chrome.runtime.sendMessage({ action: 'get-api-key' }, function(response) {
      const hasApiKey = response && response.apiKey && response.apiKey.trim().length > 0;

      if (hasApiKey) {
        statusDot.className = 'status-dot connected';
        statusText.textContent = 'API key configured';
        apiKeyInput.value = '••••••••••••••••••••••••••••••••'; // Masked for security
        openEditorButton.disabled = false;
        openEditorButton.textContent = '🚀 Open Interactive Explainer';
      } else {
        statusDot.className = 'status-dot disconnected';
        statusText.textContent = 'API key not configured';
        apiKeyInput.value = '';
        openEditorButton.disabled = true;
        openEditorButton.textContent = '⚠️ Configure API Key First';
      }
    });
  }

  // Save API key to storage
  function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
      showNotification('Please enter your API key', 'warning');
      return;
    }

    if (apiKey.length < 20) {
      showNotification('API key appears to be too short. Please check and try again.', 'warning');
      return;
    }

    // Show saving state
    saveApiKeyButton.textContent = 'Saving...';
    saveApiKeyButton.disabled = true;

    // Save API key
    chrome.runtime.sendMessage({
      action: 'set-api-key',
      apiKey: apiKey
    }, function(response) {
      if (response && response.success) {
        showNotification('API key saved successfully!', 'success');
        checkApiKeyStatus(); // Refresh status
      } else {
        showNotification('Failed to save API key. Please try again.', 'error');
        saveApiKeyButton.textContent = 'Save';
        saveApiKeyButton.disabled = false;
      }
    });
  }

  // Clear API key from storage
  function clearApiKey() {
    if (confirm('Are you sure you want to clear your API key?')) {
      chrome.runtime.sendMessage({
        action: 'set-api-key',
        apiKey: ''
      }, function(response) {
        if (response && response.success) {
          showNotification('API key cleared', 'info');
          checkApiKeyStatus(); // Refresh status
        } else {
          showNotification('Failed to clear API key', 'error');
        }
      });
    }
  }

  // Handle API key input changes
  function handleApiKeyInput() {
    const hasValue = apiKeyInput.value.trim().length > 0;

    if (hasValue) {
      saveApiKeyButton.disabled = false;
      saveApiKeyButton.textContent = 'Save';
    } else {
      saveApiKeyButton.disabled = true;
      saveApiKeyButton.textContent = 'Save';
    }
  }

  // Show notification
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: ${type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : type === 'success' ? '#28a745' : '#007bff'};
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 10001;
      max-width: 250px;
      font-size: 12px;
      font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }
});
