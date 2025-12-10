/**
 * Algorithm Detection Engine for Canvas Visualizations
 * Analyzes user code to identify algorithm patterns and approaches
 */

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

        if (animationData && animationData.isLLMGenerated) {
          console.log('AI animation generated:', animationData.title);

          // Execute the generated JavaScript code to create the visualization class
          const visualizationClass = this.executeLLMCode(animationData.code, analysis.algorithmType);

          if (visualizationClass) {
            // Create and set the visualization
            const visualization = new visualizationClass(this.renderer, analysis);
            this.renderer.setVisualization(visualization);
            this.renderer.play();

            // Show analysis results in UI
            this.showAnalysisResults(analysis);

            // Update status to show AI-powered animation
            this.showAnimationStatus(animationData);
          } else {
            console.error('Failed to create visualization from LLM code');
            this.showAnalysisError('Failed to create visualization from AI code');
          }
        } else {
          console.warn('LLM animation generation failed, using fallback');
          // Use fallback visualization
          this.createVisualizationForAlgorithm(analysis);
        }
      } catch (error) {
        console.error('Visualization update failed:', error);
        this.showAnalysisError('Animation generation failed');
      }
    }

    executeLLMCode(code, algorithmType) {
      try {
        // Create a safe execution environment
        const safeCode = `
          // Safe execution environment for LLM-generated code
          (function() {
            "use strict";

            // Make required classes available
            const CanvasRenderer = window.CanvasRenderer;
            const BaseVisualization = window.BaseVisualization;

            // Execute the LLM-generated code
            ${code}

            // Return the generated class
            return ${algorithmType.replace(/[^a-zA-Z0-9]/g, '')}Visualization;
          })();
        `;

        // Execute in a safe context
        const result = new Function('window', safeCode)(window);

        if (result && typeof result === 'function') {
          console.log('Successfully created visualization class from LLM code');
          return result;
        } else {
          console.error('LLM code did not return a valid class');
          return null;
        }
      } catch (error) {
        console.error('Error executing LLM-generated code:', error);
        return null;
      }
    }

    createVisualizationForAlgorithm(analysis) {
      // This method is now deprecated - LLM generates custom visualizations
      // Keeping for backward compatibility but it should not be used
      console.warn('createVisualizationForAlgorithm is deprecated. LLM should generate custom visualizations.');
      return null;
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
      // Show algorithm detection results in the UI - LeetCode style
      const statusElement = document.querySelector('.algorithm-status');
      if (statusElement) {
        const confidencePercent = Math.round(analysis.confidence * 100);
        const algorithmName = analysis.algorithmType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const isDark = document.documentElement.classList.contains('dark') || 
                       document.body.classList.contains('dark');
        const confidenceColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)';
        
        statusElement.innerHTML = `
          <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; background: rgba(0, 175, 122, 0.08); border-radius: 4px; border: 1px solid rgba(0, 175, 122, 0.15);">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(0, 175, 122, 1)">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span style="font-size: 11px; color: rgba(0, 175, 122, 1); font-weight: 500;">${algorithmName}</span>
            <span style="font-size: 10px; color: ${confidenceColor}; font-weight: 400;">${confidencePercent}%</span>
          </div>
        `;
      }
    }

  showAnalysisError(error) {
    const statusElement = document.querySelector('.algorithm-status');
    if (statusElement) {
      const isDark = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark');
      const errorTextColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)';
      
      statusElement.innerHTML = `
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; background: rgba(239, 68, 68, 0.08); border-radius: 4px; border: 1px solid rgba(239, 68, 68, 0.15);">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(239, 68, 68, 1)" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <span style="font-size: 11px; color: rgba(239, 68, 68, 1); font-weight: 500;">Error</span>
          <span style="font-size: 10px; color: ${errorTextColor}; font-weight: 400;">${error}</span>
        </div>
      `;
    }
  }

    showAnimationStatus(animationData) {
      const statusElement = document.querySelector('.algorithm-status');
      if (statusElement) {
        const existingContent = statusElement.innerHTML;
        const iconSvg = animationData.isLLMGenerated 
          ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(59, 130, 246, 1)"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg>'
          : '<svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(59, 130, 246, 1)"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>';

        statusElement.innerHTML = `
          ${existingContent}
          <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; background: rgba(59, 130, 246, 0.08); border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.15); margin-left: 8px;">
            ${iconSvg}
            <span style="font-size: 11px; color: rgba(59, 130, 246, 1); font-weight: 500;">${animationData.title}</span>
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

export { AlgorithmDetector, CodeSynchronizer };
