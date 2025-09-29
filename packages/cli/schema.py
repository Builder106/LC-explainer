import json
import jsonschema
from typing import Dict, Any

# Basic JSON Schema for episode content (expandable)
EPISODE_SCHEMA = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "title": {"type": "string"},
        "leetcodeSlug": {"type": "string"},
        "difficulty": {"type": "string", "enum": ["Easy", "Medium", "Hard"]},
        "pattern": {"type": "array", "items": {"type": "string"}},
        "objectives": {"type": "array", "items": {"type": "string"}},
        "recognitionCues": {"type": "array", "items": {"type": "string"}},
        "approaches": {"type": "array", "items": {"type": "object"}},
        "codeSnippets": {"type": "array", "items": {"type": "object"}},
        "storyboard": {"type": "array", "items": {"type": "object"}},
        "quizzes": {"type": "array", "items": {"type": "object"}},
        "accessibility": {"type": "object"},
        "distribution": {"type": "object"},
    },
    "required": [
        "id", "title", "leetcodeSlug", "difficulty", "pattern", "objectives"
    ],
}


def validate_episode(data: Dict[str, Any]) -> None:
    """Validate episode data against the schema."""
    jsonschema.validate(instance=data, schema=EPISODE_SCHEMA)


def load_episode_from_file(file_path: str) -> Dict[str, Any]:
    """Load and validate an episode JSON file."""
    with open(file_path, "r") as f:
        data = json.load(f)
    validate_episode(data)
    return data
