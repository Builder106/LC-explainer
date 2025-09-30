import requests
import json
from typing import Dict, Any, List
from google import genai
from google.genai import types
from .gemini import GeminiClient


class PseudoLeetCodeInterface:
    """Simulate LeetCode interface for LLM-driven problem solving."""

    def __init__(
        self,
        gemini_client: GeminiClient,
        api_base: str = "https://alfa-leetcode-api.onrender.com",
    ):
        self.gemini = gemini_client
        self.api_base = api_base

    def fetch_problem(self, slug: str) -> Dict[str, Any]:
        """Fetch problem data from unofficial LeetCode API."""
        url = f"{self.api_base}/problems/{slug}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()

    def solve_problem(self, slug: str) -> Dict[str, Any]:
        """Fetch problem and generate UMPIRE script using Gemini."""
        problem_data = self.fetch_problem(slug)
        return self.gemini.generate_umpire_script(problem_data)

    def generate_code_snippet(
        self, problem_data: Dict[str, Any], language: str = "python"
    ) -> str:
        """Generate code snippet from UMPIRE script."""
        script = self.gemini.generate_umpire_script(problem_data)
        implement_step = next(
            (step for step in script["umpireSteps"] if step["phase"] == "Implement"),
            None,
        )
        return implement_step["code"] if implement_step else ""

    def suggest_recognition_cues(self, problem_data: Dict[str, Any]) -> List[str]:
        """Suggest recognition cues based on problem patterns."""
        prompt = f"Based on this problem: {problem_data.get('title', '')}. Suggest recognition cues for patterns."
        response = self.gemini.client.models.generate_content(
            model=self.gemini.model,
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                system_instruction="Output JSON array of recognition cues.",
            ),
        )
        return json.loads(response.text)
