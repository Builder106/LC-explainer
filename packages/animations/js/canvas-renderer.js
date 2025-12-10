/**
 * Canvas Renderer Engine for Algorithm Visualizations
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
        background: '#1a1a1a',
        grid: '#2a2a2a',
        primary: 'rgba(0, 175, 122, 1)',    // LeetCode green
        secondary: 'rgba(59, 130, 246, 1)',  // LeetCode blue
        accent: 'rgba(255, 161, 22, 1)',     // LeetCode orange
        text: 'rgba(255, 255, 255, 0.9)',
        textSecondary: 'rgba(255, 255, 255, 0.6)',
        highlight: 'rgba(255, 255, 255, 0.1)',
        border: 'rgba(255, 255, 255, 0.12)'
      },
      light: {
        background: '#ffffff',
        grid: '#f5f5f5',
        primary: 'rgba(0, 175, 122, 1)',    // LeetCode green
        secondary: 'rgba(59, 130, 246, 1)',  // LeetCode blue
        accent: 'rgba(255, 161, 22, 1)',     // LeetCode orange
        text: 'rgba(0, 0, 0, 0.85)',
        textSecondary: 'rgba(0, 0, 0, 0.6)',
        highlight: 'rgba(0, 0, 0, 0.05)',
        border: 'rgba(0, 0, 0, 0.12)'
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
    this.ctx.globalAlpha = 0.3;
    this.ctx.setLineDash([1, 3]);

    const gridSize = 50;

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
    this.ctx.globalAlpha = 1.0;
  }

  drawFPS() {
    const theme = this.getTheme();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.font = '11px "Menlo", "Monaco", "Courier New", monospace';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`${this.fps} fps`, this.width - 12, 20);
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
    } else {
      // Show placeholder when no visualization is loaded
      this.drawPlaceholder();
    }

    this.drawFPS();
  }

  drawPlaceholder() {
    const theme = this.getTheme();
    
    // Draw centered icon using simple shapes
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 2;
    
    // Draw a simple diagram icon
    const centerX = this.width / 2;
    const centerY = this.height / 2 - 30;
    
    // Draw three connected circles
    this.ctx.beginPath();
    this.ctx.arc(centerX - 30, centerY, 12, 0, Math.PI * 2);
    this.ctx.arc(centerX + 30, centerY, 12, 0, Math.PI * 2);
    this.ctx.arc(centerX, centerY + 30, 12, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Draw connecting lines
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - 18, centerY);
    this.ctx.lineTo(centerX + 18, centerY);
    this.ctx.moveTo(centerX - 20, centerY + 10);
    this.ctx.lineTo(centerX - 5, centerY + 20);
    this.ctx.moveTo(centerX + 20, centerY + 10);
    this.ctx.lineTo(centerX + 5, centerY + 20);
    this.ctx.stroke();
    
    // Draw main text
    this.ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Algorithm Visualization', this.width / 2, this.height / 2 + 65);

    // Draw subtitle
    this.ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    this.ctx.fillText('Start typing your solution to see live animations', this.width / 2, this.height / 2 + 88);
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

export { CanvasRenderer, BaseVisualization };
