/**
 * LLM-Powered Animation Generator for Canvas Visualizations
 * Uses AI to analyze code and generate dynamic algorithm animations
 */

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
    return `You are an expert algorithm visualization specialist with access to a powerful animation library. Analyze this code and generate JavaScript code that creates an interactive canvas visualization.

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

**Available Animation Library Classes:**
- CanvasRenderer: Main rendering engine with play/pause/step controls
- BaseVisualization: Base class for algorithm visualizations
- ArrayElement, PointerElement, HighlightElement: Canvas drawing elements
- AnimationRenderer: Converts descriptions to canvas animations

**Task:** Generate a complete JavaScript class that extends BaseVisualization and creates an interactive algorithm animation. The class should:

1. **Analyze the algorithm** and create appropriate visual elements
2. **Show execution step-by-step** with clear visual feedback
3. **Use the animation library classes** to create smooth animations
4. **Be educational and clear** for learning algorithm behavior
5. **Handle edge cases** and provide helpful debugging information

**Generated Class Format:**
\`\`\`javascript
class ${analysis.algorithmType.replace(/[^a-zA-Z0-9]/g, '')}Visualization extends BaseVisualization {
  constructor(renderer, analysis) {
    super(renderer, analysis);
    // Initialize algorithm-specific data
    this.data = this.extractAlgorithmData();
  }

  initialize() {
    // Set up initial visualization state
    // Use renderer.drawRect, renderer.drawText, etc. for canvas operations
  }

  update() {
    // Update animation state based on current step
    // Use this.animateValue() for smooth transitions
  }

  render() {
    // Draw current state to canvas
    // Use renderer.drawXXX() methods for all drawing
  }

  extractAlgorithmData() {
    // Extract relevant data from the user's code for visualization
    return { /* algorithm-specific data */ };
  }
}
\`\`\`

**Guidelines:**
- Focus on the core algorithm logic and data flow
- Create smooth, educational animations that show how the algorithm works
- Use appropriate colors and visual metaphors for clarity
- Include helpful text labels and step descriptions
- Make the visualization interactive and engaging
- Handle different code implementations gracefully

Generate the complete JavaScript class that visualizes this algorithm:`;
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
    if (!response) {
      throw new Error('No response from LLM');
    }

    // Extract JavaScript code from the response
    const codeMatch = response.match(/```javascript\s*([\s\S]*?)\s*```/);
    if (codeMatch) {
      return {
        algorithmType: 'dynamic',
        title: 'AI-Generated Algorithm Visualization',
        description: 'Custom visualization generated by AI based on your code',
        code: codeMatch[1],
        isLLMGenerated: true
      };
    }

    throw new Error('No valid JavaScript code found in LLM response');
  }

  generateTemplateAnimation(analysis) {
    // For now, return a basic fallback - in a real implementation,
    // this would generate a simple visualization class
    return {
      algorithmType: analysis.algorithmType || 'unknown',
      title: 'Basic Visualization',
      description: 'Simple visualization generated as fallback',
      code: `
// Fallback visualization for ${analysis.algorithmType}
class FallbackVisualization extends BaseVisualization {
  constructor(renderer, analysis) {
    super(renderer, analysis);
    this.message = 'Algorithm detected but no visualization available yet';
  }

  initialize() {
    // Simple initialization
  }

  update() {
    // Simple update
  }

  render() {
    this.renderer.drawText(this.message, 50, 100, '#fff', 16);
  }
}`,
      isLLMGenerated: false
    };
  }

  getAnimationCacheKey(analysis, code) {
    return `${analysis.algorithmType}_${btoa(code.slice(0, 50)).slice(0, 10)}`;
  }
}

export { LLMAnimationGenerator };
