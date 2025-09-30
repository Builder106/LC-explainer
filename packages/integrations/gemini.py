import os
import json
from google import genai
from google.genai import types
from typing import Dict, Any, List


class GeminiClient:
    """Client for Google Gemini API for content generation and analysis."""

    def __init__(self, api_key: str = None, model: str = "gemini-1.5-flash"):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError(
                "GEMINI_API_KEY environment variable or api_key parameter required"
            )
        self.client = genai.Client(api_key=self.api_key)
        self.model = model

    def generate_umpire_script(self, problem_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate UMPIRE-structured script for a LeetCode problem."""
        prompt = self._build_umpire_prompt(problem_data)
        response = self.client.models.generate_content(
            model=self.model,
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                system_instruction="You are an expert LeetCode tutor. Use UMPIRE method: Understand, Match, Plan, Implement, Review, Evaluate. Output structured JSON with steps, code, and narration.",
            ),
        )
        return json.loads(response.text)

    def analyze_video(self, video_path: str, prompt: str) -> str:
        """Analyze a video using Gemini's video understanding."""
        video_file = self.client.files.upload(file=video_path)
        response = self.client.models.generate_content(
            model=self.model, contents=[video_file, prompt]
        )
        return response.text

    def _build_umpire_prompt(self, problem_data: Dict[str, Any]) -> str:
        """Build prompt for UMPIRE script generation."""
        title = problem_data.get("title", "Unknown Problem")
        difficulty = problem_data.get("difficulty", "Unknown")
        description = problem_data.get("description", "No description provided.")
        examples = problem_data.get("examples", [])

        return f"""
Generate a detailed UMPIRE script for the LeetCode problem '{title}' (Difficulty: {difficulty}).

Problem Description:
{description}

Examples:
{json.dumps(examples, indent=2)}

Output JSON:
{{
  "objectives": ["learning goal 1", "learning goal 2"],
  "umpireSteps": [
    {{
      "phase": "Understand",
      "explanation": "Restate the problem and constraints.",
      "narration": "In this problem, we need to...",
      "code": "N/A"
    }},
    {{
      "phase": "Match",
      "explanation": "Identify the pattern or data structure.",
      "narration": "This matches the [pattern] pattern because...",
      "code": "N/A"
    }},
    {{
      "phase": "Plan",
      "explanation": "Outline the approach with pseudocode.",
      "narration": "We'll use a [data structure] to...",
      "code": "Pseudocode here"
    }},
    {{
      "phase": "Implement",
      "explanation": "Write the solution code with comments.",
      "narration": "Now, let's implement the code step by step.",
      "code": "def solution(nums, target):\\n    # Comment explaining logic"
    }},
    {{
      "phase": "Review",
      "explanation": "Dry-run with examples and edge cases.",
      "narration": "Let's test with the examples...",
      "code": "N/A"
    }},
    {{
      "phase": "Evaluate",
      "explanation": "Analyze complexity and alternatives.",
      "narration": "This solution runs in O(n) time...",
      "code": "N/A"
    }}
  ],
  "storyboard": [
    {{"time": "00:00", "visual": "Problem introduction", "voiceover": "Today we solve..."}}
  ],
  "quizzes": [
    {{"question": "What is the time complexity?", "choices": ["O(n)", "O(n^2)"], "answer": 0}}
  ]
}}
"""
