// Content script to inject the interactive code editor into LeetCode problem pages
// Canvas-based Algorithm Visualization System

(function() {
  'use strict';

  // Animation library loading system
  window.AnimationLibrary = {
    loaded: false,
    modules: {},

    // Load animation library modules dynamically
    async loadAnimationLibrary() {
      if (this.loaded) return Promise.resolve();

      try {
        console.log('Loading animation library modules...');

        // Load modules in dependency order (as ES6 modules)
        await this.loadScript('canvas-renderer.js', true);
        await this.loadScript('algorithm-detector.js', true);
        await this.loadScript('llm-generator.js', true);
        await this.loadScript('visualization-elements.js', true);
        await this.loadScript('index.js', true);

        this.loaded = true;
        console.log('Animation library loaded successfully');
        return Promise.resolve();
      } catch (error) {
        console.error('Failed to load animation library:', error);
        return Promise.reject(error);
      }
    },

    // Helper to load a script dynamically
    async loadScript(src, isModule = false) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL(src);
        if (isModule) {
          script.type = 'module';
        }
        script.onload = () => {
          console.log(`Loaded: ${src}`);
          resolve();
        };
        script.onerror = (error) => {
          console.error(`Failed to load: ${src}`, error);
          reject(error);
        };
        document.head.appendChild(script);
      });
    }
  };

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'open-explainer') {
      console.log('Opening explainer from popup...');
      openDynamicExplainer();
    }
  });

  // Wait for the page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  async function init() {
    // Load animation library first
    try {
      await window.AnimationLibrary.loadAnimationLibrary();
    } catch (error) {
      console.warn('Animation library loading failed, continuing without animations:', error);
    }
    // Check if we're on a LeetCode problem page
    if (!window.location.href.includes('/problems/')) {
      return;
    }

    // Inject CSS for the editor and pill
    injectCSS();

    // Check if animation library is available
    if (typeof window.CanvasRenderer === 'undefined') {
      console.warn('Animation library not loaded, skipping canvas initialization');
      return;
    }

    // Set up a mutation observer to watch for the Leet panel
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if Leet panel was added - look for the element containing "Leet" text
          let leetTab = Array.from(document.querySelectorAll('*')).find(el =>
            el.textContent.trim() === 'Leet' && (el.tagName === 'DIV' || el.tagName === 'BUTTON' || el.tagName === 'SPAN')
          );

          if (leetTab && !document.querySelector('.leet-helper-pill')) {
            console.log('Leet panel detected, injecting pill...');
            console.log('Leet tab element:', leetTab);
            console.log('Leet tab parent:', leetTab.parentElement);
            injectPill();
          }
        }
      });
    });

    // Start observing the document body
    observer.observe(document.body, { childList: true, subtree: true });

    // Also try immediate injection
    setTimeout(() => {
      console.log('=== INITIAL INJECTION ATTEMPT ===');
      console.log('Document ready state:', document.readyState);
      console.log('Body exists:', !!document.body);

      if (!document.querySelector('.leet-helper-pill')) {
        console.log('No pill found, trying injection...');

        // Also check for Leet tab before injecting
        const leetTabCheck = Array.from(document.querySelectorAll('*')).find(el =>
          el.textContent.trim() === 'Leet' && (el.tagName === 'DIV' || el.tagName === 'BUTTON' || el.tagName === 'SPAN')
        );

        if (leetTabCheck) {
          console.log('Leet tab found for initial injection');
          injectPill();
        } else {
          console.log('Leet tab not found for initial injection, waiting for mutation observer...');
        }
      }
      injectCustomEditorSafe();
    }, 1000);

    // Try again after a longer delay in case dynamic content loads
    setTimeout(() => {
      if (!document.querySelector('.leet-helper-pill')) {
        console.log('=== RETRY INJECTION ATTEMPT ===');
        injectPill();
      }
    }, 3000);
  }

  function injectCustomEditorSafe() {
    // Find the code editor section on LeetCode and inject our custom editor
    const leetCodeEditor = document.querySelector('.code-editor-container') || document.querySelector('.monaco-editor');
    if (leetCodeEditor) {
      injectCustomEditor(leetCodeEditor);
    } else {
      // Fallback: Inject near the problem description
      const problemSection = document.querySelector('.problem-statement') || document.querySelector('main');
      if (problemSection) {
        injectCustomEditor(problemSection);
      }
    }
  }

  // Detect LeetCode theme
  function detectLeetCodeTheme() {
    // Check for dark mode class on html or body
    const isDark = document.documentElement.classList.contains('dark') ||
                   document.body.classList.contains('dark') ||
                   document.documentElement.getAttribute('data-theme') === 'dark' ||
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? 'dark' : 'light';
  }

  // Watch for theme changes
  function watchThemeChanges(callback) {
    const observer = new MutationObserver((mutations) => {
      const theme = detectLeetCodeTheme();
      callback(theme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    return observer;
  }

  function injectCSS() {
    const style = document.createElement('style');
    style.id = 'leetcode-explainer-styles';
    style.textContent = `
      .custom-editor-container {
        position: relative;
        margin-top: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
      }
      .custom-editor-header {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #333;
      }
      .custom-editor {
        width: 100%;
        height: 300px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
        font-size: 14px;
        padding: 10px;
        resize: vertical;
        background-color: #1e1e1e;
        color: #d4d4d4;
        line-height: 1.5;
        tab-size: 4;
      }
      .custom-editor-buttons {
        margin-top: 10px;
        display: flex;
        gap: 10px;
      }
      .custom-editor-buttons button {
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .custom-editor-buttons button:hover {
        background-color: #0056b3;
      }
      .leet-helper-pill {
        display: inline-block;
        padding: 4px 8px;
        background-color: transparent;
        color: inherit;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-left: 8px;
        text-align: center;
      }
      .leet-helper-pill:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      .leet-helper-pill:focus {
        outline: none;
        background-color: rgba(0, 123, 255, 0.1);
        border-color: #007bff;
      }
      .leet-helper-pill {
        min-width: fit-content !important;
        width: auto !important;
        display: flex !important;
        justify-content: space-between !important;
      }
      .leet-helper-pill .flexlayout__tab_button_content {
        display: flex !important;
        align-items: center !important;
      }
      .leet-helper-pill .flexlayout__tab_button_trailing {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        opacity: 1 !important;
      }
      .leet-helper-pill .flexlayout__tab_button_trailing svg {
        opacity: 1 !important;
        visibility: visible !important;
      }
      /* Light Mode (Default) */
      .explainer-video-container {
        position: relative;
        margin-bottom: 16px;
        background: rgba(0, 0, 0, 0.02);
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      }
      .explainer-video-container canvas {
        width: 100%;
        height: 400px;
        background: #1e1e1e;
        display: block;
      }
      .explainer-video-container .viz-header {
        background: rgba(255, 255, 255, 0.9);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        color: rgba(0, 0, 0, 0.85);
      }
      .explainer-video-container .viz-header svg {
        color: rgba(0, 0, 0, 0.45);
      }
      .explainer-video-container .viz-header .viz-title {
        color: rgba(0, 0, 0, 0.85);
      }
      .explainer-video-container .viz-header .algorithm-status {
        color: rgba(0, 0, 0, 0.65);
      }
      .explainer-video-container .btn-secondary {
        background: rgba(0, 0, 0, 0.04);
        color: rgba(0, 0, 0, 0.6);
        border: 1px solid rgba(0, 0, 0, 0.08);
      }
      .explainer-video-container .btn-secondary:hover {
        background: rgba(0, 0, 0, 0.06);
      }
      .explainer-video-container .speed-label {
        color: rgba(0, 0, 0, 0.6);
      }
      .explainer-video-container .speed-value {
        color: rgba(0, 0, 0, 0.85);
      }
      .explainer-video-container .btn-close {
        color: rgba(0, 0, 0, 0.4);
      }
      .explainer-video-container .btn-close:hover {
        color: rgba(0, 0, 0, 0.6);
      }
      
      /* Dark Mode */
      .dark .explainer-video-container,
      html[data-theme="dark"] .explainer-video-container {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      .dark .explainer-video-container canvas,
      html[data-theme="dark"] .explainer-video-container canvas {
        background: #1a1a1a;
      }
      .dark .explainer-video-container .viz-header,
      html[data-theme="dark"] .explainer-video-container .viz-header {
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .dark .explainer-video-container .viz-header svg,
      html[data-theme="dark"] .explainer-video-container .viz-header svg {
        color: rgba(255, 255, 255, 0.5);
      }
      .dark .explainer-video-container .viz-header .viz-title,
      html[data-theme="dark"] .explainer-video-container .viz-header .viz-title {
        color: rgba(255, 255, 255, 0.9);
      }
      .dark .explainer-video-container .viz-header .algorithm-status,
      html[data-theme="dark"] .explainer-video-container .viz-header .algorithm-status {
        color: rgba(255, 255, 255, 0.7);
      }
      .dark .explainer-video-container .btn-secondary,
      html[data-theme="dark"] .explainer-video-container .btn-secondary {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      .dark .explainer-video-container .btn-secondary:hover,
      html[data-theme="dark"] .explainer-video-container .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.12);
        color: rgba(255, 255, 255, 0.85);
      }
      .dark .explainer-video-container .speed-label,
      html[data-theme="dark"] .explainer-video-container .speed-label {
        color: rgba(255, 255, 255, 0.6);
      }
      .dark .explainer-video-container .speed-value,
      html[data-theme="dark"] .explainer-video-container .speed-value {
        color: rgba(255, 255, 255, 0.9);
      }
      .dark .explainer-video-container .btn-close,
      html[data-theme="dark"] .explainer-video-container .btn-close {
        color: rgba(255, 255, 255, 0.4);
      }
      .dark .explainer-video-container .btn-close:hover,
      html[data-theme="dark"] .explainer-video-container .btn-close:hover {
        color: rgba(255, 255, 255, 0.7);
      }
      .explainer-video-container input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        height: 4px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
      }
      .explainer-video-container input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        background: rgba(0, 175, 122, 1);
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .explainer-video-container input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        background: rgba(0, 155, 102, 1);
      }
      .explainer-video-container input[type="range"]::-moz-range-thumb {
        width: 14px;
        height: 14px;
        background: rgba(0, 175, 122, 1);
        border-radius: 50%;
        cursor: pointer;
        border: none;
        transition: all 0.15s ease;
      }
      .explainer-video-container input[type="range"]::-moz-range-thumb:hover {
        transform: scale(1.1);
        background: rgba(0, 155, 102, 1);
      }
      .explainer-video-container button:hover {
        opacity: 0.9;
      }
      .explainer-video-container button:active {
        opacity: 0.8;
      }
    `;
    document.head.appendChild(style);
  }

  function openDynamicExplainer() {
    console.log('Opening video player in Code tab...');
    injectVideoPlayerIntoCodeTab();
  }

  function injectVideoPlayerIntoCodeTab() {
    console.log('Injecting video player into Code tab...');

    // Check if video player already exists to prevent duplicates
    if (document.querySelector('.explainer-video-container')) {
      console.log('Video player already exists, skipping injection');
      showNotification('Video player is already open!', 'info');
      return;
    }

    // Find the Code tab content area
    const codeTabContent = document.querySelector('.code-editor-container, .monaco-editor, [class*="editor"]');

    if (!codeTabContent) {
      console.error('Code tab content not found');
      showNotification('Could not find Code tab to inject video player', 'error');
      return;
    }

    // Create video player container matching LeetCode's design
    const videoContainer = document.createElement('div');
    videoContainer.className = 'explainer-video-container';
    videoContainer.style.cssText = `
      position: relative;
      margin-bottom: 16px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      overflow: hidden;
    `;

    // Create canvas element for algorithm visualization
    const canvas = document.createElement('canvas');
    canvas.id = 'algorithm-canvas';
    canvas.width = 800;
    canvas.height = 400;
    canvas.style.cssText = `
      width: 100%;
      height: 400px;
      background: #1e1e1e;
      display: block;
    `;

    // Detect current theme
    const currentTheme = detectLeetCodeTheme();
    
    // Initialize canvas renderer using imported classes
    const renderer = new window.CanvasRenderer(canvas, {
      width: 800,
      height: 400,
      theme: currentTheme
    });

    // Watch for theme changes and update renderer
    const themeObserver = watchThemeChanges((newTheme) => {
      console.log('Theme changed to:', newTheme);
      if (renderer) {
        renderer.theme = newTheme;
        renderer.render();
      }
    });

    // Initialize algorithm detection and code synchronization using imported classes
    const algorithmDetector = new window.AlgorithmDetector();
    const llmAnimationGenerator = new window.LLMAnimationGenerator();
    const animationRenderer = new window.AnimationRenderer(renderer);
    const codeSynchronizer = new window.CodeSynchronizer(window.customEditor, renderer, algorithmDetector, llmAnimationGenerator, animationRenderer);

    // Start with demo visualization for testing
    setTimeout(() => {
      // Create and set a demo visualization to show the canvas is working
      const demoVisualization = new window.DemoVisualization(renderer);
      renderer.setVisualization(demoVisualization);

      // Start monitoring code changes for algorithm detection
      codeSynchronizer.startMonitoring();
    }, 100);

    // Add header with LeetCode-style controls
    const header = document.createElement('div');
    header.className = 'viz-header';
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 8px 12px; /* tighter like LeetCode */
    `;
    header.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span class="viz-title" style="font-size: 13px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;">Algorithm Visualization</span>
        <div class="algorithm-status" style="font-size: 12px;"></div>
      </div>
      <div style="display: flex; gap: 4px; align-items: center;">
        <button onclick="this.closest('.explainer-video-container').remove()" class="btn-close" style="background: none; border: none; cursor: pointer; padding: 4px; transition: color 0.15s; font-size: 18px; line-height: 1; display: flex; align-items: center; justify-content: center;" title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    videoContainer.appendChild(header);
    videoContainer.appendChild(canvas);

    // Simplified event listeners - just close functionality
    setTimeout(() => {
      // Close button is already handled in the HTML onclick
      console.log('Canvas visualization system loaded with simplified controls');
    }, 200);

    // Insert at the top of the code tab
    codeTabContent.insertBefore(videoContainer, codeTabContent.firstChild);

    console.log('Canvas visualization system injected successfully!');
    showNotification('Canvas visualization loaded! Interactive algorithm animations above your code.', 'success');
  }

  // ============================================================================
  // CANVAS-BASED VISUALIZATION SYSTEM
  // ============================================================================

  /**
   * Core Canvas Renderer Engine
   * Handles all drawing operations and animation loop
   */
  class CanvasRenderer {
    constructor(canvasElement, options = {}) {
      this.canvas = canvasElement;
      this.ctx = canvasElement.getContext('2d');
      this.width = options.width || 800;
      this.height = options.height || 400;
      this.theme = options.theme || 'dark';

      // Animation state
      this.animationFrame = null;
      this.isPlaying = false;
      this.currentVisualization = null;
      this.fps = 0;
      this.lastFrameTime = 0;
      this.animationSpeed = 1.0; // Global animation speed multiplier

      // Performance monitoring
      this.frameCount = 0;
      this.fpsUpdateInterval = 1000; // Update FPS every second

      // State management
      this.visualizationHistory = [];
      this.maxHistorySize = 50;

      // Initialize canvas
      this.setupCanvas();
      this.setupThemes();
    }

    setupCanvas() {
      // Set actual canvas size (for high DPI displays)
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      this.ctx.scale(dpr, dpr);

      // Enable smooth animations
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }

    setupThemes() {
      this.themes = {
        dark: {
          background: '#1e1e1e',
          grid: '#333333',
          primary: '#4CAF50',
          secondary: '#2196F3',
          accent: '#FFC107',
          text: '#ffffff',
          textSecondary: '#cccccc'
        },
        light: {
          background: '#ffffff',
          grid: '#e0e0e0',
          primary: '#2E7D32',
          secondary: '#1976D2',
          accent: '#FF9800',
          text: '#000000',
          textSecondary: '#333333'
        }
      };
    }

    getTheme() {
      return this.themes[this.theme];
    }

    // Core rendering methods
    clear() {
      const theme = this.getTheme();
      this.ctx.fillStyle = theme.background;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawBackground() {
      // Draw grid for better visual reference
      this.drawGrid();
    }

    drawGrid() {
      const theme = this.getTheme();
      this.ctx.strokeStyle = theme.grid;
      this.ctx.lineWidth = 0.5;
      this.ctx.setLineDash([2, 2]);

      const gridSize = 40;

      // Vertical lines
      for (let x = 0; x <= this.width; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= this.height; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();
      }

      this.ctx.setLineDash([]);
    }

    drawFPS() {
      const theme = this.getTheme();
      this.ctx.fillStyle = theme.textSecondary;
      this.ctx.font = '12px monospace';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`FPS: ${this.fps}`, this.width - 10, 20);
    }

    // Animation control
    play() {
      if (!this.currentVisualization) return;

      this.isPlaying = true;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      this.lastFrameTime = performance.now();
      this.animate();
    }

    pause() {
      this.isPlaying = false;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    }

    step() {
      if (!this.currentVisualization) return;

      this.clear();
      this.update();
      this.render();
      this.saveState();
    }

    animate() {
      if (!this.isPlaying) return;

      const now = performance.now();
      const deltaTime = now - this.lastFrameTime;

      // Update FPS counter
      this.frameCount++;
      if (deltaTime >= this.fpsUpdateInterval) {
        this.fps = Math.round((this.frameCount * 1000) / deltaTime);
        this.frameCount = 0;
        this.lastFrameTime = now;
      }

      // Apply speed control to animation timing
      const speedMultiplier = this.animationSpeed;
      const adjustedDeltaTime = deltaTime * speedMultiplier;

      this.clear();
      this.update();
      this.render();

      // Save state periodically for step-backward functionality
      if (this.frameCount % 10 === 0) {
        this.saveState();
      }

      this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    // State management for step-backward functionality
    saveState() {
      if (!this.currentVisualization) return;

      const state = {
        step: this.currentVisualization.step,
        timestamp: performance.now(),
        visualizationData: this.getVisualizationState()
      };

      this.visualizationHistory.push(state);

      // Limit history size
      if (this.visualizationHistory.length > this.maxHistorySize) {
        this.visualizationHistory.shift();
      }
    }

    getVisualizationState() {
      if (!this.currentVisualization) return null;

      // Extract relevant state from current visualization
      return {
        algorithmType: this.currentVisualization.data?.algorithmType || 'unknown',
        step: this.currentVisualization.step,
        data: this.currentVisualization.data
      };
    }

    restoreState(stateIndex) {
      if (stateIndex < 0 || stateIndex >= this.visualizationHistory.length) return;

      const state = this.visualizationHistory[stateIndex];
      if (!state || !this.currentVisualization) return;

      // Restore visualization state
      this.currentVisualization.step = state.step;
      this.render();
    }

    canStepBackward() {
      return this.visualizationHistory.length > 1;
    }

    canStepForward() {
      return this.currentVisualization && this.currentVisualization.step < this.getMaxSteps();
    }

    getMaxSteps() {
      // Estimate maximum steps based on visualization type
      if (!this.currentVisualization) return 0;

      // This is a simplified estimate - in practice would be more sophisticated
      return 100;
    }

    update() {
      if (this.currentVisualization) {
        this.currentVisualization.update();
      }
    }

    render() {
      this.drawBackground();

      if (this.currentVisualization) {
        this.currentVisualization.render();
      }

      this.drawFPS();
    }

    setVisualization(visualization) {
      this.currentVisualization = visualization;
      if (visualization) {
        visualization.initialize();
      }
    }

    // Shape drawing utilities
    drawRect(x, y, width, height, color, filled = true) {
      this.ctx.fillStyle = color;
      if (filled) {
        this.ctx.fillRect(x, y, width, height);
      } else {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
      }
    }

    drawCircle(x, y, radius, color, filled = true) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);

      if (filled) {
        this.ctx.fillStyle = color;
        this.ctx.fill();
      } else {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    }

    drawLine(x1, y1, x2, y2, color, width = 2) {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = width;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }

    drawText(text, x, y, color, fontSize = 14, textAlign = 'left') {
      const theme = this.getTheme();
      this.ctx.fillStyle = color || theme.text;
      this.ctx.font = `${fontSize}px monospace`;
      this.ctx.textAlign = textAlign;
      this.ctx.fillText(text, x, y);
    }

    // Animation easing functions
    easeInOut(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    easeOut(t) {
      return t * (2 - t);
    }
  }

  /**
   * Base Visualization Class
   * All algorithm visualizations extend this class
   */
  class BaseVisualization {
    constructor(renderer, data = {}) {
      this.renderer = renderer;
      this.data = data;
      this.step = 0;
      this.isAnimating = false;
      this.animationSpeed = 1.0; // Animation speed multiplier
      this.stepSize = 1; // How much to advance per step
      this.maxSteps = 100; // Maximum steps for this visualization
    }

    initialize() {
      // Override in subclasses
      throw new Error('Subclasses must implement initialize()');
    }

    update() {
      // Override in subclasses
      throw new Error('Subclasses must implement update()');
    }

    render() {
      // Override in subclasses
      throw new Error('Subclasses must implement render()');
    }

    stepForward() {
      if (this.canStepForward()) {
        this.step = Math.min(this.maxSteps, this.step + this.stepSize);
        this.render();
        this.renderer.saveState();
      }
    }

    stepBackward() {
      if (this.canStepBackward()) {
        this.step = Math.max(0, this.step - this.stepSize);
        this.render();
        this.renderer.saveState();
      }
    }

    canStepForward() {
      return this.step < this.maxSteps;
    }

    canStepBackward() {
      return this.step > 0;
    }

    reset() {
      this.step = 0;
      this.initialize();
      this.renderer.render();
    }

    // Enhanced animation utilities for subclasses
    animateValue(start, end, duration, callback, easing = 'easeOut') {
      const startTime = performance.now();
      const adjustedDuration = duration / this.animationSpeed; // Apply speed control

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / adjustedDuration, 1);

        // Apply easing function
        const easedProgress = this.applyEasing(progress, easing);
        const current = start + (end - start) * easedProgress;

        if (callback) callback(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }

    applyEasing(t, easingType) {
      switch (easingType) {
        case 'easeIn':
          return t * t;
        case 'easeOut':
          return t * (2 - t);
        case 'easeInOut':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        case 'linear':
        default:
          return t;
      }
    }

    // Animation timing helpers
    getFrameDuration() {
      return 16.67 / this.animationSpeed; // 60fps baseline adjusted by speed
    }

    shouldUpdateThisFrame(frameCount) {
      // Control update frequency based on animation speed
      const updateInterval = Math.max(1, Math.floor(1 / this.animationSpeed));
      return frameCount % updateInterval === 0;
    }
  }

  /**
   * Demo Visualization for testing the canvas system
   */
  class DemoVisualization extends BaseVisualization {
    constructor(renderer) {
      super(renderer);
      this.bars = [];
      this.animationPhase = 0;
    }

    initialize() {
      // Create sample data for visualization
      this.bars = Array.from({length: 20}, (_, i) => ({
        value: Math.random() * 200 + 50,
        x: (i * 35) + 50,
        targetX: (i * 35) + 50,
        currentHeight: 0,
        targetHeight: Math.random() * 200 + 50,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      }));

      this.step = 0;
    }

    update() {
      // Use enhanced animation timing based on speed
      if (!this.shouldUpdateThisFrame(this.step)) {
        return;
      }

      const theme = this.renderer.getTheme();

      // Animate bars growing from bottom with speed control
      this.bars.forEach((bar, index) => {
        const delay = index * 0.1 / this.animationSpeed; // Adjust delay based on speed
        const adjustedStep = this.step * this.animationSpeed;
        const progress = Math.max(0, Math.min(1, (adjustedStep - delay) / 2));

        if (progress > 0) {
          bar.currentHeight = bar.targetHeight * this.applyEasing(progress, 'easeOut');
        }
      });

      // Move to next animation phase with speed-adjusted timing
      const framesPerPhase = Math.max(60, 180 / this.animationSpeed); // Adjust for speed
      if (this.step > framesPerPhase) {
        this.animationPhase++;
        if (this.animationPhase > 3) this.animationPhase = 0;

        // Reset for new phase
        this.bars.forEach((bar, index) => {
          bar.targetHeight = Math.random() * 200 + 50;
          bar.currentHeight = 0;
        });
        this.step = 0;
      }

      this.step++;
    }

    render() {
      const theme = this.renderer.getTheme();
      const ctx = this.renderer.ctx;

      // Draw bars
      this.bars.forEach(bar => {
        const x = bar.x;
        const y = this.renderer.height - bar.currentHeight - 50;
        const width = 25;
        const height = bar.currentHeight;

        // Draw bar
        ctx.fillStyle = bar.color;
        ctx.fillRect(x, y, width, height);

        // Draw bar outline
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

        // Draw value on top
        if (height > 20) {
          this.renderer.drawText(Math.round(bar.value).toString(), x + width/2, y - 5, theme.text, 10, 'center');
        }
      });

      // Draw title
      this.renderer.drawText('🎯 Demo: Animated Array Visualization', 20, 30, theme.text, 16);

      // Draw phase indicator
      const phases = ['Growing', 'Stable', 'Shrinking', 'Reset'];
      this.renderer.drawText(`Phase: ${phases[this.animationPhase] || 'Unknown'}`, 20, 50, theme.textSecondary, 12);
    }
  }

  // ============================================================================
  // LLM-POWERED ANIMATION GENERATION SYSTEM
  // ============================================================================

  /**
   * LLM Animation Generator
   * Uses AI to analyze code and generate dynamic algorithm animations
   */
  class LLMAnimationGenerator {
    constructor() {
      this.geminiAPIKey = null;
      this.animationCache = new Map();
    }

    async initialize() {
      await this.loadGeminiAPIKey();
    }

    async loadGeminiAPIKey() {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'get-api-key' }, (response) => {
          this.geminiAPIKey = response.apiKey || null;
          resolve(this.geminiAPIKey);
        });
      });
    }

    /**
     * Generate animation description for algorithm based on code analysis
     */
    async generateAnimation(analysis, code) {
      if (!this.geminiAPIKey) {
        console.warn('Gemini API key not available, using template animations');
        return this.generateTemplateAnimation(analysis);
      }

      const cacheKey = this.getAnimationCacheKey(analysis, code);
      if (this.animationCache.has(cacheKey)) {
        return this.animationCache.get(cacheKey);
      }

      try {
        const prompt = this.createAnimationPrompt(analysis, code);
        const response = await this.callGeminiAPI(prompt);

        if (response && response.animation) {
          const animation = this.parseAnimationResponse(response);
          this.animationCache.set(cacheKey, animation);
          return animation;
        } else {
          return this.generateTemplateAnimation(analysis);
        }
      } catch (error) {
        console.error('LLM animation generation failed:', error);
        return this.generateTemplateAnimation(analysis);
      }
    }

    createAnimationPrompt(analysis, code) {
      return `You are an expert algorithm visualization specialist. Analyze this code and generate a detailed animation description for a canvas-based visualization.

**Code Analysis:**
- Algorithm Type: ${analysis.algorithmType}
- Confidence: ${Math.round(analysis.confidence * 100)}%
- Approach: ${analysis.approach}
- Data Structures: ${analysis.dataStructures.join(', ') || 'None detected'}
- Time Complexity: ${analysis.complexity}

**Code to Visualize:**
\`\`\`
${code}
\`\`\`

**Task:** Generate a JSON animation description that will be used to create an interactive canvas visualization. The animation should:

1. **Show the algorithm execution step-by-step** with clear visual elements
2. **Highlight key operations** (comparisons, swaps, calculations, etc.)
3. **Use appropriate data structures** for the algorithm type
4. **Include smooth transitions** between states
5. **Be educational and clear** for learning purposes

**Animation JSON Format:**
{
  "algorithmType": "${analysis.algorithmType}",
  "title": "Descriptive title for the visualization",
  "description": "Brief explanation of what the animation shows",
  "duration": 3000, // Animation duration in milliseconds
  "steps": [
    {
      "step": 0,
      "description": "Initial state description",
      "elements": [
        {
          "type": "array|pointer|highlight|text|line|circle|rect",
          "id": "unique_element_id",
          "data": { /* element-specific properties */ },
          "animation": {
            "type": "fadeIn|slideIn|highlight|move|scale",
            "duration": 500,
            "delay": 0,
            "easing": "easeOut"
          }
        }
      ]
    },
    // ... more steps
  ],
  "interactiveElements": [
    {
      "id": "element_id",
      "type": "clickable|draggable|hoverable",
      "action": "showDetails|stepForward|pause|highlight"
    }
  ]
}

**Guidelines:**
- Focus on the core algorithm logic, not implementation details
- Use clear, educational visual metaphors
- Include smooth transitions between states
- Make it interactive where appropriate
- Keep animations concise but comprehensive

Generate the animation JSON:`;
    }

    async callGeminiAPI(prompt) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiAPIKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (text) {
            try {
              // Extract JSON from response
              const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
              if (jsonMatch) {
                return JSON.parse(jsonMatch[1]);
              }
              // Try to parse as direct JSON
              return JSON.parse(text);
            } catch (parseError) {
              console.error('Failed to parse LLM response as JSON:', parseError);
              return null;
            }
          }
        }
      } catch (error) {
        console.error('Gemini API call failed:', error);
      }

      return null;
    }

    parseAnimationResponse(response) {
      if (!response || !response.steps) {
        throw new Error('Invalid animation response format');
      }

      return {
        algorithmType: response.algorithmType || 'unknown',
        title: response.title || 'Algorithm Visualization',
        description: response.description || 'Interactive algorithm animation',
        duration: response.duration || 3000,
        steps: response.steps,
        interactiveElements: response.interactiveElements || []
      };
    }

    generateTemplateAnimation(analysis) {
      // Fallback to template animations when LLM is not available
      switch (analysis.algorithmType) {
        case 'two-pointers':
          return this.generateTwoPointersTemplate();
        case 'dynamic-programming':
          return this.generateDPTemplate();
        case 'sorting':
          return this.generateSortingTemplate();
        case 'graph-traversal':
          return this.generateGraphTemplate();
        default:
          return this.generateGenericTemplate(analysis);
      }
    }

    generateTwoPointersTemplate() {
      return {
        algorithmType: 'two-pointers',
        title: 'Two Pointers Algorithm',
        description: 'Visualizing two pointers traversing an array',
        duration: 4000,
        steps: [
          {
            step: 0,
            description: 'Initialize pointers at start and end',
            elements: [
              {
                type: 'array',
                id: 'main-array',
                data: { values: [3, 7, 2, 9, 1, 8, 4], x: 100, y: 200 },
                animation: { type: 'fadeIn', duration: 500 }
              },
              {
                type: 'pointer',
                id: 'left-pointer',
                data: { position: 0, label: 'L', color: '#FF9800' },
                animation: { type: 'slideIn', duration: 300, delay: 200 }
              },
              {
                type: 'pointer',
                id: 'right-pointer',
                data: { position: 6, label: 'R', color: '#2196F3' },
                animation: { type: 'slideIn', duration: 300, delay: 400 }
              }
            ]
          },
          {
            step: 1,
            description: 'Move pointers based on sum comparison',
            elements: [
              {
                type: 'highlight',
                id: 'comparison',
                data: { indices: [0, 6], color: '#FFC107' },
                animation: { type: 'highlight', duration: 800, delay: 100 }
              }
            ]
          }
        ]
      };
    }

    generateDPTemplate() {
      return {
        algorithmType: 'dynamic-programming',
        title: 'Dynamic Programming Table',
        description: 'Building DP table with optimal substructure',
        duration: 3500,
        steps: [
          {
            step: 0,
            description: 'Initialize DP table',
            elements: [
              {
                type: 'grid',
                id: 'dp-table',
                data: { rows: 4, cols: 6, values: Array(24).fill(0) },
                animation: { type: 'fadeIn', duration: 400 }
              }
            ]
          }
        ]
      };
    }

    generateSortingTemplate() {
      return {
        algorithmType: 'sorting',
        title: 'Sorting Algorithm',
        description: 'Visualizing element comparisons and swaps',
        duration: 3000,
        steps: [
          {
            step: 0,
            description: 'Unsorted array',
            elements: [
              {
                type: 'bars',
                id: 'sort-array',
                data: { values: [64, 34, 25, 12, 22, 11, 90] },
                animation: { type: 'fadeIn', duration: 300 }
              }
            ]
          }
        ]
      };
    }

    generateGraphTemplate() {
      return {
        algorithmType: 'graph-traversal',
        title: 'Graph Traversal',
        description: 'BFS/DFS traversal visualization',
        duration: 4000,
        steps: [
          {
            step: 0,
            description: 'Graph structure',
            elements: [
              {
                type: 'graph',
                id: 'traversal-graph',
                data: { nodes: 6, edges: [[0,1],[0,2],[1,3],[2,4],[3,5]] },
                animation: { type: 'fadeIn', duration: 500 }
              }
            ]
          }
        ]
      };
    }

    generateGenericTemplate(analysis) {
      return {
        algorithmType: analysis.algorithmType || 'unknown',
        title: `${analysis.algorithmType || 'Algorithm'} Visualization`,
        description: `Interactive visualization for ${analysis.approach}`,
        duration: 2500,
        steps: [
          {
            step: 0,
            description: 'Algorithm execution',
            elements: [
              {
                type: 'text',
                id: 'algorithm-info',
                data: { text: `Detected: ${analysis.algorithmType}\nApproach: ${analysis.approach}`, x: 50, y: 100 },
                animation: { type: 'fadeIn', duration: 400 }
              }
            ]
          }
        ]
      };
    }

    getAnimationCacheKey(analysis, code) {
      return `${analysis.algorithmType}_${btoa(code.slice(0, 50)).slice(0, 10)}`;
    }
  }

  /**
   * Animation Parser and Canvas Renderer
   * Converts LLM animation descriptions into canvas visualizations
   */
  class AnimationRenderer {
    constructor(canvasRenderer) {
      this.renderer = canvasRenderer;
      this.currentAnimation = null;
      this.animationState = {};
      this.elementRegistry = new Map();
    }

    async renderAnimation(animationData) {
      this.currentAnimation = animationData;
      this.animationState = { currentStep: 0, isPlaying: false };
      this.elementRegistry.clear();

      // Initialize animation state
      this.initializeAnimation();

      // Start animation sequence
      this.playAnimation();
    }

    initializeAnimation() {
      if (!this.currentAnimation || !this.currentAnimation.steps) return;

      // Set up initial state for all elements
      this.currentAnimation.steps[0].elements.forEach(element => {
        this.registerElement(element);
      });
    }

    registerElement(elementData) {
      const element = this.createCanvasElement(elementData);
      this.elementRegistry.set(elementData.id, element);
    }

    createCanvasElement(elementData) {
      const { type, id, data, animation } = elementData;

      switch (type) {
        case 'array':
          return new ArrayElement(this.renderer, id, data);
        case 'pointer':
          return new PointerElement(this.renderer, id, data);
        case 'highlight':
          return new HighlightElement(this.renderer, id, data);
        case 'text':
          return new TextElement(this.renderer, id, data);
        case 'bars':
          return new BarsElement(this.renderer, id, data);
        case 'grid':
          return new GridElement(this.renderer, id, data);
        case 'graph':
          return new GraphElement(this.renderer, id, data);
        default:
          return new BaseElement(this.renderer, id, data);
      }
    }

    playAnimation() {
      if (!this.currentAnimation) return;

      this.animationState.isPlaying = true;
      this.animateStep(0);
    }

    animateStep(stepIndex) {
      if (stepIndex >= this.currentAnimation.steps.length) {
        this.animationState.isPlaying = false;
        return;
      }

      const step = this.currentAnimation.steps[stepIndex];
      this.executeStep(step, stepIndex);
    }

    async executeStep(step, stepIndex) {
      // Apply animations for this step
      for (const element of step.elements) {
        const canvasElement = this.elementRegistry.get(element.id);
        if (canvasElement && element.animation) {
          await this.animateElement(canvasElement, element.animation);
        }
      }

      // Wait for step duration, then move to next step
      setTimeout(() => {
        if (this.animationState.isPlaying) {
          this.animateStep(stepIndex + 1);
        }
      }, step.duration || 1000);
    }

    async animateElement(element, animation) {
      const { type, duration, delay, easing } = animation;

      // Apply delay
      if (delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Apply animation
      switch (type) {
        case 'fadeIn':
          element.fadeIn(duration);
          break;
        case 'slideIn':
          element.slideIn(duration, easing);
          break;
        case 'highlight':
          element.highlight(duration);
          break;
        case 'move':
          element.move(duration, easing);
          break;
      }
    }

    pauseAnimation() {
      this.animationState.isPlaying = false;
    }

    resumeAnimation() {
      if (!this.animationState.isPlaying) {
        this.animationState.isPlaying = true;
        this.animateStep(this.animationState.currentStep);
      }
    }
  }

  /**
   * Base Canvas Element Class
   */
  class BaseElement {
    constructor(renderer, id, data) {
      this.renderer = renderer;
      this.id = id;
      this.data = data;
      this.isVisible = false;
    }

    render() {
      // Override in subclasses
    }

    fadeIn(duration) {
      this.isVisible = true;
      // Implement fade in animation
    }

    slideIn(duration, easing) {
      this.isVisible = true;
      // Implement slide in animation
    }

    highlight(duration) {
      // Implement highlight animation
    }

    move(duration, easing) {
      // Implement move animation
    }
  }

  /**
   * Array Element for Canvas
   */
  class ArrayElement extends BaseElement {
    constructor(renderer, id, data) {
      super(renderer, id, data);
      this.values = data.values || [];
      this.x = data.x || 100;
      this.y = data.y || 200;
      this.barWidth = data.barWidth || 40;
      this.barHeight = data.barHeight || 20;
    }

    render() {
      if (!this.isVisible) return;

      this.values.forEach((value, index) => {
        const barX = this.x + (index * (this.barWidth + 5));
        const barY = this.y - (value * this.barHeight);

        this.renderer.drawRect(barX, barY, this.barWidth, value * this.barHeight, '#4CAF50', true);
        this.renderer.drawText(value.toString(), barX + this.barWidth/2, barY - 5, '#fff', 12, 'center');
      });
    }
  }

  /**
   * Pointer Element for Canvas
   */
  class PointerElement extends BaseElement {
    constructor(renderer, id, data) {
      super(renderer, id, data);
      this.position = data.position || 0;
      this.label = data.label || '';
      this.color = data.color || '#FF9800';
    }

    render() {
      if (!this.isVisible) return;

      const arrayElement = this.renderer.currentVisualization?.elements?.find(el => el.id === 'main-array');
      if (!arrayElement) return;

      const arrayData = arrayElement.data;
      const barX = arrayData.x + (this.position * (arrayData.barWidth + 5));
      const barY = arrayData.y;

      // Draw pointer triangle
      this.renderer.ctx.fillStyle = this.color;
      this.renderer.ctx.beginPath();
      this.renderer.ctx.moveTo(barX + arrayData.barWidth/2, barY - 30);
      this.renderer.ctx.lineTo(barX + arrayData.barWidth/2 - 8, barY - 15);
      this.renderer.ctx.lineTo(barX + arrayData.barWidth/2 + 8, barY - 15);
      this.renderer.ctx.closePath();
      this.renderer.ctx.fill();

      // Draw label
      this.renderer.drawText(this.label, barX + arrayData.barWidth/2, barY - 35, '#fff', 14, 'center');
    }
  }

  /**
   * Highlight Element for Canvas
   */
  class HighlightElement extends BaseElement {
    constructor(renderer, id, data) {
      super(renderer, id, data);
      this.indices = data.indices || [];
      this.color = data.color || '#FFC107';
    }

    render() {
      if (!this.isVisible) return;

      const arrayElement = this.renderer.currentVisualization?.elements?.find(el => el.id === 'main-array');
      if (!arrayElement) return;

      const arrayData = arrayElement.data;
      this.indices.forEach(index => {
        const barX = arrayData.x + (index * (arrayData.barWidth + 5));
        const barY = arrayData.y - (arrayData.values[index] * arrayData.barHeight);

        this.renderer.drawRect(barX, barY, arrayData.barWidth, arrayData.values[index] * arrayData.barHeight, this.color, false);
      });
    }
  }

  /**
   * Text Element for Canvas
   */
  class TextElement extends BaseElement {
    constructor(renderer, id, data) {
      super(renderer, id, data);
      this.text = data.text || '';
      this.x = data.x || 100;
      this.y = data.y || 100;
      this.fontSize = data.fontSize || 16;
      this.color = data.color || '#fff';
    }

    render() {
      if (!this.isVisible) return;

      this.renderer.drawText(this.text, this.x, this.y, this.color, this.fontSize);
    }
  }

  /**
   * Bars Element for Sorting Visualizations
   */
  class BarsElement extends BaseElement {
    constructor(renderer, id, data) {
      super(renderer, id, data);
      this.values = data.values || [];
      this.barWidth = data.barWidth || 30;
      this.barSpacing = data.barSpacing || 5;
    }

    render() {
      if (!this.isVisible) return;

      this.values.forEach((value, index) => {
        const x = 100 + (index * (this.barWidth + this.barSpacing));
        const y = 400 - (value * 3);
        const height = value * 3;

        this.renderer.drawRect(x, y, this.barWidth, height, '#2196F3', true);
        this.renderer.drawText(value.toString(), x + this.barWidth/2, y - 5, '#fff', 10, 'center');
      });
    }
  }

  /**
   * Grid Element for DP Tables
   */
  class GridElement extends BaseElement {
    constructor(renderer, id, data) {
      super(renderer, id, data);
      this.rows = data.rows || 4;
      this.cols = data.cols || 6;
      this.cellWidth = data.cellWidth || 60;
      this.cellHeight = data.cellHeight || 40;
      this.values = data.values || Array(this.rows * this.cols).fill(0);
    }

    render() {
      if (!this.isVisible) return;

      this.values.forEach((value, index) => {
        const row = Math.floor(index / this.cols);
        const col = index % this.cols;
        const x = 150 + (col * this.cellWidth);
        const y = 150 + (row * this.cellHeight);

        this.renderer.drawRect(x, y, this.cellWidth - 2, this.cellHeight - 2, '#4CAF50', true);
        this.renderer.drawText(value.toString(), x + this.cellWidth/2, y + this.cellHeight/2 + 5, '#fff', 12, 'center');
      });
    }
  }

  /**
   * Graph Element for Graph Traversal
   */
  class GraphElement extends BaseElement {
    constructor(renderer, id, data) {
      super(renderer, id, data);
      this.nodes = data.nodes || 6;
      this.edges = data.edges || [];
    }

    render() {
      if (!this.isVisible) return;

      // Draw edges first
      this.edges.forEach(([from, to]) => {
        const fromX = 200 + (from % 3) * 100;
        const fromY = 200 + Math.floor(from / 3) * 100;
        const toX = 200 + (to % 3) * 100;
        const toY = 200 + Math.floor(to / 3) * 100;

        this.renderer.drawLine(fromX, fromY, toX, toY, '#666', 2);
      });

      // Draw nodes
      for (let i = 0; i < this.nodes; i++) {
        const x = 200 + (i % 3) * 100;
        const y = 200 + Math.floor(i / 3) * 100;

        this.renderer.drawCircle(x, y, 20, '#4CAF50', true);
        this.renderer.drawText(String.fromCharCode(65 + i), x, y + 5, '#fff', 14, 'center');
      }
    }
  }

  // ============================================================================
  // ALGORITHM DETECTION ENGINE
  // ============================================================================

  /**
   * Algorithm Detection Engine
   * Analyzes user code to identify algorithm patterns and approaches
   */
  class AlgorithmDetector {
    constructor() {
      this.patterns = this.loadAlgorithmPatterns();
      this.languageParsers = this.loadLanguageParsers();
    }

    /**
     * Main analysis function - detects algorithm from user code
     */
    analyzeCode(code, language = 'javascript') {
      if (!code || code.trim().length < 10) {
        return this.getEmptyAnalysis();
      }

      try {
        const tokens = this.tokenize(code, language);
        const patterns = this.matchPatterns(tokens, code);
        const algorithmType = this.determinePrimaryAlgorithm(patterns);

        return {
          algorithmType: algorithmType,
          confidence: this.calculateConfidence(patterns, algorithmType),
          approach: this.getAlgorithmApproach(algorithmType, patterns),
          dataStructures: this.detectDataStructures(tokens, code),
          complexity: this.estimateComplexity(algorithmType, patterns),
          patterns: patterns,
          language: language,
          codeLength: code.length,
          hasErrors: false
        };
      } catch (error) {
        console.error('Algorithm detection error:', error);
        return this.getErrorAnalysis(error.message);
      }
    }

    /**
     * Tokenize code for pattern matching
     */
    tokenize(code, language) {
      const parser = this.languageParsers[language] || this.languageParsers.javascript;

      return parser.tokenize(code);
    }

    /**
     * Match code against algorithm patterns
     */
    matchPatterns(tokens, code) {
      const matches = {};

      // Test each algorithm pattern
      Object.keys(this.patterns).forEach(algorithm => {
        const pattern = this.patterns[algorithm];
        matches[algorithm] = this.testPattern(pattern, tokens, code);
      });

      return matches;
    }

    /**
     * Test if code matches a specific algorithm pattern
     */
    testPattern(pattern, tokens, code) {
      let score = 0;
      let matchedIndicators = [];

      // Check for required keywords
      if (pattern.keywords) {
        pattern.keywords.forEach(keyword => {
          if (this.containsKeyword(code, keyword)) {
            score += pattern.keywordWeight || 1;
            matchedIndicators.push(`keyword:${keyword}`);
          }
        });
      }

      // Check for structural patterns
      if (pattern.structures) {
        pattern.structures.forEach(structure => {
          if (this.matchesStructure(tokens, structure)) {
            score += pattern.structureWeight || 2;
            matchedIndicators.push(`structure:${structure.type}`);
          }
        });
      }

      // Check for complexity indicators
      if (pattern.complexity) {
        const complexityMatch = this.matchesComplexity(code, pattern.complexity);
        if (complexityMatch) {
          score += pattern.complexityWeight || 1.5;
          matchedIndicators.push(`complexity:${complexityMatch}`);
        }
      }

      // Check for data structure usage
      if (pattern.dataStructures) {
        pattern.dataStructures.forEach(ds => {
          if (this.usesDataStructure(code, ds)) {
            score += pattern.dsWeight || 1.5;
            matchedIndicators.push(`ds:${ds}`);
          }
        });
      }

      return {
        score: score,
        matchedIndicators: matchedIndicators,
        confidence: Math.min(score / (pattern.totalWeight || 5), 1)
      };
    }

    /**
     * Determine the primary algorithm from pattern matches
     */
    determinePrimaryAlgorithm(patterns) {
      let bestAlgorithm = 'unknown';
      let bestScore = 0;

      Object.keys(patterns).forEach(algorithm => {
        if (patterns[algorithm].score > bestScore) {
          bestScore = patterns[algorithm].score;
          bestAlgorithm = algorithm;
        }
      });

      // Require minimum score for confident detection
      return bestScore >= 2 ? bestAlgorithm : 'unknown';
    }

    /**
     * Calculate overall confidence in the detection
     */
    calculateConfidence(patterns, primaryAlgorithm) {
      if (primaryAlgorithm === 'unknown') return 0;

      const primaryScore = patterns[primaryAlgorithm].score;
      const totalScore = Object.values(patterns).reduce((sum, p) => sum + p.score, 0);

      // Normalize confidence based on how much the primary algorithm dominates
      const dominance = primaryScore / Math.max(totalScore, 1);
      return Math.min(primaryScore * 0.2 * dominance, 1);
    }

    /**
     * Get detailed approach description for detected algorithm
     */
    getAlgorithmApproach(algorithmType, patterns) {
      const pattern = this.patterns[algorithmType];
      if (!pattern) return 'Unknown approach';

      return pattern.approach || `${algorithmType} implementation`;
    }

    /**
     * Detect data structures used in the code
     */
    detectDataStructures(tokens, code) {
      const structures = [];

      // Check for array usage
      if (this.usesArray(code)) structures.push('array');

      // Check for hash/map usage
      if (this.usesHashMap(code)) structures.push('hashmap');

      // Check for linked list patterns
      if (this.usesLinkedList(code)) structures.push('linkedlist');

      // Check for tree patterns
      if (this.usesTree(code)) structures.push('tree');

      // Check for graph patterns
      if (this.usesGraph(code)) structures.push('graph');

      // Check for stack patterns
      if (this.usesStack(code)) structures.push('stack');

      // Check for queue patterns
      if (this.usesQueue(code)) structures.push('queue');

      return [...new Set(structures)]; // Remove duplicates
    }

    /**
     * Estimate time complexity based on algorithm and code patterns
     */
    estimateComplexity(algorithmType, patterns) {
      const pattern = this.patterns[algorithmType];
      if (!pattern || !pattern.complexity) return 'O(n) - needs analysis';

      return pattern.complexity;
    }

    /**
     * Load algorithm pattern definitions
     */
    loadAlgorithmPatterns() {
      return {
        'two-pointers': {
          keywords: ['left', 'right', 'start', 'end', 'pointer', 'i < j'],
          structures: [
            { type: 'two-pointer-loop', pattern: /for\s*\(\s*let\s+\w+\s*=\s*0[\s\S]*?for\s*\(\s*let\s+\w+\s*=\s*.*?\.length\s*-\s*1/i }
          ],
          complexity: 'O(n)',
          approach: 'Two pointers technique for linear traversal',
          totalWeight: 6
        },
        'dynamic-programming': {
          keywords: ['dp', 'memo', 'cache', 'subproblem', 'optimal'],
          structures: [
            { type: 'dp-array', pattern: /\[\s*\]\s*=\s*Array|\.fill\(0\)/i },
            { type: 'recursive-dp', pattern: /function.*\(.*\).*\{[\s\S]*?return.*\+.*\}/i }
          ],
          complexity: 'O(n) or O(n²) depending on state',
          approach: 'Dynamic programming with memoization',
          totalWeight: 7
        },
        'binary-search': {
          keywords: ['mid', 'left', 'right', 'binary', 'search', 'middle'],
          structures: [
            { type: 'binary-search-loop', pattern: /while\s*\(\s*left\s*<=\s*right\s*\)/i }
          ],
          complexity: 'O(log n)',
          approach: 'Binary search algorithm',
          totalWeight: 5
        },
        'sliding-window': {
          keywords: ['window', 'slide', 'expand', 'shrink', 'left', 'right'],
          structures: [
            { type: 'window-expansion', pattern: /right\+\+|left\+\+|right\s*\+\s*=\s*1|left\s*\+\s*=\s*1/i }
          ],
          complexity: 'O(n)',
          approach: 'Sliding window technique',
          totalWeight: 5
        },
        'graph-traversal': {
          keywords: ['graph', 'node', 'edge', 'visit', 'bfs', 'dfs', 'queue', 'stack'],
          structures: [
            { type: 'adjacency-list', pattern: /\[\s*\]\s*=\s*\[\s*\]/i },
            { type: 'graph-traversal', pattern: /function.*travers|while.*queue|for.*stack/i }
          ],
          complexity: 'O(V + E)',
          approach: 'Graph traversal algorithm',
          totalWeight: 6
        },
        'sorting': {
          keywords: ['sort', 'sorted', 'bubble', 'quick', 'merge', 'insertion', 'selection'],
          structures: [
            { type: 'sorting-loop', pattern: /for.*i.*<.*\.length.*for.*j.*=.*i\s*\+\s*1/i }
          ],
          complexity: 'O(n log n) average case',
          approach: 'Sorting algorithm implementation',
          totalWeight: 5
        },
        'hash-table': {
          keywords: ['hash', 'map', 'dictionary', 'key', 'value', 'get', 'set', 'has'],
          structures: [
            { type: 'hash-operations', pattern: /\.get\(|\.set\(|\.has\(|\.delete\(/i }
          ],
          complexity: 'O(1) average case',
          approach: 'Hash table data structure usage',
          totalWeight: 5
        },
        'stack': {
          keywords: ['stack', 'push', 'pop', 'peek', 'lifo'],
          structures: [
            { type: 'stack-operations', pattern: /\.push\(|\.pop\(|\.peek\(/i }
          ],
          complexity: 'O(1) per operation',
          approach: 'Stack data structure usage',
          totalWeight: 4
        },
        'queue': {
          keywords: ['queue', 'enqueue', 'dequeue', 'fifo', 'shift', 'unshift'],
          structures: [
            { type: 'queue-operations', pattern: /\.push\(.*\.shift\(\)|\.unshift\(.*\.pop\(/i }
          ],
          complexity: 'O(1) per operation',
          approach: 'Queue data structure usage',
          totalWeight: 4
        }
      };
    }

    /**
     * Load language-specific parsers
     */
    loadLanguageParsers() {
      return {
        javascript: {
          tokenize: (code) => {
            // Simple tokenization for JavaScript
            const tokens = [];

            // Split by common delimiters while preserving structure
            const words = code.match(/\b\w+\b/g) || [];
            const symbols = code.match(/[^\w\s]/g) || [];

            return {
              identifiers: words.filter(w => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(w)),
              keywords: words.filter(w => /^(function|for|while|if|else|return|let|const|var)$/.test(w)),
              operators: symbols.filter(s => /^[\+\-\*\/\=\<\>\!\|\&\^\%\?]+$/.test(s)),
              brackets: symbols.filter(s => /^[\(\)\[\]\{\}]+$/.test(s)),
              strings: (code.match(/"[^"]*"|'[^']*'/g) || []).map(s => s.slice(1, -1))
            };
          }
        },
        python: {
          tokenize: (code) => {
            // Basic Python tokenization
            const words = code.match(/\b\w+\b/g) || [];
            return {
              identifiers: words.filter(w => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(w)),
              keywords: words.filter(w => /^(def|for|while|if|elif|else|return|import|from|class)$/.test(w)),
              operators: (code.match(/[^\w\s]/g) || []).filter(s => /^[\+\-\*\/\=\<\>\!\|\&\^\%]+$/.test(s)),
              brackets: (code.match(/[^\w\s]/g) || []).filter(s => /^[\(\)\[\]]+$/.test(s))
            };
          }
        }
      };
    }

    // Helper methods for pattern matching
    containsKeyword(code, keyword) {
      return code.toLowerCase().includes(keyword.toLowerCase());
    }

    matchesStructure(tokens, structure) {
      // Simple structure matching - can be enhanced
      return structure.pattern.test(code);
    }

    matchesComplexity(code, expectedComplexity) {
      // Basic complexity pattern matching
      if (expectedComplexity.includes('log n') && /Math\.log|Math\.sqrt|\.length\s*\*\s*Math\.log|\.length\s*\*\s*Math\.sqrt/i.test(code)) {
        return 'log n';
      }
      if (expectedComplexity.includes('n²') && /for.*for|nested.*for|\.length.*\.length/i.test(code)) {
        return 'n²';
      }
      return null;
    }

    usesDataStructure(code, ds) {
      const patterns = {
        array: /\[\s*\]|\.length|\[\d+\]|\.push\(|\.pop\(|\.slice\(|\.splice\(/i,
        hashmap: /Map\(|new Map|\.get\(|\.set\(|\.has\(|\.delete\(|Object\.keys/i,
        linkedlist: /class.*Node|this\.next|this\.prev|\.head|\.tail/i,
        tree: /class.*Tree|this\.left|this\.right|\.root|root\s*=/i,
        graph: /class.*Graph|\[\s*\]\s*=\s*\[\s*\]|adjacency|neighbors/i,
        stack: /Stack\(|push\(|pop\(|\.push\(.*\.pop\(\)|\.pop\(.*\.push\(/i,
        queue: /Queue\(|enqueue|dequeue|\.push\(.*\.shift\(\)|\.shift\(.*\.push\(/i
      };

      return patterns[ds] ? patterns[ds].test(code) : false;
    }

    usesArray(code) { return this.usesDataStructure(code, 'array'); }
    usesHashMap(code) { return this.usesDataStructure(code, 'hashmap'); }
    usesLinkedList(code) { return this.usesDataStructure(code, 'linkedlist'); }
    usesTree(code) { return this.usesDataStructure(code, 'tree'); }
    usesGraph(code) { return this.usesDataStructure(code, 'graph'); }
    usesStack(code) { return this.usesDataStructure(code, 'stack'); }
    usesQueue(code) { return this.usesDataStructure(code, 'queue'); }

    getEmptyAnalysis() {
      return {
        algorithmType: 'unknown',
        confidence: 0,
        approach: 'No code detected',
        dataStructures: [],
        complexity: 'Unknown',
        patterns: {},
        language: 'unknown',
        codeLength: 0,
        hasErrors: false
      };
    }

    getErrorAnalysis(error) {
      return {
        algorithmType: 'error',
        confidence: 0,
        approach: `Detection error: ${error}`,
        dataStructures: [],
        complexity: 'Unknown',
        patterns: {},
        language: 'unknown',
        codeLength: 0,
        hasErrors: true,
        error: error
      };
    }
  }

  /**
   * Code Synchronizer - Monitors code changes and triggers visualization updates
   */
  class CodeSynchronizer {
    constructor(codeEditor, canvasRenderer, algorithmDetector, llmAnimationGenerator, animationRenderer) {
      this.editor = codeEditor;
      this.renderer = canvasRenderer;
      this.detector = algorithmDetector;
      this.llmGenerator = llmAnimationGenerator;
      this.animationRenderer = animationRenderer;
      this.lastAnalyzedCode = '';
      this.analysisCache = new Map();
      this.isMonitoring = false;
    }

    startMonitoring() {
      if (this.isMonitoring) return;

      this.isMonitoring = true;
      console.log('Starting code monitoring for algorithm detection...');

      // Monitor for code changes with debouncing
      this.editor.addEventListener('input', this.debounce(this.analyzeAndUpdate.bind(this), 500));
    }

    stopMonitoring() {
      this.isMonitoring = false;
    }

    analyzeAndUpdate() {
      if (!this.isMonitoring) return;

      const code = this.editor.value;
      if (code === this.lastAnalyzedCode) return;

      this.lastAnalyzedCode = code;

      // Check cache first
      const cacheKey = this.getCacheKey(code);
      if (this.analysisCache.has(cacheKey)) {
        const cached = this.analysisCache.get(cacheKey);
        this.updateVisualization(cached);
        return;
      }

      // Perform new analysis
      this.performAnalysis(code);
    }

    performAnalysis(code) {
      try {
        console.log('Analyzing code for algorithm patterns...');

        // Detect language (simplified - in real implementation would be more sophisticated)
        const language = this.detectLanguage(code);

        // Run algorithm detection
        const analysis = this.detector.analyzeCode(code, language);

        console.log('Algorithm detection results:', analysis);

        // Cache the results
        const cacheKey = this.getCacheKey(code);
        this.analysisCache.set(cacheKey, analysis);

        // Update visualization
        this.updateVisualization(analysis);

      } catch (error) {
        console.error('Code analysis failed:', error);
        this.showAnalysisError(error.message);
      }
    }

    async updateVisualization(analysis) {
      if (!analysis || analysis.algorithmType === 'unknown') {
        console.log('No clear algorithm detected, keeping current visualization');
        return;
      }

      try {
        // Get the current code for LLM analysis
        const code = this.editor.value;

        // Generate AI-powered animation using LLM
        console.log('Generating AI-powered animation for:', analysis.algorithmType);
        const animationData = await this.llmGenerator.generateAnimation(analysis, code);

        if (animationData) {
          console.log('AI animation generated:', animationData.title);

          // Use the animation renderer to display the AI-generated animation
          await this.animationRenderer.renderAnimation(animationData);

          // Show analysis results in UI
          this.showAnalysisResults(analysis);

          // Update status to show AI-powered animation
          this.showAnimationStatus(animationData);
        } else {
          console.warn('LLM animation generation failed, falling back to template');
          // Fallback to template animations if LLM fails
          this.createVisualizationForAlgorithm(analysis);
        }
      } catch (error) {
        console.error('Visualization update failed:', error);
        this.showAnalysisError('Animation generation failed');
      }
    }

    createVisualizationForAlgorithm(analysis) {
      // This is now handled by the LLM animation system
      // This method is kept for backward compatibility
      const algorithmType = analysis.algorithmType;

      switch (algorithmType) {
        case 'two-pointers':
          return new TwoPointersVisualization(this.renderer, analysis);
        case 'dynamic-programming':
          return new DPVisualization(this.renderer, analysis);
        case 'sorting':
          return new SortingVisualization(this.renderer, analysis);
        case 'graph-traversal':
          return new GraphVisualization(this.renderer, analysis);
        case 'binary-search':
          return new GenericVisualization(this.renderer, analysis); // Placeholder for binary search
        case 'sliding-window':
          return new GenericVisualization(this.renderer, analysis); // Placeholder for sliding window
        case 'hash-table':
          return new GenericVisualization(this.renderer, analysis); // Placeholder for hash table
        case 'stack':
          return new GenericVisualization(this.renderer, analysis); // Placeholder for stack
        case 'queue':
          return new GenericVisualization(this.renderer, analysis); // Placeholder for queue
        default:
          return new GenericVisualization(this.renderer, analysis);
      }
    }

    detectLanguage(code) {
      // Simple language detection based on syntax patterns
      if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
        return 'python';
      }
      if (code.includes('function ') || code.includes('const ') || code.includes('let ')) {
        return 'javascript';
      }
      if (code.includes('public class') || code.includes('System.out')) {
        return 'java';
      }
      return 'javascript'; // Default fallback
    }

    getCacheKey(code) {
      // Simple hash for caching - in production would be more sophisticated
      return btoa(code.slice(0, 100)).slice(0, 20);
    }

    showAnalysisResults(analysis) {
      // Show algorithm detection results in the UI
      const statusElement = document.querySelector('.algorithm-status');
      if (statusElement) {
        const confidencePercent = Math.round(analysis.confidence * 100);
        statusElement.innerHTML = `
          <div style="background: #e8f5e8; padding: 8px; border-radius: 4px; margin: 8px 0;">
            <strong>🎯 Detected: ${analysis.algorithmType}</strong><br>
            <small>Confidence: ${confidencePercent}% | Approach: ${analysis.approach}</small><br>
            <small>Data Structures: ${analysis.dataStructures.join(', ') || 'None detected'}</small>
          </div>
        `;
      }
    }

    showAnalysisError(error) {
      const statusElement = document.querySelector('.algorithm-status');
      if (statusElement) {
        statusElement.innerHTML = `
          <div style="background: #ffe8e8; padding: 8px; border-radius: 4px; margin: 8px 0; color: #d32f2f;">
            <strong>❌ Analysis Error:</strong> ${error}
          </div>
        `;
      }
    }

    showAnimationStatus(animationData) {
      const statusElement = document.querySelector('.algorithm-status');
      if (statusElement) {
        const existingContent = statusElement.innerHTML;
        statusElement.innerHTML = `
          ${existingContent}
          <div style="background: #e8f5e8; padding: 8px; border-radius: 4px; margin: 8px 0; color: #2e7d32;">
            <strong>🎨 AI Animation Generated:</strong> ${animationData.title}<br>
            <small>${animationData.description}</small>
          </div>
        `;
      }
    }

    // Debounce utility function
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  }

  // ============================================================================
  // ALGORITHM-SPECIFIC VISUALIZATIONS
  // ============================================================================

  /**
   * Two Pointers Algorithm Visualization
   */
  class TwoPointersVisualization extends BaseVisualization {
    constructor(renderer, analysis) {
      super(renderer, analysis);
      this.array = [];
      this.leftPointer = 0;
      this.rightPointer = 0;
      this.currentSum = 0;
      this.target = 0;
    }

    initialize() {
      // Generate sample array for two pointers demo
      this.array = Array.from({length: 15}, (_, i) => ({
        value: Math.floor(Math.random() * 20) + 1,
        x: (i * 50) + 100,
        y: 200,
        width: 40,
        height: 0,
        color: '#4CAF50'
      }));

      // Sort array for two pointers demo
      this.array.sort((a, b) => a.value - b.value);

      this.leftPointer = 0;
      this.rightPointer = this.array.length - 1;
      this.target = this.array[this.leftPointer].value + this.array[this.rightPointer].value;
      this.step = 0;
    }

    update() {
      // Animate pointer movements
      const animationSpeed = 0.1;

      if (this.step < 20) {
        // Move left pointer right
        this.leftPointer = Math.min(this.array.length - 2, this.leftPointer + animationSpeed);
      } else if (this.step < 40) {
        // Move right pointer left
        this.rightPointer = Math.max(1, this.rightPointer - animationSpeed);
      } else if (this.step < 60) {
        // Check sum and adjust
        const currentSum = this.array[Math.floor(this.leftPointer)].value + this.array[Math.floor(this.rightPointer)].value;
        if (currentSum < this.target) {
          this.leftPointer = Math.min(this.array.length - 2, this.leftPointer + animationSpeed);
        } else if (currentSum > this.target) {
          this.rightPointer = Math.max(1, this.rightPointer - animationSpeed);
        }
      }

      this.step++;
      if (this.step > 80) this.step = 0; // Reset animation
    }

    render() {
      const ctx = this.renderer.ctx;

      // Draw array bars
      this.array.forEach((item, index) => {
        const height = item.value * 8;
        const x = item.x;
        const y = this.renderer.height - height - 50;

        // Highlight pointers
        let color = item.color;
        if (Math.floor(this.leftPointer) === index) color = '#FF9800';
        if (Math.floor(this.rightPointer) === index) color = '#2196F3';

        ctx.fillStyle = color;
        ctx.fillRect(x, y, item.width, height);

        // Draw outlines
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, item.width, height);

        // Draw values
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(item.value.toString(), x + item.width/2, y - 5);
      });

      // Draw pointers
      this.drawPointer(Math.floor(this.leftPointer), '#FF9800', 'L');
      this.drawPointer(Math.floor(this.rightPointer), '#2196F3', 'R');

      // Draw algorithm info
      this.renderer.drawText('🎯 Two Pointers Algorithm', 20, 30, '#fff', 16);
      this.renderer.drawText(`Target Sum: ${this.target}`, 20, 50, '#ccc', 12);
      this.renderer.drawText(`Current Sum: ${this.array[Math.floor(this.leftPointer)].value + this.array[Math.floor(this.rightPointer)].value}`, 20, 70, '#ccc', 12);
    }

    drawPointer(index, color, label) {
      const item = this.array[index];
      if (!item) return;

      const x = item.x + item.width/2;
      const y = this.renderer.height - item.value * 8 - 70;

      // Draw pointer triangle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 8, y - 15);
      ctx.lineTo(x + 8, y - 15);
      ctx.closePath();
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y - 18);
    }
  }

  /**
   * Dynamic Programming Visualization
   */
  class DPVisualization extends BaseVisualization {
    constructor(renderer, analysis) {
      super(renderer, analysis);
      this.dpTable = [];
      this.rows = 5;
      this.cols = 8;
    }

    initialize() {
      // Create DP table for demo (like knapsack or fibonacci)
      this.dpTable = Array(this.rows).fill().map((_, row) =>
        Array(this.cols).fill().map((_, col) => ({
          value: row === 0 ? col : row === 1 ? (col === 0 ? 0 : 1) : Math.floor(Math.random() * 100),
          x: (col * 80) + 100,
          y: (row * 60) + 150,
          width: 70,
          height: 50,
          computed: false
        }))
      );

      this.step = 0;
    }

    update() {
      // Animate DP table filling
      if (this.step < this.rows * this.cols) {
        const row = Math.floor(this.step / this.cols);
        const col = this.step % this.cols;

        if (this.dpTable[row] && this.dpTable[row][col]) {
          this.dpTable[row][col].computed = true;
        }
      }

      this.step++;
      if (this.step > 40) this.step = 0; // Reset after full animation
    }

    render() {
      const ctx = this.renderer.ctx;

      // Draw DP table cells
      this.dpTable.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const x = cell.x;
          const y = cell.y;

          // Cell background
          ctx.fillStyle = cell.computed ? '#4CAF50' : '#333';
          ctx.fillRect(x, y, cell.width, cell.height);

          // Cell border
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cell.width, cell.height);

          // Cell value
          ctx.fillStyle = '#fff';
          ctx.font = '14px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(cell.value.toString(), x + cell.width/2, y + cell.height/2 + 5);
        });
      });

      // Draw algorithm info
      this.renderer.drawText('📊 Dynamic Programming Table', 20, 30, '#fff', 16);
      this.renderer.drawText('Computing optimal solutions...', 20, 50, '#ccc', 12);
    }
  }

  /**
   * Sorting Algorithm Visualization
   */
  class SortingVisualization extends BaseVisualization {
    constructor(renderer, analysis) {
      super(renderer, analysis);
      this.array = [];
      this.comparing = [];
      this.sorted = [];
    }

    initialize() {
      // Create sample array for sorting demo
      this.array = Array.from({length: 20}, (_, i) => ({
        value: Math.floor(Math.random() * 100) + 10,
        x: (i * 35) + 50,
        y: this.renderer.height - 100,
        width: 30,
        height: 0,
        color: '#4CAF50'
      }));

      this.comparing = [];
      this.sorted = [];
      this.step = 0;
    }

    update() {
      // Simple bubble sort animation
      if (this.step < this.array.length) {
        for (let i = 0; i < this.array.length - 1 - this.step; i++) {
          if (this.array[i].value > this.array[i + 1].value) {
            // Swap
            const temp = this.array[i];
            this.array[i] = this.array[i + 1];
            this.array[i + 1] = temp;
          }
        }

        // Animate bar heights
        this.array.forEach((item, index) => {
          const targetHeight = item.value * 3;
          const currentHeight = item.height || 0;
          item.height = currentHeight + (targetHeight - currentHeight) * 0.1;
          item.x = (index * 35) + 50; // Update position after sorting
        });
      }

      this.step++;
      if (this.step > 100) this.step = 0; // Reset animation
    }

    render() {
      const ctx = this.renderer.ctx;

      // Draw array bars
      this.array.forEach((item, index) => {
        const height = item.height || item.value * 3;
        const x = item.x;
        const y = this.renderer.height - height - 50;

        ctx.fillStyle = this.sorted.includes(index) ? '#4CAF50' : '#2196F3';
        ctx.fillRect(x, y, item.width, height);

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, item.width, height);

        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(item.value.toString(), x + item.width/2, y - 3);
      });

      // Draw algorithm info
      this.renderer.drawText('🔄 Sorting Algorithm Visualization', 20, 30, '#fff', 16);
      this.renderer.drawText('Bubble sort in progress...', 20, 50, '#ccc', 12);
    }
  }

  /**
   * Graph Traversal Visualization
   */
  class GraphVisualization extends BaseVisualization {
    constructor(renderer, analysis) {
      super(renderer, analysis);
      this.nodes = [];
      this.edges = [];
      this.visited = [];
      this.currentNode = 0;
    }

    initialize() {
      // Create sample graph for traversal demo
      this.nodes = Array.from({length: 8}, (_, i) => ({
        id: i,
        x: 100 + (i % 4) * 120,
        y: 100 + Math.floor(i / 4) * 120,
        label: String.fromCharCode(65 + i),
        visited: false,
        color: '#4CAF50'
      }));

      // Create some edges (simple connected graph)
      this.edges = [
        [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 7]
      ];

      this.visited = [];
      this.currentNode = 0;
      this.step = 0;
    }

    update() {
      // Animate BFS traversal
      if (this.step < 20 && this.step % 2 === 0) {
        if (this.currentNode < this.nodes.length) {
          this.nodes[this.currentNode].visited = true;
          this.nodes[this.currentNode].color = '#FF9800';
          this.visited.push(this.currentNode);

          // Find next unvisited neighbor
          const neighbors = this.edges
            .filter(edge => edge.includes(this.currentNode))
            .flat()
            .filter(node => node !== this.currentNode && !this.visited.includes(node));

          if (neighbors.length > 0) {
            this.currentNode = neighbors[0];
          }
        }
      }

      this.step++;
      if (this.step > 40) this.step = 0; // Reset animation
    }

    render() {
      const ctx = this.renderer.ctx;

      // Draw edges first
      this.edges.forEach(([from, to]) => {
        const fromNode = this.nodes[from];
        const toNode = this.nodes[to];

        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x + 15, fromNode.y + 15);
        ctx.lineTo(toNode.x + 15, toNode.y + 15);
        ctx.stroke();
      });

      // Draw nodes
      this.nodes.forEach(node => {
        ctx.fillStyle = node.visited ? node.color : '#333';
        ctx.beginPath();
        ctx.arc(node.x + 15, node.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x + 15, node.y + 19);
      });

      // Draw algorithm info
      this.renderer.drawText('🕸️ Graph Traversal Visualization', 20, 30, '#fff', 16);
      this.renderer.drawText(`BFS: Visited ${this.visited.length} nodes`, 20, 50, '#ccc', 12);
    }
  }

  /**
   * Generic Algorithm Visualization (fallback)
   */
  class GenericVisualization extends BaseVisualization {
    constructor(renderer, analysis) {
      super(renderer, analysis);
      this.particles = [];
    }

    initialize() {
      // Create animated particles for generic visualization
      this.particles = Array.from({length: 20}, (_, i) => ({
        x: Math.random() * this.renderer.width,
        y: Math.random() * this.renderer.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 5 + 2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      }));

      this.step = 0;
    }

    update() {
      // Animate particles
      this.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > this.renderer.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > this.renderer.height) particle.vy *= -1;
      });

      this.step++;
    }

    render() {
      const ctx = this.renderer.ctx;

      // Draw particles
      this.particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw algorithm info
      this.renderer.drawText(`🔍 Algorithm: ${this.data.algorithmType || 'Unknown'}`, 20, 30, '#fff', 16);
      this.renderer.drawText(`Confidence: ${Math.round((this.data.confidence || 0) * 100)}%`, 20, 50, '#ccc', 12);
    }
  }

  // Make classes globally available for the extension and LLM-generated code
  window.CanvasRenderer = CanvasRenderer;
  window.BaseVisualization = BaseVisualization;
  window.AlgorithmDetector = AlgorithmDetector;
  window.CodeSynchronizer = CodeSynchronizer;
  window.LLMAnimationGenerator = LLMAnimationGenerator;
  window.AnimationRenderer = AnimationRenderer;
  window.BaseElement = BaseElement;
  window.ArrayElement = ArrayElement;
  window.PointerElement = PointerElement;
  window.HighlightElement = HighlightElement;
  window.TextElement = TextElement;
  window.BarsElement = BarsElement;
  window.GridElement = GridElement;
  window.GraphElement = GraphElement;



  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#007bff'};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10001;
      max-width: 300px;
      font-size: 14px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 4000);
  }

  function injectPill() {
    // Initialize injection counter if it doesn't exist
    if (!window._injectionCounter) {
      window._injectionCounter = 0;
    }
    window._injectionCounter++;

    console.log(`=== INJECT PILL ATTEMPT #${window._injectionCounter} ===`);

    // Check if pill already exists to avoid duplicates
    if (document.querySelector('.leet-helper-pill')) {
      console.log('Explainer pill already exists, skipping injection');
      return;
    }

    // Also check if injection is already in progress
    if (window._pillInjectionInProgress) {
      console.log('Pill injection already in progress, skipping');
      return;
    }

    window._pillInjectionInProgress = true;

    // Find the Leet tab element - look for the element containing "Leet" text first
    let leetTabElement = Array.from(document.querySelectorAll('*')).find(el =>
      el.textContent.trim() === 'Leet' && (el.tagName === 'DIV' || el.tagName === 'BUTTON' || el.tagName === 'SPAN')
    );

    if (!leetTabElement) {
      console.log('No Leet tab element found, aborting pill injection');
      window._pillInjectionInProgress = false;
      return;
    }

    console.log('Found Leet tab element:', leetTabElement.tagName, leetTabElement.className);

    // Find a good container to inject the pill into
    // Strategy: Walk up the DOM tree to find a parent that contains the tab (likely a tab bar container)
    let tabContainer = leetTabElement.parentElement;
    let containerFound = false;
    
    // Walk up to find a container that looks like it holds multiple tabs
    for (let i = 0; i < 5 && tabContainer; i++) {
      console.log(`Checking potential container ${i}:`, tabContainer.tagName, tabContainer.className);
      
      // Check if this container has multiple children (likely a tab bar)
      if (tabContainer.children && tabContainer.children.length > 1) {
        console.log(`Container ${i} has ${tabContainer.children.length} children, using this as tab container`);
        containerFound = true;
        break;
      }
      
      tabContainer = tabContainer.parentElement;
    }

    if (!containerFound || !tabContainer) {
      console.log('Could not find suitable tab container, using direct parent');
      tabContainer = leetTabElement.parentElement;
    }

    // Create the Explainer pill button
    const pillButton = document.createElement('div');
    pillButton.className = 'leet-helper-pill';
    pillButton.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      margin-left: 8px;
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: transparent;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    pillButton.title = 'Click to open interactive explainer';
    pillButton.innerHTML = `<span class="medium whitespace-nowrap font-medium" style="font-size: 13px;">Explainer</span>`;

    // Add hover effect
    pillButton.addEventListener('mouseenter', () => {
      pillButton.style.backgroundColor = 'rgba(0, 123, 255, 0.08)';
    });
    pillButton.addEventListener('mouseleave', () => {
      pillButton.style.backgroundColor = 'transparent';
    });

    const openHandler = (e) => { 
      e.preventDefault(); 
      e.stopPropagation(); 
      console.log('Explainer pill clicked!');
      openDynamicExplainer(); 
    };
    pillButton.addEventListener('mousedown', openHandler, true);
    pillButton.addEventListener('click', openHandler, true);

    // Insert the pill button next to the Leet tab element
    // Try to insert as a sibling of the Leet tab element
    if (leetTabElement.nextSibling) {
      tabContainer.insertBefore(pillButton, leetTabElement.nextSibling);
    } else {
      tabContainer.appendChild(pillButton);
    }

    console.log('Explainer pill button injected successfully');
    window._pillInjectionInProgress = false;

    // Verify injection
    setTimeout(() => {
      const foundPill = document.querySelector('.leet-helper-pill');
      console.log('=== PILL VERIFICATION ===');
      console.log('Pill found in DOM:', !!foundPill);
      if (foundPill) {
        console.log('Pill location:', foundPill.parentElement?.tagName, foundPill.parentElement?.className);
      }
    }, 100);
  }

  function injectCustomEditor(targetElement) {
    const container = document.createElement('div');
    container.className = 'custom-editor-container';
    container.innerHTML = `
      <div class="custom-editor-header">Interactive Code Editor (Modify & Test Solutions)</div>
      <textarea id="custom-editor" class="custom-editor" spellcheck="false">function twoSum(nums, target) {
    // Write your solution here
    
}</textarea>
      <div class="custom-editor-buttons">
        <button id="run-code">Run Code</button>
        <button id="suggest-alternatives">Suggest Alternatives</button>
      </div>
    `;

    // Insert after the target element
    targetElement.parentNode.insertBefore(container, targetElement.nextSibling);

    // Get the editor element
    const editor = document.getElementById('custom-editor');
    window.customEditor = editor;

    // Add event listeners
    document.getElementById('run-code').addEventListener('click', runCode);
    document.getElementById('suggest-alternatives').addEventListener('click', suggestAlternatives);

    // Add basic syntax highlighting with a change listener
    editor.addEventListener('input', function() {
      console.log('Code changed:', editor.value);
      // TODO: Trigger suggestions or validation
    });

    // Add Tab key support for indentation
    editor.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
      }
    });
  }

  function runCode() {
    const code = window.customEditor.value;
    console.log('Running code:', code);
    // TODO: Integrate with backend for execution (e.g., via fetch to your API)
    alert('Code execution not yet implemented. Integrate with JDoodle or your backend.');
  }

  function suggestAlternatives() {
    const code = window.customEditor.value;
    console.log('Suggesting alternatives for:', code);
    // TODO: Call Gemini API for suggestions
    alert('Alternative suggestions not yet implemented. Use Gemini integration.');
  }
})();
