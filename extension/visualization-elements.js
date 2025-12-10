/**
 * Canvas Element Classes for Algorithm Visualizations
 * Modular components for rendering different types of algorithm visualizations
 */

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

export {
  AnimationRenderer,
  BaseElement,
  ArrayElement,
  PointerElement,
  HighlightElement,
  TextElement,
  BarsElement,
  GridElement,
  GraphElement
};
